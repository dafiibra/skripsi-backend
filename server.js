require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// CORS configuration
app.use(cors({
 origin: [
   'https://work-map-rust.vercel.app',
   'http://localhost:5173'
 ],
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware untuk parsing JSON
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
 console.error('Error: MONGO_URI is not defined in .env');
 process.exit(1);
}

mongoose.connect(mongoURI, {
})
.then(() => console.log('Connected to MongoDB!'))
.catch((err) => {
 console.error('Error connecting to MongoDB:', err);
 process.exit(1);
});

// Routes
app.use('/api', dataRoutes);
app.use('/api', adminRoutes);

// Basic error handling
app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).json({ 
   message: 'Something went wrong!',
   error: process.env.NODE_ENV === 'development' ? err.message : {}
 });
});

// Health check endpoint
app.get('/health', (req, res) => {
 res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});