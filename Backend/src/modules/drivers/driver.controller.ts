import { Request, Response, NextFunction } from 'express';
import { DriverService } from './driver.service';
import { DriverValidator } from './driver.validator';
import { CreateDriverRequest, UpdateDriverRequest, DriverStatus } from './driver.model';

export class DriverController {
  private driverService: DriverService;

  constructor() {
    this.driverService = new DriverService();
  }

  getAllDrivers = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { status, search, expiring } = req.query;
      
      let drivers = this.driverService.getAllDrivers();
      
      if (status) {
        drivers = this.driverService.getDriversByStatus(status as DriverStatus);
      }
      
      if (search && typeof search === 'string') {
        drivers = this.driverService.searchDrivers(search);
      }

      if (expiring === 'true') {
        drivers = this.driverService.getDriversWithExpiringLicenses();
      }
      
      res.status(200).json({
        count: drivers.length,
        data: drivers
      });
    } catch (error) {
      next(error);
    }
  };

  getDriverById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const driver = this.driverService.getDriverById(Array.isArray(id) ? id[0] : id);
      
      if (!driver) {
        res.status(404).json({ error: 'Driver not found' });
        return;
      }
      
      res.status(200).json(driver);
    } catch (error) {
      next(error);
    }
  };

  createDriver = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const driverData: CreateDriverRequest = req.body;
      
      const validationErrors = DriverValidator.validateCreateDriver(driverData);
      if (validationErrors.length > 0) {
        res.status(400).json({ 
          error: 'Validation failed', 
          details: validationErrors 
        });
        return;
      }
      
      const newDriver = this.driverService.createDriver(driverData);
      res.status(201).json(newDriver);
    } catch (error) {
      next(error);
    }
  };

  updateDriver = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const updateData: UpdateDriverRequest = req.body;
      
      const validationErrors = DriverValidator.validateUpdateDriver(updateData);
      if (validationErrors.length > 0) {
        res.status(400).json({ 
          error: 'Validation failed', 
          details: validationErrors 
        });
        return;
      }
      
      const driverId = Array.isArray(id) ? id[0] : id;
      const updatedDriver = this.driverService.updateDriver(driverId, updateData);
      
      if (!updatedDriver) {
        res.status(404).json({ error: 'Driver not found' });
        return;
      }
      
      res.status(200).json(updatedDriver);
    } catch (error) {
      next(error);
    }
  };

  deleteDriver = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const driverId = Array.isArray(id) ? id[0] : id;
      const deleted = this.driverService.deleteDriver(driverId);
      
      if (!deleted) {
        res.status(404).json({ error: 'Driver not found' });
        return;
      }
      
      res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}