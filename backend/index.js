// Packages Imports
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const Docker = require('dockerode');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');

// Routers Import and DB Connection
const { connectToDatabase } = require('./connect');
const homeRouter = require('./ROUTES/home');
const authRouter = require('./ROUTES/auth');
const projectRouter = require('./ROUTES/project');

const app = express();
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

// Starting the server and DB Connection 
connectToDatabase();
const server = app.listen(port, (req, res) => {
  console.log(`Server is running on PORT:${port}`);
});

const docker = new Docker();
const io = new Server(server, { cors: corsOptions });
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`Socket ${socket.id} joined project ${projectId}`);
  });

  socket.on('start_terminal', async ({ containerId }) => {
  try {
    const container = docker.getContainer(containerId);

    const exec = await container.exec({
      Cmd: ['/bin/sh'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true
    });

    const stream = await exec.start({
      hijack: true,
      stdin: true,
      Tty: true
    });

    // Send container output to client
    stream.on('data', (chunk) => {
      socket.emit('terminal_data', chunk.toString());
    });

    // Receive input from client
    socket.on('terminal_input', ({ input }) => {
      if (stream.writable) {
        stream.write(input);
      }
    });

    // Resize terminal
    socket.on('resize', ({ cols, rows }) => {
      exec.resize({ h: rows, w: cols }).catch(console.error);
    });

    // Initial setup commands
    stream.write('export TERM=xterm\n');
    stream.write('clear\n');

  } catch (error) {
    console.error('Terminal error:', error);
    socket.emit('terminal_error', error.message);
  }
});

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

module.exports = { io };