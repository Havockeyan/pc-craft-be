// Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: { 
        type: String, 
        required: true,
        unique: true
    },
    description: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema); 