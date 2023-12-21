
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validateCreateUser, validateUpdateUser } = require('../validation/userValidation');
const { authenticateUser } = require('../auth/auth');
const verifyToken = require('../auth/authorization');

const requireRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        return next();
    }
    res.status(403).send('Access denied');
};

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const  token  = await authenticateUser(email, password);
        res.json( token );
    } catch (error) {
        res.status(401).send(error.message);
    }
});

// List all users
router.get('/', verifyToken,requireRole('admin'), async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// Get a single user by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).send('Access denied');
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});
// Create a new user
router.post('/', validateCreateUser, async (req, res) => {
    try {
        let user = new User(req.body);
        await user.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});


// Update a user
router.put('/:id', verifyToken, validateUpdateUser, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).send('Access denied');
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// Delete a user
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).send('Access denied');
        }

        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('User not found');
        }
        res.send(`User with ID ${req.params.id} deleted successfully`);
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

module.exports = router;
