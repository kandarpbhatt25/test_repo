import { useState } from 'react';
import { Plus, Search, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useDataHelpers } from '../contexts/DataContext';

interface NewExpenseData {
  type: string;
  category: string;
  amount: number;
  description: string;
  vehicleId?: string;
  tripId?: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewExpenseData>({
    type: '',
    category: '',
    amount: 0,
    description: '',
    vehicleId: '',
    tripId: '',
    date: '',
    status: 'Pending',
  });

  const {
    vehicles,
    trips,
    expenses,
    maintenance,
    dispatch,
    getVehicleById,
    getTripById,
  } = useDataHelpers();

  // Add new expense
  const handleAddExpense = async () => {
    console.log('handleAddExpense called', formData);
    if (!formData.type || !formData.category || formData.amount <= 0 || !formData.description || !formData.date) {
      console.log('Validation failed', { type: formData.type, category: formData.category, amount: formData.amount, description: formData.description, date: formData.date });
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newExpense = {
        id: Date.now().toString(),
        type: formData.type,
        category: formData.category,
        amount: formData.amount,
        description: formData.description,
        vehicleId: formData.vehicleId,
        tripId: formData.tripId,
        date: formData.date,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      setIsAddDialogOpen(false);
      setFormData({
        type: '',
        category: '',
        amount: 0,
        description: '',
        vehicleId: '',
        tripId: '',
        date: '',
        status: 'Pending',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update expense status
  const handleUpdateExpense = async (id: string, status: any) => {
    try {
      dispatch({ type: 'UPDATE_EXPENSE', payload: { id, data: { status } } });
    } catch (err: any) {
      alert(err.message || 'Failed to update expense');
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (err: any) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  // Add maintenance records to expenses for calculation
  const allExpensesWithMaintenance: any[] = [
    ...expenses,
    ...maintenance.map(maint => ({
      id: `maint-${maint.id}`,
      type: maint.type,
      category: 'Maintenance',
      amount: maint.cost || 0,
      description: maint.description,
      vehicleId: maint.vehicleId,
      tripId: '',
      date: maint.scheduledDate,
      status: maint.status === 'Completed' ? 'Approved' : 'Pending',
      createdAt: maint.createdAt,
      updatedAt: maint.updatedAt,
    }))
  ];

  // Filter expenses
  const filteredExpenses = allExpensesWithMaintenance.filter((expense) => {
    const matchesSearch =
      expense.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Status configuration
  const statusConfig = {
    Pending: { color: 'bg-amber-100 text-amber-700', icon: '⏳' },
    Approved: { color: 'bg-green-100 text-green-700', icon: '✅' },
    Rejected: { color: 'bg-red-100 text-red-700', icon: '❌' },
  };

  // Expense categories
  const expenseCategories = [
    'Fuel',
    'Maintenance',
    'Insurance',
    'Registration',
    'Tolls',
    'Parking',
    'Other',
  ];

  // Expense types
  const expenseTypes = [
    'Fuel Purchase',
    'Maintenance Service',
    'Repair Cost',
    'Insurance Premium',
    'Registration Fee',
    'Toll Payment',
    'Parking Fee',
    'Miscellaneous',
  ];

  // Calculate monthly data for charts
  const monthlyData = allExpensesWithMaintenance.reduce((acc: Record<string, { fuel: number; maintenance: number; other: number }>, expense: any) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { fuel: 0, maintenance: 0, other: 0 };
    }
    
    if (expense.category === 'Fuel') {
      acc[month].fuel += expense.amount;
    } else if (expense.category === 'Maintenance') {
      acc[month].maintenance += expense.amount;
    } else {
      acc[month].other += expense.amount;
    }
    
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    fuel: data.fuel,
    maintenance: data.maintenance,
    other: data.other,
    total: data.fuel + data.maintenance + data.other,
  }));

  // Category distribution for pie chart
  const categoryData = expenseCategories.map(category => ({
    name: category,
    value: allExpensesWithMaintenance.filter((e: any) => e.category === category).reduce((sum: number, e: any) => sum + e.amount, 0),
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Expenses</h1>
          <p className="text-muted-foreground">
            Track and manage fleet expenses and costs
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Expense Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="vehicle">Vehicle (Optional)</Label>
                <Select value={formData.vehicleId} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No vehicle</SelectItem>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.licensePlate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trip">Trip (Optional)</Label>
                <Select value={formData.tripId} onValueChange={(value) => setFormData(prev => ({ ...prev, tripId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose trip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No trip</SelectItem>
                    {trips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id}>
                        {trip.id} - {trip.origin} → {trip.destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the expense..."
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => { console.log('Button clicked'); handleAddExpense(); }} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Expense'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${allExpensesWithMaintenance.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${allExpensesWithMaintenance.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {allExpensesWithMaintenance.filter(e => e.status === 'Pending').length} items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${allExpensesWithMaintenance.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {allExpensesWithMaintenance.filter(e => e.status === 'Approved').length} items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${allExpensesWithMaintenance.filter(e => e.status === 'Rejected').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {allExpensesWithMaintenance.filter(e => e.status === 'Rejected').length} items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fuel" stackId="a" fill="#0088FE" name="Fuel" />
                <Bar dataKey="maintenance" stackId="a" fill="#00C49F" name="Maintenance" />
                <Bar dataKey="other" stackId="a" fill="#FFBB28" name="Other" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses by type, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expenses Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Trip</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        <p>No expenses found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.type}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        {expense.vehicleId ? getVehicleById(expense.vehicleId)?.name || 'Unknown' : '-'}
                      </TableCell>
                      <TableCell>
                        {expense.tripId ? getTripById(expense.tripId)?.id || 'Unknown' : '-'}
                      </TableCell>
                      <TableCell className="font-medium">${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={expense.status === 'Approved' ? 'default' : 'secondary'}
                          className={statusConfig[expense.status as keyof typeof statusConfig]?.color}
                        >
                          <span className="mr-1">{statusConfig[expense.status as keyof typeof statusConfig]?.icon}</span>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {expense.status === 'Pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateExpense(expense.id, 'Approved')}
                            >
                              Approve
                            </Button>
                          )}
                          {expense.status === 'Pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateExpense(expense.id, 'Rejected')}
                            >
                              Reject
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteExpense(expense.id)}
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
