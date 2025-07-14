const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { registerSchema, loginSchema } = require('../validation/schemas');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- Helper to set the cookie ---
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user.id || user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Prevents access from JavaScript (XSS protection)
    secure: true, // Required for cross-domain cookies
    sameSite: 'none', 
    path: '/', // <-- CRITICAL: Make cookie available to all paths
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      _id: user.id || user._id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
    });
};

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = registerSchema.parse(req.body);
    const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      res.status(400);
      throw new Error('User with that email or username already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserQuery = 'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name';
    const { rows } = await db.query(newUserQuery, [username, email, hashedPassword, fullName]);
    
    sendTokenResponse(rows[0], 201, res);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];
        if (user && (await bcrypt.compare(password, user.password_hash))) {
            sendTokenResponse(user, 200, res);
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        next(error);
    }
};

const logoutUser = (req, res, next) => {
  // Also set sameSite and secure flags when clearing the cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/', // <-- CRITICAL: Make sure to clear the correct cookie
  });
  res.status(200).json({ success: true, data: {} });
};

const getMe = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, logoutUser, getMe };