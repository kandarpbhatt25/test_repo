import { CreateVehicleRequest, UpdateVehicleRequest } from './vehicle.model';

export class VehicleValidator {
  static validateCreateVehicle(data: CreateVehicleRequest): string[] {
    const errors: string[] = [];

    if (!data.make || data.make.trim().length === 0) {
      errors.push('Make is required');
    }

    if (!data.model || data.model.trim().length === 0) {
      errors.push('Model is required');
    }

    if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
      errors.push('Valid year is required');
    }

    if (!data.licensePlate || data.licensePlate.trim().length === 0) {
      errors.push('License plate is required');
    }

    if (data.mileage !== undefined && data.mileage < 0) {
      errors.push('Mileage cannot be negative');
    }

    return errors;
  }

  static validateUpdateVehicle(data: UpdateVehicleRequest): string[] {
    const errors: string[] = [];

    if (data.make !== undefined && data.make.trim().length === 0) {
      errors.push('Make cannot be empty');
    }

    if (data.model !== undefined && data.model.trim().length === 0) {
      errors.push('Model cannot be empty');
    }

    if (data.year !== undefined && (data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
      errors.push('Valid year is required');
    }

    if (data.licensePlate !== undefined && data.licensePlate.trim().length === 0) {
      errors.push('License plate cannot be empty');
    }

    if (data.mileage !== undefined && data.mileage < 0) {
      errors.push('Mileage cannot be negative');
    }

    return errors;
  }
}