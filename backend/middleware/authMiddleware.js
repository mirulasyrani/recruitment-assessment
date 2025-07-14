const jwt = require('jsonwebtoken');
const db = require('../db');

const protect = async (req, res, next) => {
  let token;
  
  // Log all incoming headers for complete context
  console.log("Auth Middleware: Received headers:", JSON.stringify(req.headers, null, 2));

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      // Log the raw Authorization header
      console.log("Auth Middleware: Authorization header found:", req.headers.authorization);
      
      token = req.headers.authorization.split(' ')[1];
      
      // Log the exact token string that will be verified
      console.log("Auth Middleware: Extracted token to verify:", token);
      
      if (!token || token === 'undefined' || token.split('.').length !== 3) {
        console.error("Auth Middleware Error: Token is null, 'undefined', or not a valid JWT structure.");
        return res.status(401).json({ message: 'Not authorized, malformed token received' });
      }

      console.log("Auth Middleware: Attempting to verify token...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log("Auth Middleware: Token verified successfully. Decoded ID:", decoded.id);

      const { rows } = await db.query('SELECT id, username, email, full_name FROM users WHERE id = $1', [decoded.id]);
      
      if(rows.length === 0) {
          console.error("Auth Middleware Error: User not found in DB for ID:", decoded.id);
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = rows[0];
      next();
    } catch (error) {
      console.error("Auth Middleware Error: JWT Verification failed!");
      console.error("Error Message:", error.message);
      console.error("Is JWT_SECRET environment variable set correctly?", !!process.env.JWT_SECRET);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log("Auth Middleware: No 'Bearer' token found in Authorization header.");
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };