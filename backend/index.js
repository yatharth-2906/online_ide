// Packages Imports
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

// Routers and DB Connection
const { connectToDatabase } = require("./connect");
const homeRouter = require("./ROUTES/home");
const authRouter = require("./ROUTES/auth");
const protectedRouter = require("./ROUTES/protected"); // ✅ New protected route

const app = express();
const port = Number(process.env.PORT) || 3000;

//  CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// Middleware Setup
app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Route Mounting
app.use("/auth", authRouter); // Signup, login, logout, token validation
app.use("/", homeRouter); // Home and health check
app.use("/api", protectedRouter); // ✅ Protected routes like /dashboard

// Start Server and Connect to DB
connectToDatabase();
app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});
