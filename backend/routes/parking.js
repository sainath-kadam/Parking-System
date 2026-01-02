const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

router.post('/check-in', parkingController.checkIn);
router.post('/check-out', parkingController.checkOut);
router.get('/active', parkingController.getActive);
router.get('/active-entry', parkingController.getActiveEntry);
router.get('/history', parkingController.getHistory);
router.get('/stats', parkingController.getStats);
router.get('/token/:tokenId', parkingController.getByToken);
router.delete('/cleanup', parkingController.cleanup);

module.exports = router;

