const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // <-- ADD THIS
require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

// --- CORS Configuration for Cookie-based Auth ---
// This is crucial for allowing the frontend (on a different port/domain)
// to send cookies to the backend.
app.use(cors({
  credentials: true,
  origin: 'https://recruitment-assessment.vercel.app/' 
}));

app.use(cookieParser()); // <-- ADD THIS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
