const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// =======================================================
// ==> START: Environment Variable Check <==
// This block will check for required environment variables on startup.
// If any are missing, it will log a clear error and exit.
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
// ==> START: Simplified CORS Configuration <==
// This is the most standard and reliable way to set up CORS for deployment.
// It directly tells the server which origin to allow.
// =======================================================
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
// =======================================================
// ==> END: Simplified CORS Configuration <==
// =======================================================

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
