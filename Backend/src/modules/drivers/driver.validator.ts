import { CreateDriverRequest, UpdateDriverRequest } from './driver.model';

export class DriverValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const cleanPhone = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && cleanPhone.length >= 7;
  }

  static validateLicenseExpiry(expiryDate: string): { isValid: boolean; daysUntilExpiry?: number } {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      isValid: daysUntilExpiry > 0,
      daysUntilExpiry
    };
  }

  static validateCreateDriver(data: CreateDriverRequest): string[] {
    const errors: string[] = [];

    if (!data.firstName || data.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }

    if (!data.email || !this.validateEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (!data.phone || !this.validatePhone(data.phone)) {
      errors.push('Valid phone number is required');
    }

    if (!data.licenseNumber || data.licenseNumber.trim().length === 0) {
      errors.push('License number is required');
    }

    if (!data.licenseExpiryDate) {
      errors.push('License expiry date is required');
    } else {
      const expiryValidation = this.validateLicenseExpiry(data.licenseExpiryDate);
      if (!expiryValidation.isValid) {
        errors.push('License expiry date must be in the future');
      }
    }

    return errors;
  }

  static validateUpdateDriver(data: UpdateDriverRequest): string[] {
    const errors: string[] = [];

    if (data.firstName !== undefined && data.firstName.trim().length === 0) {
      errors.push('First name cannot be empty');
    }

    if (data.lastName !== undefined && data.lastName.trim().length === 0) {
      errors.push('Last name cannot be empty');
    }

    if (data.email !== undefined && !this.validateEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (data.phone !== undefined && !this.validatePhone(data.phone)) {
      errors.push('Valid phone number is required');
    }

    if (data.licenseNumber !== undefined && data.licenseNumber.trim().length === 0) {
      errors.push('License number cannot be empty');
    }

    if (data.licenseExpiryDate !== undefined) {
      const expiryValidation = this.validateLicenseExpiry(data.licenseExpiryDate);
      if (!expiryValidation.isValid) {
        errors.push('License expiry date must be in the future');
      }
    }

    return errors;
  }
}