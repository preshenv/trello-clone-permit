// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user in database
        const user = await User.create({
            email,
            password: await bcrypt.hash(password, 10),
            name
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },  // Using userId here
            "djddjdjjdjd",
            { expiresIn: '24h' }
        );

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};