// productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ProductPOJO = require('../pojo/ProductPOJO');
const Category = require('../models/Category');

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *               stockQuantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/ProductPOJO'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductPOJO'
 *       500:
 *         description: Internal server error
 *
 * /api/products/{productId}:
 *   get:
 *     summary: Get a specific product by ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/ProductPOJO'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *               stockQuantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/ProductPOJO'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

// Create a new product
router.post('/products', async (req, res) => {
    try {
        const { productName, category, price, pictures, stockQuantity } = req.body;
        
        // Validate required fields
        if (!productName || !category || price === undefined) {
            return res.status(400).json({ error: 'Product name, category, and price are required' });
        }
        
        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        const product = new Product({
            productName,
            category,
            price,
            pictures: pictures || [],
            stockQuantity: stockQuantity || 0
        });
        
        await product.save();
        const productPojo = new ProductPOJO(product);
        
        res.status(201).json({ 
            message: 'Product created successfully', 
            product: productPojo 
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({}).populate('category');
        const productPojos = products.map(product => new ProductPOJO(product));
        
        res.status(200).json({ products: productPojos });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific product by ID
router.get('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate('category');
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const productPojo = new ProductPOJO(product);
        res.status(200).json({ product: productPojo });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a product
router.put('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, category, price, pictures, stockQuantity } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Check if category exists if being updated
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ error: 'Category not found' });
            }
        }
        
        // Update fields if provided
        if (productName !== undefined) product.productName = productName;
        if (category !== undefined) product.category = category;
        if (price !== undefined) product.price = price;
        if (pictures !== undefined) product.pictures = pictures;
        if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
        
        await product.save();
        await product.populate('category');
        const productPojo = new ProductPOJO(product);
        
        res.status(200).json({ 
            message: 'Product updated successfully', 
            product: productPojo 
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a product
router.delete('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndDelete(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 