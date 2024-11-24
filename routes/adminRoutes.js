const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

// Login route
router.post('/login', adminController.login);

// Add more admin routes as needed, for example:
// router.get('/dashboard', adminController.getDashboard);
// router.post('/logout', adminController.logout);

module.exports = router;