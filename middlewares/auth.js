const jwt = require('jsonwebtoken');

const errorUtils = require('../utils/error');

module.exports = (req, res, next) => {
    const header = req.headers.authorization;
    
    if (!header) {
        errorUtils.throwNewError('No token provided', 401);
    }

    const parts = header.split(' ');

    if (parts.length !== 2) {
        errorUtils.throwNewError('Token should be comprised of two parts', 401);
    }

    const prefix = parts[0];
    const token  = parts[1];

    if (prefix !== 'Bearer') {
        errorUtils.throwNewError('Token must have a Bearer prefix', 401);
    }

    let decodedToken;
    
    try {
        decodedToken = jwt.verify(token, 'super-ubber-dubber-secret-key');
    } catch (err) {
        errorUtils.throwNewError('Invalid token', 401);
    }

    if (!decodedToken) {
        errorUtils.throwNewError('Invalid token', 401);
    }

    req.userId = decodedToken.userId;

    next();
}