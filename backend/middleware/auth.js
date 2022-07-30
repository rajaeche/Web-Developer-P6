
// package jwt pour retrouver le token
const jwt = require('jsonwebtoken');

// le token est analysé et retourné
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = { userId }
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid userID';
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({ message: 'Invalid request!' });
  }
};