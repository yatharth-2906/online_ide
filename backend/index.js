// Packages Imports
require('dotenv').config();
const http = require('http');
const cors = require('cors');
const express = require('express');
const Docker = require('dockerode');
const chokidar = require('chokidar');
const cookieParser = require('cookie-parser');
const { Server: SocketServer } = require('socket.io');

// Routers Import and DB Connection
const { connectToDatabase } = require('./connect');
const homeRouter = require('./ROUTES/home');
const authRouter = require('./ROUTES/auth');
const projectRouter = require('./ROUTES/project');

// Create Server 
const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT) || 3000;

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // allow all origins
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

// Middlewares
app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/project', projectRouter);

// Create Docker Object & Socket.io server
const docker = new Docker();
const io = new SocketServer(server, { cors: '*' });

// Store last input times for rate limiting
const lastInputTimes = new Map();
const containerCleanupTimers = new Map();

const DEBOUNCE_DELAY = 300;
const IGNORED_PATTERNS = [
  /node_modules/
];

let refreshTimer = null;
let lastEmittedTime = 0;

chokidar.watch('./Projects', {
  ignored: IGNORED_PATTERNS,
  ignoreInitial: true
}).on('all', (event, path) => {
  // Skip if this path should be ignored
  if (IGNORED_PATTERNS.some(pattern => pattern.test(path))) {
    return;
  }
  
  // Clear any existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  
  // Set new debounced emit
  refreshTimer = setTimeout(() => {
    io.emit('file:refresh');
    lastEmittedTime = Date.now();
    refreshTimer = null;
  }, DEBOUNCE_DELAY);
});

io.on('connection', async (socket) => {
  console.log('New client connected:', socket.id);

  try {
    const container_id = socket.handshake.query.container_id;

    // Cancel pending cleanup if this container is being reused
    const container = docker.getContainer(container_id);
    if (containerCleanupTimers.has(container_id)) {
      clearTimeout(containerCleanupTimers.get(container_id));
      containerCleanupTimers.delete(container_id);
      console.log(`Cleanup cancelled: container ${container_id} is active again.`);
    }

    const exec = await container.exec({
      Cmd: ['/bin/sh'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Env: [
        'TERM=xterm-256color', // Terminal type with color support
        'COLORTERM=truecolor', // Enable true color
        'LANG=en_US.UTF-8',    // Set language encoding
        'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' // Ensure PATH is set
      ]
    });

    const stream = await exec.start({
      hijack: true,
      stdin: true,
      stdout: true,
      stderr: true,
      Tty: true
    });

    // Return Terminal Output to Client
    stream.on('data', (data) => {
      socket.emit('terminal:data', data.toString('utf-8'));
    });

    // Write Client Input to Terminal with rate limiting
    socket.on('terminal:write', (data) => {
      if (typeof data !== 'string' || data.length > 1000)
        return;

      const lastTime = lastInputTimes.get(socket.id) || 0;
      if (Date.now() - lastTime < 100)
        return;

      lastInputTimes.set(socket.id, Date.now());
      stream.write(data);
    });

    // Handle resize events
    socket.on('terminal:resize', (size) => {
      exec.resize({ w: size.cols, h: size.rows });
    });

    // Terminal Error 
    stream.on('error', (error) => {
      socket.emit('terminal:error', error.message);
    });

    // Cleanup for efficient resource management
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}, scheduling cleanup for container ${container_id}`);

      lastInputTimes.delete(socket.id);
      stream.end();

      if (containerCleanupTimers.has(container_id)) return; // prevent duplicate timers

      // Start a 2-minute timer
      const timer = setTimeout(async () => {
        try {
          console.log(`Stopping container ${container_id} after 2 minutes of inactivity...`);
          await container.stop();
          containerCleanupTimers.delete(container_id);
        } catch (err) {
          console.error(`Error cleaning container ${container_id}:`, err.message);
        }
      }, 2 * 60 * 1000);

      containerCleanupTimers.set(container_id, timer);
    });

  } catch (error) {
    console.error('Terminal error:', error);
    socket.emit('terminal:error', error.message);
  }
});

// Starting the server and DB Connection 
connectToDatabase();
server.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});