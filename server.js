require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes'); // Import route
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware untuk CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
}));

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke MongoDB
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI; // Prioritaskan MongoDB Atlas jika ada
mongoose.connect(mongoURI, {
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Gunakan routes yang sudah dibuat
app.use('/api', dataRoutes);
app.use('/api', adminRoutes);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
