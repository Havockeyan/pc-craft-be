// Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { 
        type: String, 
        required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true 
    },
    price: { 
        type: Number, 
        required: true,
        min: 0
    },
    pictures: [{ 
        type: String 
    }],
    stockQuantity: { 
        type: Number, 
        required: true,
        min: 0,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema); 