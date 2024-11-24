const express = require('express');
const router = express.Router();
const dataController = require('../controller/dataController');

// Definisikan route dan arahkan ke controller
router.get('/combined-data', dataController.getCombinedData);


router.post('/pencari-kerja', dataController.addPencariKerjaData);
router.post('/lowongan-kerja', dataController.addLowonganKerjaData);

router.post('/provinsi', dataController.getProvinsi);

router.delete('/pencari-kerja/:id/:provinsi', dataController.deleteData);
router.delete('/lowongan-kerja/:id/:provinsi', dataController.deleteData);  

router.put('/update/:provinsi', dataController.updateData);

module.exports = router;
