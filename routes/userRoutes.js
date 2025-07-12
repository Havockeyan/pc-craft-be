// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserPOJO = require('../pojo/UserPOJO');
const { validateSignup, validateLogin } = require('../middleware/authMiddleware');

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
 *               phone:
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
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */

// Signup API
router.post('/users/signup', validateSignup, async (req, res) => {
    const { username, email, password, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const newUser = new User({ username, email, password, phone });
        await newUser.save();
        const userPojo = new UserPOJO({ username, email, phone });
        res.status(201).json({ message: 'User registered successfully', user: userPojo });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
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
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const userPojo = new UserPOJO({ username: user.username, email: user.email, phone: user.phone });
        res.status(200).json({ message: 'Login successful', user: userPojo });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
