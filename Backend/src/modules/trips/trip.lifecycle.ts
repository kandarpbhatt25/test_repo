import { Trip, TripStatus } from './trip.model';
import { VehicleService } from '../vehicles/vehicle.service';
import { DriverService } from '../drivers/driver.service';

export class TripLifecycleManager {
  private vehicleService: VehicleService;
  private driverService: DriverService;

  constructor() {
    this.vehicleService = new VehicleService();
    this.driverService = new DriverService();
  }

  validateTripCreation(tripData: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate vehicle exists and is available
    const vehicle = this.vehicleService.getVehicleById(tripData.vehicleId);
    if (!vehicle) {
      errors.push('Vehicle not found');
    } else if (vehicle.status !== 'active') {
      errors.push('Vehicle is not available for trips');
    }

    // Validate driver exists and is available
    const driver = this.driverService.getDriverById(tripData.driverId);
    if (!driver) {
      errors.push('Driver not found');
    } else if (driver.status !== 'active') {
      errors.push('Driver is not available for trips');
    } else {
      // Validate driver license
      const now = new Date();
      if (driver.licenseExpiryDate <= now) {
        errors.push('Driver license has expired');
      } else {
        const daysUntilExpiry = Math.ceil((driver.licenseExpiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30) {
          warnings.push(`Driver license expires in ${daysUntilExpiry} days`);
        }
      }
    }

    // Validate cargo weight against vehicle capacity (assuming 1000kg max capacity for demo)
    if (vehicle && tripData.cargoWeight > 1000) {
      errors.push(`Cargo weight (${tripData.cargoWeight}kg) exceeds vehicle capacity (1000kg)`);
    }

    // Validate basic fields
    if (!tripData.origin || tripData.origin.trim().length === 0) {
      errors.push('Origin is required');
    }

    if (!tripData.destination || tripData.destination.trim().length === 0) {
      errors.push('Destination is required');
    }

    if (tripData.origin === tripData.destination) {
      errors.push('Origin and destination cannot be the same');
    }

    if (!tripData.cargoWeight || tripData.cargoWeight <= 0) {
      errors.push('Cargo weight must be greater than 0');
    }

    if (!tripData.estimatedDistance || tripData.estimatedDistance <= 0) {
      errors.push('Estimated distance must be greater than 0');
    }

    if (!tripData.estimatedDuration || tripData.estimatedDuration <= 0) {
      errors.push('Estimated duration must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  startTrip(trip: Trip): Trip {
    const now = new Date();
    
    // Update vehicle status to in_use
    const vehicle = this.vehicleService.getVehicleById(trip.vehicleId);
    if (vehicle) {
      this.vehicleService.updateVehicle(trip.vehicleId, { status: 'maintenance' as any });
    }

    // Update driver status to on_trip
    const driver = this.driverService.getDriverById(trip.driverId);
    if (driver) {
      this.driverService.updateDriver(trip.driverId, { status: 'on_leave' as any });
    }

    return {
      ...trip,
      status: TripStatus.IN_PROGRESS,
      startTime: now,
      updatedAt: now
    };
  }

  completeTrip(trip: Trip, actualDistance?: number, actualDuration?: number): Trip {
    const now = new Date();
    
    // Update vehicle status back to active
    const vehicle = this.vehicleService.getVehicleById(trip.vehicleId);
    if (vehicle) {
      this.vehicleService.updateVehicle(trip.vehicleId, { 
        status: 'active' as any,
        mileage: vehicle.mileage + (actualDistance || trip.estimatedDistance)
      });
    }

    // Update driver status back to active
    const driver = this.driverService.getDriverById(trip.driverId);
    if (driver) {
      this.driverService.updateDriver(trip.driverId, { status: 'active' as any });
    }

    return {
      ...trip,
      status: TripStatus.COMPLETED,
      actualDistance: actualDistance || trip.estimatedDistance,
      actualDuration: actualDuration || trip.estimatedDuration,
      endTime: now,
      updatedAt: now
    };
  }

  cancelTrip(trip: Trip): Trip {
    const now = new Date();
    
    // Update vehicle status back to active
    const vehicle = this.vehicleService.getVehicleById(trip.vehicleId);
    if (vehicle) {
      this.vehicleService.updateVehicle(trip.vehicleId, { status: 'active' as any });
    }

    // Update driver status back to active
    const driver = this.driverService.getDriverById(trip.driverId);
    if (driver) {
      this.driverService.updateDriver(trip.driverId, { status: 'active' as any });
    }

    return {
      ...trip,
      status: TripStatus.CANCELLED,
      endTime: now,
      updatedAt: now
    };
  }
}