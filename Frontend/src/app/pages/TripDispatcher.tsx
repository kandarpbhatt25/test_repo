import { useState } from 'react';
import { Plus, Search, MapPin, Users, Package, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useDataHelpers } from '../contexts/DataContext';

interface NewTripData {
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  cargoLoad: number;
  cargoCapacity: number;
}

export default function TripDispatcher() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewTripData>({
    vehicleId: '',
    driverId: '',
    origin: '',
    destination: '',
    cargoLoad: 0,
    cargoCapacity: 0,
  });

  const {
    vehicles,
    drivers,
    trips,
    dispatch,
    getVehicleById,
    getDriverById,
  } = useDataHelpers();

  // Add new trip
  const handleAddTrip = async () => {
    if (!formData.vehicleId || !formData.driverId || !formData.origin || !formData.destination) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newTrip = {
        id: Date.now().toString(),
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        origin: formData.origin,
        destination: formData.destination,
        status: 'Scheduled' as const,
        progress: 0,
        cargoLoad: formData.cargoLoad,
        cargoCapacity: formData.cargoCapacity,
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_TRIP', payload: newTrip });
      setIsAddDialogOpen(false);
      setFormData({
        vehicleId: '',
        driverId: '',
        origin: '',
        destination: '',
        cargoLoad: 0,
        cargoCapacity: 0,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to add trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update trip status
  const handleUpdateTrip = async (id: string, status: any) => {
    try {
      dispatch({ type: 'UPDATE_TRIP', payload: { id, data: { status } } });
    } catch (err: any) {
      alert(err.message || 'Failed to update trip');
    }
  };

  // Delete trip
  const handleDeleteTrip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      dispatch({ type: 'DELETE_TRIP', payload: id });
    } catch (err: any) {
      alert(err.message || 'Failed to delete trip');
    }
  };

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Status configuration
  const statusConfig = {
    Draft: { color: 'bg-gray-100 text-gray-700', icon: '📝' },
    Scheduled: { color: 'bg-blue-100 text-blue-700', icon: '📅' },
    'In Transit': { color: 'bg-amber-100 text-amber-700', icon: '🚚' },
    Completed: { color: 'bg-green-100 text-green-700', icon: '✅' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Trip Dispatcher</h1>
          <p className="text-muted-foreground">
            Create and manage delivery trips with real-time tracking
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Trip</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle">Select Vehicle</Label>
                <Select value={formData.vehicleId} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.filter(v => v.status === 'Available').map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.licensePlate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="driver">Select Driver</Label>
                <Select value={formData.driverId} onValueChange={(value) => setFormData(prev => ({ ...prev, driverId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.filter(d => d.status === 'Available').map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g., Delhi"
                />
              </div>
              <div>
                <Label htmlFor="cargoLoad">Cargo Load (tons)</Label>
                <Input
                  id="cargoLoad"
                  type="number"
                  value={formData.cargoLoad}
                  onChange={(e) => setFormData(prev => ({ ...prev, cargoLoad: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="cargoCapacity">Cargo Capacity (tons)</Label>
                <Input
                  id="cargoCapacity"
                  type="number"
                  value={formData.cargoCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, cargoCapacity: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleAddTrip} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Trip'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-muted-foreground">
              {trips.filter(t => t.status === 'In Transit').length} in transit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.filter(v => v.status === 'On Trip').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently on trips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.filter(d => d.status === 'Available').length}</div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cargo Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.reduce((sum, trip) => sum + trip.cargoCapacity, 0)} tons
            </div>
            <p className="text-xs text-muted-foreground">
              Total fleet capacity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Active & Scheduled Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search trips by origin or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trips Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        <p>No trips found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">{trip.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getVehicleById(trip.vehicleId)?.name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{getVehicleById(trip.vehicleId)?.licensePlate || ''}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getDriverById(trip.driverId)?.name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{getDriverById(trip.driverId)?.phone || ''}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{trip.origin} → {trip.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={trip.status === 'Completed' ? 'default' : 'secondary'}
                          className={statusConfig[trip.status as keyof typeof statusConfig]?.color}
                        >
                          <span className="mr-1">{statusConfig[trip.status as keyof typeof statusConfig]?.icon}</span>
                          {trip.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {trip.status === 'In Transit' && (
                          <div className="flex items-center gap-2">
                            <Progress value={trip.progress} className="w-24" />
                            <span className="text-sm text-muted-foreground">{trip.progress}%</span>
                          </div>
                        )}
                        {trip.status === 'Completed' && (
                          <Badge variant="default">100%</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {trip.status === 'Scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTrip(trip.id, 'In Transit')}
                            >
                              Start Trip
                            </Button>
                          )}
                          {trip.status === 'In Transit' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTrip(trip.id, 'Completed')}
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTrip(trip.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
