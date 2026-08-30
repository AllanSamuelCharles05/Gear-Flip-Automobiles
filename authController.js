const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'gearflip_secret_key_super_secure_2026';

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    // Check if user already exists
    const existing = await db.getOne(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.runAsync(
      `INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'user')`,
      [name.trim(), email.toLowerCase().trim(), phone || '', hashedPassword]
    );

    const newUser = await db.getOne(`SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?`, [result.lastID]);
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await db.getOne(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at
    };

    const token = generateToken(userData);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.getOne(`SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?`, [decoded.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Get user's wishlisted vehicle count and listings
    const wishlistCount = await db.getOne(`SELECT COUNT(*) as count FROM wishlists WHERE user_id = ?`, [user.id]);
    const listings = await db.query(`SELECT * FROM vehicles WHERE seller_id = ?`, [user.id]);

    res.json({
      success: true,
      user: {
        ...user,
        wishlistCount: wishlistCount ? wishlistCount.count : 0,
        listingsCount: listings.length
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
