const mongoose = require('mongoose');

const pencariKerjaTerdaftarSchema = new mongoose.Schema({
  provinsi: String,
  gender: String,
  amount: Number,
  year: Number
});
module.exports = mongoose.model('PencariKerjaTerdaftar', pencariKerjaTerdaftarSchema);