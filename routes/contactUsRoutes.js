const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const AdminEmail = require('../models/AdminEmail');
const AdminEmailPOJO = require('../pojo/AdminEmailPOJO');
const Ticket = require('../models/Ticket');
const logError = require('../middleware/logError');

/**
 * @swagger
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
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to send message
 */

// POST /contact-us
router.post('/contact-us', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Save ticket to DB
  let ticket;
  try {
    ticket = new Ticket({ name, email, message, status: 'open' });
    await ticket.save();
  } catch (err) {
    logError(`Failed to save ticket: ${err.stack || err}`);
    return res.status(500).json({ error: 'Failed to save ticket.' });
  }

  // Fetch admin emails from DB
  let adminEmails;
  try {
    const emails = await AdminEmail.find({}, 'email');
    adminEmails = emails.map(e => e.email);
    if (adminEmails.length === 0) {
      return res.status(500).json({ error: 'No admin emails configured.' });
    }
  } catch (err) {
    logError(`Failed to fetch admin emails: ${err.stack || err}`);
    return res.status(500).json({ error: 'Failed to fetch admin emails.' });
  }

  // Setup nodemailer transporter (use your SMTP credentials)
  let transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: adminEmails.join(','),
    subject: `Contact Us Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    const pojoEmails = adminEmails.map(email => new AdminEmailPOJO({ email }));
    res.json({ success: true, message: 'Message sent successfully.', sentTo: pojoEmails, ticket });
  } catch (err) {
    logError(`Failed to send message: ${err.stack || err}`);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;
