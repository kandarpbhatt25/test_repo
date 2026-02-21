import { useState } from 'react';
import { Plus, Search, Wrench, AlertTriangle, Calendar, Clock, DollarSign } from 'lucide-react';
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

interface NewMaintenanceData {
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  scheduledDate: string;
}

export default function Maintenance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewMaintenanceData>({
    vehicleId: '',
    type: '',
    description: '',
    cost: 0,
    scheduledDate: '',
  });

  const {
    vehicles,
    maintenance,
    dispatch,
    getVehicleById,
  } = useDataHelpers();

  // Add new maintenance record
  const handleAddMaintenance = async () => {
    if (!formData.vehicleId || !formData.type || !formData.description || !formData.scheduledDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newMaintenance = {
        id: Date.now().toString(),
        vehicleId: formData.vehicleId,
        type: formData.type,
        description: formData.description,
        cost: formData.cost,
        status: 'Scheduled' as const,
        scheduledDate: formData.scheduledDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MAINTENANCE', payload: newMaintenance });
      setIsAddDialogOpen(false);
      setFormData({
        vehicleId: '',
        type: '',
        description: '',
        cost: 0,
        scheduledDate: '',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to add maintenance record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update maintenance status
  const handleUpdateMaintenance = async (id: string, status: any) => {
    try {
      dispatch({ type: 'UPDATE_MAINTENANCE', payload: { id, data: { status } } });
    } catch (err: any) {
      alert(err.message || 'Failed to update maintenance');
    }
  };

  // Delete maintenance record
  const handleDeleteMaintenance = async (id: string) => {
    if (!confirm('Are you sure you want to delete this maintenance record?')) {
      return;
    }

    try {
      dispatch({ type: 'DELETE_MAINTENANCE', payload: id });
    } catch (err: any) {
      alert(err.message || 'Failed to delete maintenance record');
    }
  };

  // Filter maintenance records
  const filteredMaintenance = maintenance.filter((record) => {
    const matchesSearch =
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Status configuration
  const statusConfig = {
    Scheduled: { color: 'bg-blue-100 text-blue-700', icon: '📅' },
    'In Progress': { color: 'bg-amber-100 text-amber-700', icon: '🔧' },
    Completed: { color: 'bg-green-100 text-green-700', icon: '✅' },
  };

  // Maintenance types
  const maintenanceTypes = [
    'Oil Change',
    'Tire Rotation',
    'Brake Inspection',
    'Engine Service',
    'Transmission Service',
    'General Repair',
    'Scheduled Maintenance',
    'Emergency Repair',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Maintenance</h1>
          <p className="text-muted-foreground">
            Schedule and track vehicle maintenance activities
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle">Select Vehicle</Label>
                <Select value={formData.vehicleId} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.licensePlate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Maintenance Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenanceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the maintenance work..."
                />
              </div>
              <div>
                <Label htmlFor="cost">Estimated Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleAddMaintenance} disabled={isSubmitting}>
                {isSubmitting ? 'Scheduling...' : 'Schedule Maintenance'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenance.length}</div>
            <p className="text-xs text-muted-foreground">
              All records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenance.filter(m => m.status === 'Scheduled').length}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenance.filter(m => m.status === 'In Progress').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${maintenance.reduce((sum, m) => sum + (m.cost || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total maintenance cost
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search maintenance records..."
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
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Maintenance Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaintenance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                        <p>No maintenance records found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaintenance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getVehicleById(record.vehicleId)?.name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{getVehicleById(record.vehicleId)?.licensePlate || ''}</p>
                        </div>
                      </TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={record.status === 'Completed' ? 'default' : 'secondary'}
                          className={statusConfig[record.status as keyof typeof statusConfig]?.color}
                        >
                          <span className="mr-1">{statusConfig[record.status as keyof typeof statusConfig]?.icon}</span>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.scheduledDate}</TableCell>
                      <TableCell>${record.cost?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {record.status === 'Scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateMaintenance(record.id, 'In Progress')}
                            >
                              Start Work
                            </Button>
                          )}
                          {record.status === 'In Progress' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateMaintenance(record.id, 'Completed')}
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteMaintenance(record.id)}
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
