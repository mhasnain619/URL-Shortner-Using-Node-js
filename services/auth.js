const jwt = require('jsonwebtoken');
const secret = 'hannu@$where';

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secret, { expiresIn: '1h' }); // Optionally, add expiration time
}

function getUser(token) {
    if (!token) return null;

    try {
        return jwt.verify(token, secret);
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return null;
    }
}

module.exports = {
    setUser,
    getUser
};
