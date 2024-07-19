const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// Save list
router.post('/save-list', authenticateToken, (req, res) => {
    const { name, responseCodes, imageLinks } = req.body;
    const userId = req.user.userId;

    const query = 'INSERT INTO lists (name, user_id) VALUES (?, ?)';
    db.query(query, [name, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const listId = result.insertId;
        const imageEntries = responseCodes.map((code, index) => [listId, code, imageLinks[index]]);
        const imageQuery = 'INSERT INTO list_images (list_id, response_code, image_link) VALUES ?';

        db.query(imageQuery, [imageEntries], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'List saved successfully' });
        });
    });
});

// GET Lists: Retrieve all lists for the authenticated user
router.get('/lists', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    const query = 'SELECT * FROM lists WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET List Details: Retrieve a specific list by its ID
router.get('/lists/:id', authenticateToken, (req, res) => {
    const listId = req.params.id;

    const query = `
        SELECT lists.name, list_images.response_code, list_images.image_link
        FROM lists
        INNER JOIN list_images ON lists.id = list_images.list_id
        WHERE lists.id = ?`;
        
    db.query(query, [listId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'List not found' });
        res.json(results);
    });
});

// DELETE List: Remove a specific list by its ID
router.delete('/lists/:id', authenticateToken, (req, res) => {
    const listId = req.params.id;

    const deleteImagesQuery = 'DELETE FROM list_images WHERE list_id = ?';
    db.query(deleteImagesQuery, [listId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        const deleteListQuery = 'DELETE FROM lists WHERE id = ?';
        db.query(deleteListQuery, [listId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'List deleted successfully' });
        });
    });
});

module.exports = router;