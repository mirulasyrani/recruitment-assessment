const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { registerSchema, loginSchema } = require('../validation/schemas');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = registerSchema.parse(req.body);

    const userExists = await db.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      res.status(400);
      throw new Error('User with that email or username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserQuery =
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name';
    const { rows } = await db.query(newUserQuery, [
      username,
      email,
      hashedPassword,
      fullName,
    ]);

    const newUser = rows[0];

    if (newUser) {
      const token = generateToken(newUser.id);
      console.log('✅ Registration successful. Token:', token);

      res.status(201).json({
        token,
        user: {
          _id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.full_name,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    console.log('🛂 Login attempt for:', email);

    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const token = generateToken(user.id);
      console.log('✅ Login successful. Token:', token);

      return res.json({
        token,
        user: {
          _id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
        },
      });
    } else {
      console.log('❌ Invalid credentials for:', email);
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('🔥 Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMe = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
