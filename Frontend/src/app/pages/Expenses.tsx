import { useState } from 'react';
import { DollarSign, TrendingUp, Fuel, Wrench, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const monthlyExpenses = [
  { month: 'Jan', fuel: 185000, maintenance: 42000 },
  { month: 'Feb', fuel: 192000, maintenance: 38000 },
  { month: 'Mar', fuel: 178000, maintenance: 55000 },
  { month: 'Apr', fuel: 201000, maintenance: 45000 },
  { month: 'May', fuel: 195000, maintenance: 48000 },
  { month: 'Jun', fuel: 188000, maintenance: 41000 },
];

const expenseBreakdown = [
  { name: 'Fuel', value: 188000, color: '#1e40af' },
  { name: 'Maintenance', value: 41000, color: '#10b981' },
  { name: 'Insurance', value: 15000, color: '#f59e0b' },
  { name: 'Tolls & Fees', value: 8000, color: '#06b6d4' },
  { name: 'Other', value: 5000, color: '#8b5cf6' },
];

const vehicleExpenses = [
  {
    vehicle: 'Volvo FH16 - VN-4523',
    fuel: 28500,
    maintenance: 8500,
    total: 37000,
    trips: 12,
    efficiency: 4.2,
  },
  {
    vehicle: 'Tata Prima - MH-7821',
    fuel: 22000,
    maintenance: 6200,
    total: 28200,
    trips: 10,
    efficiency: 3.8,
  },
  {
    vehicle: 'Mahindra Blazo - DL-3267',
    fuel: 31000,
    maintenance: 12000,
    total: 43000,
    trips: 15,
    efficiency: 4.5,
  },
  {
    vehicle: 'Scania R500 - GJ-1892',
    fuel: 35000,
    maintenance: 4500,
    total: 39500,
    trips: 14,
    efficiency: 4.8,
  },
];

export default function Expenses() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expenseType, setExpenseType] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (!expenseType || !selectedVehicle || !amount || !date) {
      toast.error('Please fill all fields');
      return;
    }

    toast.success('Expense Logged', {
      description: `${expenseType} expense of ₹${amount} recorded for ${selectedVehicle}`,
    });

    setExpenseType('');
    setSelectedVehicle('');
    setAmount('');
    setDate('');
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Expenses & Fuel Logging</h1>
          <p className="text-muted-foreground">
            Track operational costs and fuel consumption across your fleet
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Log Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="expense-type">Expense Type</Label>
                <Select value={expenseType} onValueChange={setExpenseType}>
                  <SelectTrigger id="expense-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="tolls">Tolls & Fees</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volvo-vn4523">Volvo FH16 - VN-4523</SelectItem>
                    <SelectItem value="tata-mh7821">Tata Prima - MH-7821</SelectItem>
                    <SelectItem value="mahindra-dl3267">Mahindra Blazo - DL-3267</SelectItem>
                    <SelectItem value="scania-gj1892">Scania R500 - GJ-1892</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                Log Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Expenses (Month)</p>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900 mb-1">₹2,57,000</p>
            <p className="text-xs text-red-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 rotate-180" />
              <span>+5% from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Fuel Costs</p>
              <Fuel className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl text-gray-900 mb-1">₹1,88,000</p>
            <p className="text-xs text-muted-foreground">73% of total</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <Wrench className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl text-gray-900 mb-1">₹41,000</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 rotate-180" />
              <span>-12% reduction</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Cost/Vehicle</p>
              <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center text-amber-600 text-xs">
                ₹
              </div>
            </div>
            <p className="text-2xl text-gray-900 mb-1">₹6,946</p>
            <p className="text-xs text-muted-foreground">Across 37 vehicles</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Expense Trends</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Fuel and maintenance costs over 6 months
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Bar dataKey="fuel" fill="#1e40af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="maintenance" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded" />
                <span className="text-sm text-muted-foreground">Fuel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded" />
                <span className="text-sm text-muted-foreground">Maintenance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Current month distribution
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {expenseBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-gray-900">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle-wise Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle-wise Operational Cost</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed cost analysis per vehicle with efficiency metrics
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vehicleExpenses.map((vehicle) => (
              <div
                key={vehicle.vehicle}
                className="p-5 border rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900 mb-1">{vehicle.vehicle}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.trips} trips completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-xl text-gray-900">₹{vehicle.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Fuel className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-muted-foreground">Fuel</p>
                    </div>
                    <p className="text-lg text-gray-900">₹{vehicle.fuel.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="w-4 h-4 text-emerald-600" />
                      <p className="text-xs text-muted-foreground">Maintenance</p>
                    </div>
                    <p className="text-lg text-gray-900">₹{vehicle.maintenance.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-muted-foreground">Efficiency</p>
                    </div>
                    <p className="text-lg text-gray-900">{vehicle.efficiency} km/L</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{
                        width: `${(vehicle.fuel / vehicle.total) * 100}%`,
                      }}
                    />
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                    {Math.round((vehicle.fuel / vehicle.total) * 100)}% Fuel
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
