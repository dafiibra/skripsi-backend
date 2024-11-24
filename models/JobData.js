const mongoose = require('mongoose');

// Schema untuk Pencari Kerja Laki-Laki
const pencariKerjaLakiSchema = new mongoose.Schema({
  province: { type: String, required: true },
  job_seekers: { type: Number, required: true }
});
const PencariKerjaLaki = mongoose.model('PencariKerjaLaki', pencariKerjaLakiSchema);

// Schema untuk Pencari Kerja Perempuan
const pencariKerjaPerempuanSchema = new mongoose.Schema({
  province: { type: String, required: true },
  job_seekers: { type: Number, required: true }
});
const PencariKerjaPerempuan = mongoose.model('PencariKerjaPerempuan', pencariKerjaPerempuanSchema);

// Schema untuk Pencari Kerja Terdaftar - Jumlah
const jumlahPencariKerjaSchema = new mongoose.Schema({
  province: { type: String, required: true },
  job_seekers_laki_laki: { type: Number, required: true },
  job_seekers_perempuan: { type: Number, required: true },
  job_seekers_jumlah: { type: Number, required: true }
});
const JumlahPencariKerja = mongoose.model('JumlahPencariKerja', jumlahPencariKerjaSchema);

// Schema untuk Lowongan Kerja Laki-Laki
const lowonganKerjaLakiSchema = new mongoose.Schema({
  province: { type: String, required: true },
  job_vacancies: { type: Number, required: true }
});
const LowonganKerjaLaki = mongoose.model('LowonganKerjaLaki', lowonganKerjaLakiSchema);

// Schema untuk Lowongan Kerja Perempuan
const lowonganKerjaPerempuanSchema = new mongoose.Schema({
  province: { type: String, required: true },
  job_vacancies: { type: Number, required: true }
});
const LowonganKerjaPerempuan = mongoose.model('LowonganKerjaPerempuan', lowonganKerjaPerempuanSchema);

// Schema untuk Lowongan Kerja Terdaftar - Jumlah
const lowonganKerjaJumlahSchema = new mongoose.Schema({
  province: { type: String, required: true },
  lowongan_kerja_laki_laki: { type: Number, required: true },
  lowongan_kerja_perempuan: { type: Number, required: true },
  lowongan_kerja_jumlah: { type: Number, required: true }
});
const LowonganKerjaJumlah = mongoose.model('LowonganKerjaJumlah', lowonganKerjaJumlahSchema);

// Schema untuk Penempatan Tenaga Kerja Laki-Laki
const penempatanTngKrjLakiLakiSchema = new mongoose.Schema({
  province: { type: String, required: true },
  penempatan_laki_laki: { type: Number, required: true }
});
const PenempatanTngKrjLakiLaki = mongoose.model('PenempatanTngKrjLakiLaki', penempatanTngKrjLakiLakiSchema);

// Schema untuk Penempatan Tenaga Kerja Perempuan
const penempatanTngKrjPerempuanSchema = new mongoose.Schema({
  province: { type: String, required: true },
  penempatan_perempuan: { type: Number, required: true }
});
const PenempatanTngKrjPerempuan = mongoose.model('PenempatanTngKrjPerempuan', penempatanTngKrjPerempuanSchema);

// Schema untuk Penempatan Tenaga Kerja - Jumlah
const penempatanTngKrjJumlahSchema = new mongoose.Schema({
  province: { type: String, required: true },
  penempatan_jumlah: { type: Number, required: true }
});
const PenempatanTngKrjJumlah = mongoose.model('PenempatanTngKrjJumlah', penempatanTngKrjJumlahSchema);

module.exports = {
  PencariKerjaLaki,
  PencariKerjaPerempuan,
  JumlahPencariKerja,
  LowonganKerjaLaki,
  LowonganKerjaPerempuan,
  LowonganKerjaJumlah,
  PenempatanTngKrjLakiLaki,
  PenempatanTngKrjPerempuan,
  PenempatanTngKrjJumlah
};
