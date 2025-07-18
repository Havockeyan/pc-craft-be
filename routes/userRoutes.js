// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserPOJO = require('../pojo/UserPOJO');
const { validateSignup, validateLogin, verifyJWT } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Utility functions for token generation
function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '12h' });
}
function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret', { expiresIn: '3d' });
}

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserPOJO'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */

// Signup API
router.post('/users/signup', validateSignup, async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        const userPojo = new UserPOJO({ username, email });
        // Generate tokens
        const accessToken = generateAccessToken({ id: newUser._id, email: newUser.email });
        const refreshToken = generateRefreshToken({ id: newUser._id, email: newUser.email });
        res.status(201).json({ message: 'User registered successfully', user: userPojo, accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserPOJO'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

// Login API
router.post('/users/login', validateLogin, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const userPojo = new UserPOJO({ username: user.username, email: user.email });
        // Generate tokens
        const accessToken = generateAccessToken({ id: user._id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user._id, email: user.email });
        res.status(200).json({ message: 'Login successful', user: userPojo, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Exchange a refresh token for new access and refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Refresh token required
 *       401:
 *         description: Refresh token expired or invalid
 */
// Add /refresh endpoint
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }
    try {
        // Verify refresh token
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret');
        // Optionally, you can check if the token is blacklisted or revoked here
        // Generate new tokens
        const accessToken = generateAccessToken({ id: payload.id, email: payload.email });
        const newRefreshToken = generateRefreshToken({ id: payload.id, email: payload.email });
        return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Refresh token expired' });
        }
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// Protect all other routes with verifyJWT
router.use(verifyJWT);

module.exports = router;
