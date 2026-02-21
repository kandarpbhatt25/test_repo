import { Driver, CreateDriverRequest, UpdateDriverRequest, DriverStatus } from './driver.model';

export class DriverService {
  private drivers: Driver[] = [];
  private nextId = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);

    const sampleDrivers: Driver[] = [
      {
        id: (this.nextId++).toString(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0101',
        licenseNumber: 'DL123456',
        licenseExpiryDate: futureDate,
        status: DriverStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: (this.nextId++).toString(),
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0102',
        licenseNumber: 'DL789012',
        licenseExpiryDate: futureDate,
        status: DriverStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: (this.nextId++).toString(),
        firstName: 'Mike',
        lastName: 'Wilson',
        email: 'mike.wilson@example.com',
        phone: '+1-555-0103',
        licenseNumber: 'DL345678',
        licenseExpiryDate: new Date('2024-12-31'),
        status: DriverStatus.SUSPENDED,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.drivers = sampleDrivers;
  }

  getAllDrivers(): Driver[] {
    return [...this.drivers];
  }

  getDriverById(id: string): Driver | null {
    return this.drivers.find(driver => driver.id === id) || null;
  }

  createDriver(driverData: CreateDriverRequest): Driver {
    const newDriver: Driver = {
      id: (this.nextId++).toString(),
      firstName: driverData.firstName,
      lastName: driverData.lastName,
      email: driverData.email,
      phone: driverData.phone,
      licenseNumber: driverData.licenseNumber,
      licenseExpiryDate: new Date(driverData.licenseExpiryDate),
      status: driverData.status || DriverStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.drivers.push(newDriver);
    return newDriver;
  }

  updateDriver(id: string, updateData: UpdateDriverRequest): Driver | null {
    const driverIndex = this.drivers.findIndex(driver => driver.id === id);
    
    if (driverIndex === -1) {
      return null;
    }

    const existingDriver = this.drivers[driverIndex];
    const updatedDriver: Driver = {
      ...existingDriver,
      ...updateData,
      licenseExpiryDate: updateData.licenseExpiryDate 
        ? new Date(updateData.licenseExpiryDate) 
        : existingDriver.licenseExpiryDate,
      updatedAt: new Date()
    };

    this.drivers[driverIndex] = updatedDriver;
    return updatedDriver;
  }

  deleteDriver(id: string): boolean {
    const driverIndex = this.drivers.findIndex(driver => driver.id === id);
    
    if (driverIndex === -1) {
      return false;
    }

    this.drivers.splice(driverIndex, 1);
    return true;
  }

  getDriversByStatus(status: DriverStatus): Driver[] {
    return this.drivers.filter(driver => driver.status === status);
  }

  searchDrivers(query: string): Driver[] {
    const lowerQuery = query.toLowerCase();
    return this.drivers.filter(driver => 
      driver.firstName.toLowerCase().includes(lowerQuery) ||
      driver.lastName.toLowerCase().includes(lowerQuery) ||
      driver.email.toLowerCase().includes(lowerQuery) ||
      driver.licenseNumber.toLowerCase().includes(lowerQuery)
    );
  }

  getDriversWithExpiringLicenses(daysThreshold: number = 30): Driver[] {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + (daysThreshold * 24 * 60 * 60 * 1000));
    
    return this.drivers.filter(driver => 
      driver.licenseExpiryDate <= thresholdDate &&
      driver.licenseExpiryDate > now
    );
  }
}