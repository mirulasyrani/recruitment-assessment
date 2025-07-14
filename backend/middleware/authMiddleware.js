const jwt = require('jsonwebtoken');
const db = require('../db');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // New Debugging Log
      console.log("Auth Middleware: Received token. Attempting to verify...");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // New Debugging Log
      console.log("Auth Middleware: Token verified successfully. Decoded ID:", decoded.id);

      const { rows } = await db.query('SELECT id, username, email, full_name FROM users WHERE id = $1', [decoded.id]);
      
      if(rows.length === 0) {
          console.error("Auth Middleware Error: User not found in DB for ID:", decoded.id);
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = rows[0];
      next();
    } catch (error) {
      // New Debugging Log
      console.error("Auth Middleware Error: JWT Verification failed!");
      console.error("Error Message:", error.message);
      console.error("Is JWT_SECRET environment variable set correctly?", !!process.env.JWT_SECRET);

      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log("Auth Middleware: No token found in Authorization header.");
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };