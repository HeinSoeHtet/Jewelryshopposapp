import { useCart } from '../context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { DollarSign, Package, HandCoins, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface InvoiceItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: string;
  type: 'sales' | 'pawn';
  dueDate?: Date;
}

export function Sales() {
  const { products } = useCart();
  
  // Mock invoice data - in production, this would come from a context or API
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2026-001',
      date: new Date('2026-02-14'),
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '+1 (555) 123-4567',
      customerAddress: '123 Luxury Lane, Beverly Hills, CA 90210',
      items: [
        { id: '1', name: 'Diamond Solitaire Ring', category: 'Rings', quantity: 1, price: 2500, total: 2500 },
        { id: '2', name: 'Pearl Necklace', category: 'Necklaces', quantity: 1, price: 850, total: 850 },
      ],
      subtotal: 3350,
      tax: 335,
      total: 3685,
      status: 'paid',
      paymentMethod: 'Credit Card',
      type: 'sales',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2026-002',
      date: new Date('2026-02-13'),
      customerName: 'Michael Chen',
      customerEmail: 'mchen@email.com',
      customerPhone: '+1 (555) 987-6543',
      customerAddress: '456 Oak Street, San Francisco, CA 94102',
      items: [
        { id: '1', name: 'Gold Watch', category: 'Watches', quantity: 1, price: 3200, total: 3200 },
      ],
      subtotal: 3200,
      tax: 320,
      total: 3520,
      status: 'paid',
      paymentMethod: 'Cash',
      type: 'sales',
    },
    {
      id: '3',
      invoiceNumber: 'INV-2026-003',
      date: new Date('2026-02-12'),
      customerName: 'Emily Rodriguez',
      customerEmail: 'emily.r@email.com',
      customerPhone: '+1 (555) 456-7890',
      customerAddress: '789 Palm Drive, Miami, FL 33139',
      items: [
        { id: '1', name: 'Sapphire Earrings', category: 'Earrings', quantity: 1, price: 1800, total: 1800 },
        { id: '2', name: 'Silver Bracelet', category: 'Bracelets', quantity: 2, price: 350, total: 700 },
      ],
      subtotal: 2500,
      tax: 250,
      total: 2750,
      status: 'pending',
      paymentMethod: 'Credit Card',
      type: 'sales',
    },
    {
      id: '4',
      invoiceNumber: 'INV-2026-004',
      date: new Date('2026-02-10'),
      customerName: 'David Kim',
      customerEmail: 'david.k@email.com',
      customerPhone: '+1 (555) 234-5678',
      customerAddress: '321 Main Street, New York, NY 10001',
      items: [
        { id: '1', name: 'Gold Chain', category: 'Necklaces', quantity: 1, price: 1500, total: 1500 },
      ],
      subtotal: 1500,
      tax: 150,
      total: 1650,
      status: 'pending',
      paymentMethod: 'Cash',
      type: 'pawn',
      dueDate: new Date('2026-03-10'),
    },
    {
      id: '5',
      invoiceNumber: 'INV-2026-005',
      date: new Date('2026-02-09'),
      customerName: 'Lisa Anderson',
      customerEmail: 'lisa.a@email.com',
      customerPhone: '+1 (555) 345-6789',
      customerAddress: '567 Broadway, New York, NY 10012',
      items: [
        { id: '1', name: 'Ruby Ring', category: 'Rings', quantity: 1, price: 2800, total: 2800 },
      ],
      subtotal: 2800,
      tax: 280,
      total: 3080,
      status: 'paid',
      paymentMethod: 'Credit Card',
      type: 'pawn',
      dueDate: new Date('2026-03-09'),
    },
  ]);

  // Calculate pawn invoice statistics
  const pawnInvoices = invoices.filter(invoice => invoice.type === 'pawn');
  const pawnCount = pawnInvoices.length;
  const pawnTotalAmount = pawnInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  // Calculate inventory statistics
  const inventoryCount = products.length;
  const inventoryTotalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  // Prepare monthly data for charts
  const monthlyData = [
    { month: 'Jan', pawn: 4200, sales: 8500 },
    { month: 'Feb', pawn: 4730, sales: 9955 },
    { month: 'Mar', pawn: 0, sales: 0 },
    { month: 'Apr', pawn: 0, sales: 0 },
    { month: 'May', pawn: 0, sales: 0 },
    { month: 'Jun', pawn: 0, sales: 0 },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-amber-500/30 p-3 rounded-lg shadow-xl">
          <p className="text-amber-50 font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-4xl font-bold text-amber-50 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
          <TrendingUp className="size-6 sm:size-8 text-amber-400" />
          Sales Dashboard
        </h2>
        <p className="text-amber-200/60 text-sm sm:text-lg">Track your revenue and transactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Pawn Invoices Card */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-amber-200/70">
              Pawn Invoices
            </CardTitle>
            <div className="bg-amber-500/20 p-2.5 rounded-lg">
              <HandCoins className="size-5 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {pawnCount}
            </div>
            <p className="text-xs text-amber-200/50 mt-2 flex items-center gap-1">
              <Sparkles className="size-3" />
              Total amount: ${pawnTotalAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        {/* Inventory Card */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-amber-200/70">
              Inventory
            </CardTitle>
            <div className="bg-emerald-500/20 p-2.5 rounded-lg">
              <Package className="size-5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              {inventoryCount}
            </div>
            <p className="text-xs text-amber-200/50 mt-2 flex items-center gap-1">
              <Sparkles className="size-3" />
              Total value: ${inventoryTotalValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-10">
        {/* Pawn Monthly Chart */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-50 flex items-center gap-2 text-base sm:text-lg">
              <HandCoins className="size-4 sm:size-5 text-amber-400" />
              Monthly Pawn Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#64748b33" />
                <XAxis 
                  dataKey="month" 
                  stroke="#fbbf24"
                  style={{ fontSize: '10px' }}
                  className="sm:text-xs"
                />
                <YAxis 
                  stroke="#fbbf24"
                  style={{ fontSize: '10px' }}
                  className="sm:text-xs"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="pawn" 
                  fill="#fbbf24" 
                  radius={[8, 8, 0, 0]}
                  name="Pawn"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Monthly Chart */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-50 flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="size-4 sm:size-5 text-emerald-400" />
              Monthly Sales Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#64748b33" />
                <XAxis 
                  dataKey="month" 
                  stroke="#10b981"
                  style={{ fontSize: '10px' }}
                  className="sm:text-xs"
                />
                <YAxis 
                  stroke="#10b981"
                  style={{ fontSize: '10px' }}
                  className="sm:text-xs"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="sales" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]}
                  name="Sales"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}