const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes'); // Import route
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/gis', {
  // Options for MongoDB connection (if needed)
});

// Gunakan routes yang sudah dibuat
app.use('/api', dataRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
