const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { registerSchema, loginSchema } = require('../validation/schemas');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register Controller
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = registerSchema.parse(req.body);

    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserQuery = `
      INSERT INTO users (username, email, password_hash, full_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, full_name
    `;
    const { rows } = await db.query(newUserQuery, [username, email, hashedPassword, fullName]);
    const newUser = rows[0];

    const token = generateToken(newUser.id);

    return res.status(201).json({
      token,
      user: {
        _id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
      },
    });
  } catch (error) {
    console.error('[Register Error]', error.message);
    next(error);
  }
};

// Login Controller
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    return res.json({
      token,
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
      },
    });

    // Optional: Use secure cookie instead of returning token in body
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'Strict',
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // }).json({ user: { ... } });
  } catch (error) {
    console.error('[Login Error]', error.message);
    next(error);
  }
};

// Get Logged-In User Info
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.status(200).json(req.user);
  } catch (error) {
    console.error('[GetMe Error]', error.message);
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };
