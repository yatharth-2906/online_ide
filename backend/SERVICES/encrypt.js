require('dotenv').config();
const crypto = require('crypto');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const iterations = Number(process.env.HASH_ITERATIONS); 
    const keylen = Number(process.env.HASH_KEYLEN); 
    const digest = process.env.HASH_DIGEST; 

    const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
    return { salt, hash };
}

function verifyPassword(password, salt, hash) {
    const iterations = Number(process.env.HASH_ITERATIONS); 
    const keylen = Number(process.env.HASH_KEYLEN); 
    const digest = process.env.HASH_DIGEST;

    const verifyHash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
    return verifyHash === hash;
}

module.exports = {
    hashPassword,
    verifyPassword
};  