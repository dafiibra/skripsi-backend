const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');

mongoose.connect('mongodb://localhost:27017/gis', {

})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const seedAdmin = async () => {
  try {
    await Admin.deleteMany({}); // Clear existing admins
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin1234', salt);
    
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin seeded successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();