const express = require('express');
const cors = require('cors');
require('dotenv').config();

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGIN'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('FATAL ERROR: Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));