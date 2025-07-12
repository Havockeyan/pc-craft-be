const mongoose = require('mongoose');

const adminEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});

const AdminEmail = mongoose.model('AdminEmail', adminEmailSchema);

module.exports = AdminEmail;

