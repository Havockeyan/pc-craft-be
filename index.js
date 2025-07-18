// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Load environment variables from .env file
require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    // Exit the process if MongoDB is not reachable
    process.exit(1);
});


const User = require('./models/User');

// Sample route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

// Contact Us routes
const contactUsRoutes = require('./routes/contactUsRoutes');
app.use(contactUsRoutes);

// Admin Email routes
const adminEmailRoutes = require('./routes/adminEmailRoutes');
app.use(adminEmailRoutes);

// Swagger UI and Swagger JSDoc setup
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PC Craft API',
    version: '1.0.0',
    description: 'API documentation for PC Craft backend',
  },
  servers: [
    {
      url: 'http://localhost:' + PORT,
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Only scan route files for Swagger docs
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test API endpoint
 *     description: Returns a simple message to verify the API is working.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is working!
 */
app.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

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
 *
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
 *
 * /contact-us:
 *   post:
 *     summary: Send a contact message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 sentTo:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminEmailPOJO'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to send message
 *
 * /admin/emails:
 *   post:
 *     summary: Add a new admin email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin email added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 email:
 *                   $ref: '#/components/schemas/AdminEmailPOJO'
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Failed to add email
 *
 *   get:
 *     summary: Get all admin emails
 *     responses:
 *       200:
 *         description: List of admin emails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emails:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminEmailPOJO'
 *       500:
 *         description: Failed to fetch emails
 *
 * components:
 *   schemas:
 *     UserPOJO:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *     AdminEmailPOJO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 */

// Error logging middleware
const logError = require('./middleware/logError');

// Centralized error handler
app.use((err, req, res, next) => {
    logError(err.stack || err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});