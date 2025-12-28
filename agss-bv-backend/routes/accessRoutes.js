const express = require('express');
const router = express.Router();

const { checkAccess } = require('../controllers/accessController');

router.get('/:vehicleNo', async (req, res) => {
  const result = await checkAccess(req.params.vehicleNo);
  res.json(result);
});

module.exports = router;
