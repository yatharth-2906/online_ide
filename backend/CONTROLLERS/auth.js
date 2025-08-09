require('dotenv').config();
const User = require('../MODELS/User');
const { hashPassword, verifyPassword } = require('../SERVICES/encrypt');
const { generateToken, verifyToken } = require('../SERVICES/auth');

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ "status": "fail", "message": "Missing input field(s)." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ "status": "fail", "message": "User already exists" });
        }

        // Create new user
        const { salt, hash } = hashPassword(password);
        const newUser = await User.create({ name: name, email: email, password_hash: hash, salt: salt });
        const userData = { "id": newUser.id, "name": newUser.name, "email": newUser.email };
        return res.status(201).json({ "status": "success", "message": "User created successfully", user: userData });
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ "status": "fail", "message": "Internal server error" });
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ "status": "fail", "message": "Missing input field(s)." });
        }

        // Check if user exists or not
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ "status": "fail", "message": "User not found" });
        }

        // Verify password
        const isPasswordValid = verifyPassword(password, user.salt, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ "status": "fail", "message": "Invalid password" });
        }

        const userData = { "id": user.id, "name": user.name, "email": user.email };
        const token = generateToken(userData);

        res.cookie("token", token, {
            httpOnly: true, // Prevent access from JavaScript
            secure: process.env.NODE_ENV === "Production", // Use HTTPS in production
            sameSite: "strict", // CSRF protection
            maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
        });
        return res.status(200).json({ "status": "success", "message": "Login successful", "user": userData });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ "status": "fail", "message": "Internal server error" });
    }
}

async function handleLoginValidation(req, res) {
    try {
        const token = req.cookies.token;

        // Validate input
        if (!token) {
            return res.status(401).json({ "status": "fail", "message": "No token provided" });
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            return res.status(401).json({ "status": "fail", "message": "Invalid token" });
        }

        // If token is valid, return user data
        const userData = { "id": decoded.id, "name": decoded.name, "email": decoded.email };
        return res.status(200).json({ "status": "success", "message": "Token is valid", user: userData });
    } catch (error) {
        console.error("Error during token verification:", error);
        res.status(500).json({ "status": "fail", "message": "Internal server error" });
    }
}

function handleUserLogout(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: "strict"
        });
        return res.status(200).json({ status: "success", message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ "status": "fail", "message": "Internal server error" });
    }
}

module.exports = {
    handleUserLogin,
    handleUserLogout,
    handleUserSignup,
    handleLoginValidation
};