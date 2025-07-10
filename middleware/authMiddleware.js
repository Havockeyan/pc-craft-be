// authMiddleware.js

module.exports.validateSignup = (req, res, next) => {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    next();
};

module.exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    next();
};
