import { useState, useEffect } from 'react';
import { Plus, Search, Download, Truck, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import apiService from '../services/api';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  licensePlate: string;
  type: string;
  capacity: string;
  odometer: string;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
  lastService: string;
  region: string;
  year?: number;
  mileage?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface NewVehicleData {
  name: string;
  model: string;
  licensePlate: string;
  type: string;
  capacity: string;
  region: string;
  year?: number;
  mileage?: number;
}

const statusConfig = {
  Available: { color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100', icon: '●' },
  'On Trip': { color: 'bg-blue-100 text-blue-700 hover:bg-blue-100', icon: '●' },
  'In Shop': { color: 'bg-amber-100 text-amber-700 hover:bg-amber-100', icon: '●' },
  Retired: { color: 'bg-gray-100 text-gray-700 hover:bg-gray-100', icon: '●' },
} as const;

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewVehicleData>({
    name: '',
    model: '',
    licensePlate: '',
    type: '',
    capacity: '',
    region: '',
  });

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.get('/vehicles');
      if (response.success && response.data) {
        // Transform API data to match frontend interface
        const transformedVehicles: Vehicle[] = response.data.map((vehicle: any) => ({
          id: vehicle.id,
          name: vehicle.make || vehicle.name || '',
          model: vehicle.model || '',
          licensePlate: vehicle.licensePlate || '',
          type: vehicle.type || '',
          capacity: vehicle.capacity ? `${vehicle.capacity} tons` : '',
          odometer: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : '',
          status: vehicle.status || 'Available',
          lastService: vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
          region: vehicle.region || 'North',
          year: vehicle.year,
          mileage: vehicle.mileage,
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
        }));
        setVehicles(transformedVehicles);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Add new vehicle
  const handleAddVehicle = async () => {
    if (!formData.name || !formData.model || !formData.licensePlate || !formData.type || !formData.capacity || !formData.region) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const vehicleData = {
        name: formData.name,
        model: formData.model,
        licensePlate: formData.licensePlate,
        type: formData.type,
        capacity: formData.capacity,
        region: formData.region,
        year: new Date().getFullYear(),
        mileage: 0,
      };

      const response = await apiService.post('/vehicles', vehicleData);
      if (response.success) {
        setIsAddDialogOpen(false);
        setFormData({
          name: '',
          model: '',
          licensePlate: '',
          type: '',
          capacity: '',
          region: '',
        });
        await fetchVehicles(); // Refresh the list
      } else {
        setError(response.message || 'Failed to add vehicle');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      setError('');
      const response = await apiService.delete(`/vehicles/${id}`);
      if (response.success) {
        await fetchVehicles(); // Refresh the list
      } else {
        setError(response.message || 'Failed to delete vehicle');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete vehicle');
    }
  };

  // Update vehicle
  const handleUpdateVehicle = async (id: string, updateData: Partial<Vehicle>) => {
    try {
      setError('');
      const response = await apiService.put(`/vehicles/${id}`, updateData);
      if (response.success) {
        await fetchVehicles(); // Refresh the list
      } else {
        setError(response.message || 'Failed to update vehicle');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update vehicle');
    }
  };

  // Calculate stats from vehicles data
  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'Available').length,
    onTrip: vehicles.filter(v => v.status === 'On Trip').length,
    inMaintenance: vehicles.filter(v => v.status === 'In Shop').length,
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Vehicle Registry</h1>
          <p className="text-muted-foreground">
            Manage your fleet assets and track vehicle information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-name">Vehicle Name</Label>
                <Input 
                  id="vehicle-name" 
                  placeholder="e.g., Volvo FH16" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input 
                  id="model" 
                  placeholder="e.g., FH16-750" 
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Plate</Label>
                <Input 
                  id="license" 
                  placeholder="e.g., VN-4523" 
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Heavy Truck">Heavy Truck</SelectItem>
                    <SelectItem value="Medium Truck">Medium Truck</SelectItem>
                    <SelectItem value="Light Truck">Light Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input 
                  id="capacity" 
                  placeholder="e.g., 28 tons" 
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={handleAddVehicle}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Vehicle'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl text-emerald-600 mt-1">{stats.available}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                ✓
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Trip</p>
                <p className="text-2xl text-blue-600 mt-1">{stats.onTrip}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                →
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Maintenance</p>
                <p className="text-2xl text-amber-600 mt-1">{stats.inMaintenance}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, license plate, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="In Shop">In Shop</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Heavy Truck">Heavy Truck</SelectItem>
                  <SelectItem value="Medium Truck">Medium Truck</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-red-700">{error}</p>
                <Button onClick={fetchVehicles} className="mt-2">
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>License Plate</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Odometer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="text-gray-900">{vehicle.name}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.model}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">{vehicle.licensePlate}</TableCell>
                      <TableCell className="text-muted-foreground">{vehicle.type}</TableCell>
                      <TableCell className="text-muted-foreground">{vehicle.capacity}</TableCell>
                      <TableCell className="text-muted-foreground">{vehicle.odometer}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusConfig[vehicle.status].color}>
                          <span className="mr-1">{statusConfig[vehicle.status].icon}</span>
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{vehicle.region}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleUpdateVehicle(vehicle.id, { status: vehicle.status === 'Available' ? 'On Trip' : 'Available' })}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
