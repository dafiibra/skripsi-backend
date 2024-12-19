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
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Error: MONGO_URI is not defined in .env');
  process.exit(1); // Keluar jika MONGO_URI tidak ditemukan
}

mongoose.connect(mongoURI, {
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Keluar jika koneksi gagal
  });

// Gunakan routes yang sudah dibuat
app.use('/api', dataRoutes);
app.use('/api', adminRoutes);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
