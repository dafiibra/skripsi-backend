const PencariKerjaTerdaftar = require('../models/PencariKerjaTerdaftar');
const LowonganKerjaTerdaftar = require('../models/LowonganKerjaTerdaftar');
const Provinsi = require('../models/Provinsi');


async function getAggregatedData(Model) {
  const data = await Model.aggregate([
    {
      $group: {
        _id: {
          provinsi: "$provinsi",
          gender: "$gender"
        },
        total: { $sum: "$amount" }
      }
    },
    {
      $group: {
        _id: "$_id.provinsi",
        genderData: {
          $push: {
            gender: "$_id.gender",
            amount: "$total"
          }
        },
        totalAmount: { $sum: "$total" }
      }
    }
  ]);

  return data.reduce((acc, item) => {
    acc[item._id] = {
      total: item.totalAmount,
      genderData: item.genderData.reduce((gAcc, g) => {
        gAcc[g.gender] = g.amount;
        return gAcc;
      }, {})
    };
    return acc;
  }, {});
}
async function getProvinsi(req, res) {
  try {
    const { name } = req.body;

    // Check if province already exists
    const existingProvinsi = await Provinsi.findOne({ name });
    if (existingProvinsi) {
      return res.status(400).json({ error: 'Province already exists' });
    }

    // Create new province
    const newProvinsi = new Provinsi({ name });
    await newProvinsi.save();

    res.status(201).json({ 
      message: 'Province added successfully',
      provinsi: newProvinsi 
    });
  } catch (error) {
    console.error('Error adding province:', error);
    res.status(500).json({ error: 'Failed to add province' });
  }
}


async function getCombinedData(req, res) {
  try {
    const pencariKerjaData = await getAggregatedData(PencariKerjaTerdaftar);
    const lowonganKerjaData = await getAggregatedData(LowonganKerjaTerdaftar);

    // Get a list of all unique provinces
    const allProvinces = [...new Set([
      ...Object.keys(pencariKerjaData),
      ...Object.keys(lowonganKerjaData)
    ])];

    const combinedData = allProvinces.map((provinsi, index) => ({
      NO: index + 1,
      PROVINSI: provinsi,
      'JUMLAH PENCARI KERJA TERDAFTAR': pencariKerjaData[provinsi]?.total || 0,
      'JUMLAH LOWONGAN KERJA TERDAFTAR': lowonganKerjaData[provinsi]?.total || 0,
      'PENCARI KERJA LAKI-LAKI': pencariKerjaData[provinsi]?.genderData['laki-laki'] || 0,
      'PENCARI KERJA PEREMPUAN': pencariKerjaData[provinsi]?.genderData['perempuan'] || 0,
      'LOWONGAN KERJA LAKI-LAKI': lowonganKerjaData[provinsi]?.genderData['laki-laki'] || 0,
      'LOWONGAN KERJA PEREMPUAN': lowonganKerjaData[provinsi]?.genderData['perempuan'] || 0
    }));

    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

async function addPencariKerjaData(req, res) {
  try {
    const { data } = req.body;
    
    // Validate the incoming data
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Validate each entry
    const isValid = data.every(entry => 
      entry.provinsi && 
      entry.gender && 
      typeof entry.amount === 'number' &&
      entry.year
    );

    if (!isValid) {
      return res.status(400).json({ error: 'Missing required fields in data' });
    }

    await PencariKerjaTerdaftar.insertMany(data);
    res.status(201).json({ 
      message: 'Data added successfully',
      count: data.length
    });
  } catch (error) {
    console.error('Error adding pencari kerja data:', error);
    res.status(500).json({ error: 'Failed to add data' });
  }
}

async function addLowonganKerjaData(req, res) {
  try {
    const { data } = req.body;
    
    // Validate the incoming data
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Validate each entry
    const isValid = data.every(entry => 
      entry.provinsi && 
      entry.gender && 
      typeof entry.amount === 'number' &&
      entry.year
    );

    if (!isValid) {
      return res.status(400).json({ error: 'Missing required fields in data' });
    }

    await LowonganKerjaTerdaftar.insertMany(data);
    res.status(201).json({ 
      message: 'Data added successfully',
      count: data.length
    });
  } catch (error) {
    console.error('Error adding lowongan kerja data:', error);
    res.status(500).json({ error: 'Failed to add data' });
  }
}

async function deleteData(req, res) {
  try {
    const { id, provinsi } = req.params;
    
    // Validate parameters
    if (!provinsi) {
      return res.status(400).json({ error: 'Province is required for deletion' });
    }

    // Delete data from both collections for the specified province
    const [pencariKerjaResult, lowonganKerjaResult] = await Promise.all([
      PencariKerjaTerdaftar.deleteMany({ provinsi: provinsi }),
      LowonganKerjaTerdaftar.deleteMany({ provinsi: provinsi })
    ]);

    // Check if any documents were deleted
    if (pencariKerjaResult.deletedCount === 0 && lowonganKerjaResult.deletedCount === 0) {
      return res.status(404).json({ error: 'No data found for the specified province' });
    }

    res.json({ 
      message: 'Data deleted successfully',
      deletedCounts: {
        pencariKerja: pencariKerjaResult.deletedCount,
        lowonganKerja: lowonganKerjaResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Failed to delete data' });
  }
}
async function updateData(req, res) {
  try {
    const { provinsi } = req.params;
    const updateData = req.body;
    const currentYear = new Date().getFullYear();
    
    if (!provinsi) {
      return res.status(400).json({ error: 'Province is required' });
    }

    const updates = [];

    // Handle PencariKerja updates
    if (updateData.pencariKerja) {
      const { lakiLaki, perempuan } = updateData.pencariKerja;
      
      // Update or create male job seekers
      if (lakiLaki !== undefined) {
        updates.push(
          PencariKerjaTerdaftar.findOneAndUpdate(
            { provinsi, gender: 'laki-laki', year: currentYear },
            { 
              $set: { 
                amount: parseInt(lakiLaki),
                provinsi,
                gender: 'laki-laki',
                year: currentYear
              }
            },
            { upsert: true, new: true }
          )
        );
      }
      
      // Update or create female job seekers
      if (perempuan !== undefined) {
        updates.push(
          PencariKerjaTerdaftar.findOneAndUpdate(
            { provinsi, gender: 'perempuan', year: currentYear },
            { 
              $set: { 
                amount: parseInt(perempuan),
                provinsi,
                gender: 'perempuan',
                year: currentYear
              }
            },
            { upsert: true, new: true }
          )
        );
      }
    }

    // Handle LowonganKerja updates
    if (updateData.lowonganKerja) {
      const { lakiLaki, perempuan } = updateData.lowonganKerja;
      
      // Update or create male job vacancies
      if (lakiLaki !== undefined) {
        updates.push(
          LowonganKerjaTerdaftar.findOneAndUpdate(
            { provinsi, gender: 'laki-laki', year: currentYear },
            { 
              $set: { 
                amount: parseInt(lakiLaki),
                provinsi,
                gender: 'laki-laki',
                year: currentYear
              }
            },
            { upsert: true, new: true }
          )
        );
      }
      
      // Update or create female job vacancies
      if (perempuan !== undefined) {
        updates.push(
          LowonganKerjaTerdaftar.findOneAndUpdate(
            { provinsi, gender: 'perempuan', year: currentYear },
            { 
              $set: { 
                amount: parseInt(perempuan),
                provinsi,
                gender: 'perempuan',
                year: currentYear
              }
            },
            { upsert: true, new: true }
          )
        );
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid updates provided' });
    }

    const results = await Promise.all(updates);

    res.json({ 
      message: 'Data updated successfully',
      modifiedCount: results.length
    });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
}

module.exports = {
  getCombinedData,
  getProvinsi,
  addPencariKerjaData,
  addLowonganKerjaData,
  updateData,
  deleteData
};