import { Router } from 'express';
import { DriverController } from './driver.controller';

const router = Router();
const driverController = new DriverController();

router.get('/', driverController.getAllDrivers);
router.get('/:id', driverController.getDriverById);
router.post('/', driverController.createDriver);
router.put('/:id', driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);

export default router;