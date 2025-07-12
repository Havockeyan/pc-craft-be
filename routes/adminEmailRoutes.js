const express = require('express');
const router = express.Router();
const AdminEmail = require('../models/AdminEmail');
const AdminEmailPOJO = require('../pojo/AdminEmailPOJO');

/**
 * @swagger
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
 */

// Add a new admin email
router.post('/admin/emails', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  try {
    const newEmail = new AdminEmail({ email });
    await newEmail.save();
    const pojo = new AdminEmailPOJO({ email: newEmail.email });
    res.json({ success: true, email: pojo });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: 'Email already exists.' });
    } else {
      res.status(500).json({ error: 'Failed to add email.' });
    }
  }
});

// Get all admin emails
router.get('/admin/emails', async (req, res) => {
  try {
    const emails = await AdminEmail.find({}, 'email');
    const pojoEmails = emails.map(e => new AdminEmailPOJO({ email: e.email }));
    res.json({ emails: pojoEmails });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch emails.' });
  }
});

module.exports = router;
