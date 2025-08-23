const jwt = require("jsonwebtoken");
const User = require("../MODELS/User");
const { hashPassword } = require("./encrypt");

// Generate JWT Token
function generateToken(userPayload) {
  const secretKey = process.env.JWT_SECRET;
  const options = {
    expiresIn: "14d",
  };

  const token = jwt.sign(userPayload, secretKey, options);
  return token;
}

// Verify JWT Token
function verifyToken(token) {
  const secretKey = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Signup Logic
async function signup(name, email, password) {
  // Hash password and generate salt
  const { salt, hash } = hashPassword(password);

  // Create user in DB
  const user = await User.create({
    name,
    email,
    password_hash: hash,
    salt,
  });

  // Generate JWT token
  const token = generateToken({ id: user.id, email: user.email });

  return { user, token };
}

module.exports = {
  generateToken,
  verifyToken,
  signup,
};
