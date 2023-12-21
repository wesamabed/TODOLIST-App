const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).send('A token is required for authorization');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        const user = await User.findById(decoded.userId);
        req.user = user; 
        return next();
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
};

module.exports = verifyToken;
