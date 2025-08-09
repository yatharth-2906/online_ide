const jwt = require('jsonwebtoken');

function generateToken(userPayload) {
    const secretKey = process.env.JWT_SECRET;

    const options = {
        expiresIn: '14d'
    };

    const token = jwt.sign(userPayload, secretKey, options);
    return token;
}

function verifyToken(token) {
    const secretKey = process.env.JWT_SECRET;
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null; // Return null if verification fails
    }
}

module.exports = {
    generateToken,
    verifyToken
};