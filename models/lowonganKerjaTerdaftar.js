const mongoose = require('mongoose');

const lowonganKerjaTerdaftarSchema = new mongoose.Schema({
  provinsi: String,
  gender: String,
  amount: Number,
  year: Number
});

module.exports = mongoose.model('LowonganKerjaTerdaftar', lowonganKerjaTerdaftarSchema);