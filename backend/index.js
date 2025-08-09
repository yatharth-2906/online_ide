// Packages Imports
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');

// Routers Import and DB Connection
const { connectToDatabase } = require('./connect');
const homeRouter = require('./ROUTES/home');
const authRouter = require('./ROUTES/auth');

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

// Starting the server and DB Connection 
connectToDatabase();
app.listen(port, (req, res) => {
  console.log(`Server is running on PORT:${port}`);
});