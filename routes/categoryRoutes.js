// categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const CategoryPOJO = require('../pojo/CategoryPOJO');

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/CategoryPOJO'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Category name already exists
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryPOJO'
 *       500:
 *         description: Internal server error
 *
 * /api/categories/{categoryId}:
 *   get:
 *     summary: Get a specific category by ID
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/CategoryPOJO'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a category
 *     parameters:
 *       - in: path
 *         name: categoryId
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
 *               categoryName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/CategoryPOJO'
 *       404:
 *         description: Category not found
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Category name already exists
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

// Create a new category
router.post('/categories', async (req, res) => {
    try {
        const { categoryName, description } = req.body;
        
        // Validate required fields
        if (!categoryName || !description) {
            return res.status(400).json({ error: 'Category name and description are required' });
        }
        
        // Check if category already exists
        const existingCategory = await Category.findOne({ categoryName });
        if (existingCategory) {
            return res.status(409).json({ error: 'Category name already exists' });
        }
        
        const category = new Category({
            categoryName,
            description
        });
        
        await category.save();
        const categoryPojo = new CategoryPOJO(category);
        
        res.status(201).json({ 
            message: 'Category created successfully', 
            category: categoryPojo 
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({});
        const categoryPojos = categories.map(category => new CategoryPOJO(category));
        
        res.status(200).json({ categories: categoryPojos });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific category by ID
router.get('/categories/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        const categoryPojo = new CategoryPOJO(category);
        res.status(200).json({ category: categoryPojo });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a category
router.put('/categories/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { categoryName, description } = req.body;
        
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Check if new category name already exists (if being changed)
        if (categoryName && categoryName !== category.categoryName) {
            const existingCategory = await Category.findOne({ categoryName });
            if (existingCategory) {
                return res.status(409).json({ error: 'Category name already exists' });
            }
        }
        
        // Update fields if provided
        if (categoryName !== undefined) category.categoryName = categoryName;
        if (description !== undefined) category.description = description;
        
        await category.save();
        const categoryPojo = new CategoryPOJO(category);
        
        res.status(200).json({ 
            message: 'Category updated successfully', 
            category: categoryPojo 
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a category
router.delete('/categories/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findByIdAndDelete(categoryId);
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 