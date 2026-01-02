import { checkInVehicle } from '../controllers/checkin.controller.js';
import { checkOutVehicle } from '../controllers/checkout.controller.js';
import { getParkingList } from '../controllers/parkingList.controller.js';

router.post('/check-in', checkInVehicle);
router.post('/check-out', checkOutVehicle);
router.get('/active', getParkingList);

export default router;