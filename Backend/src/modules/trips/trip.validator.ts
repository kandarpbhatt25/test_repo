import { CreateTripRequest, UpdateTripRequest, TripValidationResult } from './trip.model';

export class TripValidator {
  static validateCreateTrip(data: CreateTripRequest): TripValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.vehicleId || data.vehicleId.trim().length === 0) {
      errors.push('Vehicle ID is required');
    }

    if (!data.driverId || data.driverId.trim().length === 0) {
      errors.push('Driver ID is required');
    }

    if (!data.origin || data.origin.trim().length === 0) {
      errors.push('Origin is required');
    }

    if (!data.destination || data.destination.trim().length === 0) {
      errors.push('Destination is required');
    }

    if (data.origin === data.destination) {
      errors.push('Origin and destination cannot be the same');
    }

    if (!data.cargoWeight || data.cargoWeight <= 0) {
      errors.push('Cargo weight must be greater than 0');
    }

    if (!data.estimatedDistance || data.estimatedDistance <= 0) {
      errors.push('Estimated distance must be greater than 0');
    }

    if (!data.estimatedDuration || data.estimatedDuration <= 0) {
      errors.push('Estimated duration must be greater than 0');
    }

    if (data.cargoWeight > 5000) {
      errors.push('Cargo weight exceeds maximum limit of 5000kg');
    }

    if (data.estimatedDistance > 10000) {
      warnings.push('Very long distance trip detected (>10000km)');
    }

    if (data.estimatedDuration > 168) { // 7 days in hours
      warnings.push('Very long duration trip detected (>7 days)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateUpdateTrip(data: UpdateTripRequest): TripValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (data.vehicleId !== undefined && data.vehicleId.trim().length === 0) {
      errors.push('Vehicle ID cannot be empty');
    }

    if (data.driverId !== undefined && data.driverId.trim().length === 0) {
      errors.push('Driver ID cannot be empty');
    }

    if (data.origin !== undefined && data.origin.trim().length === 0) {
      errors.push('Origin cannot be empty');
    }

    if (data.destination !== undefined && data.destination.trim().length === 0) {
      errors.push('Destination cannot be empty');
    }

    if (data.origin && data.destination && data.origin === data.destination) {
      errors.push('Origin and destination cannot be the same');
    }

    if (data.cargoWeight !== undefined && data.cargoWeight <= 0) {
      errors.push('Cargo weight must be greater than 0');
    }

    if (data.estimatedDistance !== undefined && data.estimatedDistance <= 0) {
      errors.push('Estimated distance must be greater than 0');
    }

    if (data.estimatedDuration !== undefined && data.estimatedDuration <= 0) {
      errors.push('Estimated duration must be greater than 0');
    }

    if (data.actualDistance !== undefined && data.actualDistance < 0) {
      errors.push('Actual distance cannot be negative');
    }

    if (data.actualDuration !== undefined && data.actualDuration < 0) {
      errors.push('Actual duration cannot be negative');
    }

    if (data.cargoWeight !== undefined && data.cargoWeight > 5000) {
      errors.push('Cargo weight exceeds maximum limit of 5000kg');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}