const mongoose = require('mongoose');

const provinsiSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() }, // Field id
  name: { type: String, required: true, unique: true }
});

const Provinsi = mongoose.model('Provinsi', provinsiSchema);

module.exports = Provinsi;
