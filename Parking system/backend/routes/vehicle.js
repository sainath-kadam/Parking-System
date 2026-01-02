const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/:vehicleNumber', vehicleController.getByNumber);
router.get('/', vehicleController.getAll);

module.exports = router;

