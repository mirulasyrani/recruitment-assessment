const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// =======================================================
// ==> START: Environment Variable Check <==
// This block will check for required environment variables on startup.
// If any are missing, it will log a clear error and exit,
// which you will see in your Render logs.
// =======================================================
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGIN'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('FATAL ERROR: Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`- ${varName}`));
  process.exit(1); // Exit the application with an error code
}
// =======================================================
// ==> END: Environment Variable Check <==
// =======================================================

const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

// =======================================================
// ==> START: Robust CORS Configuration <==
// This is a more robust way to handle CORS for deployment.
// It explicitly checks the request's origin against the one in your
// environment variables.
// =======================================================
const allowedOrigins = [process.env.CORS_ORIGIN];

const corsOptions = {
  origin: (origin, callback) => {
    // Log the origin for debugging purposes
    console.log(`CORS Check: Request from origin: ${origin}`);
    
    // Check if the incoming origin is in our list of allowed origins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // If it is, allow the request
      callback(null, true);
    } else {
      // If it's not, block the request with a CORS error
      console.error(`CORS Error: Origin ${origin} not allowed.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// =======================================================
// ==> END: Robust CORS Configuration <==
// =======================================================

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
