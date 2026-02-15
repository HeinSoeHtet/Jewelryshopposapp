import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Receipt, 
  Printer, 
  Download, 
  Filter,
  Calendar,
  User,
  Phone,
  MapPin,
  Diamond,
  Sparkles,
  Plus,
  Mail,
  ShoppingCart,
  HandCoins
} from 'lucide-react';
import { format } from 'date-fns';

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

export function Invoice() {
  const navigate = useNavigate();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceTypeDialog, setShowInvoiceTypeDialog] = useState(false);
  
  // Filter states (temporary, before apply)
  const [idFilter, setIdFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState<'all' | 'sales' | 'pawn'>('all');
  const [dueDateFromFilter, setDueDateFromFilter] = useState('');
  const [dueDateToFilter, setDueDateToFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  
  // Applied filters (actual filters used)
  const [appliedIdFilter, setAppliedIdFilter] = useState('');
  const [appliedDateFromFilter, setAppliedDateFromFilter] = useState('');
  const [appliedDateToFilter, setAppliedDateToFilter] = useState('');
  const [appliedInvoiceTypeFilter, setAppliedInvoiceTypeFilter] = useState<'all' | 'sales' | 'pawn'>('all');
  const [appliedDueDateFromFilter, setAppliedDueDateFromFilter] = useState('');
  const [appliedDueDateToFilter, setAppliedDueDateToFilter] = useState('');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  
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
  ]);

  const handleApplyFilters = () => {
    setAppliedIdFilter(idFilter);
    setAppliedDateFromFilter(dateFromFilter);
    setAppliedDateToFilter(dateToFilter);
    setAppliedInvoiceTypeFilter(invoiceTypeFilter);
    setAppliedDueDateFromFilter(dueDateFromFilter);
    setAppliedDueDateToFilter(dueDateToFilter);
    setAppliedStatusFilter(statusFilter);
  };

  const handleClearFilters = () => {
    setIdFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setInvoiceTypeFilter('all');
    setDueDateFromFilter('');
    setDueDateToFilter('');
    setStatusFilter('all');
    setAppliedIdFilter('');
    setAppliedDateFromFilter('');
    setAppliedDateToFilter('');
    setAppliedInvoiceTypeFilter('all');
    setAppliedDueDateFromFilter('');
    setAppliedDueDateToFilter('');
    setAppliedStatusFilter('all');
  };

  const filteredInvoices = invoices.filter(invoice => {
    // ID Filter
    if (appliedIdFilter && !invoice.invoiceNumber.toLowerCase().includes(appliedIdFilter.toLowerCase())) {
      return false;
    }
    
    // Date Range Filter
    if (appliedDateFromFilter) {
      const filterDate = new Date(appliedDateFromFilter);
      if (invoice.date < filterDate) return false;
    }
    if (appliedDateToFilter) {
      const filterDate = new Date(appliedDateToFilter);
      if (invoice.date > filterDate) return false;
    }
    
    // Invoice Type Filter
    if (appliedInvoiceTypeFilter !== 'all' && invoice.type !== appliedInvoiceTypeFilter) {
      return false;
    }
    
    // Due Date Range Filter (only for pawn invoices)
    if (appliedDueDateFromFilter || appliedDueDateToFilter) {
      if (!invoice.dueDate) return false;
      if (appliedDueDateFromFilter) {
        const filterDate = new Date(appliedDueDateFromFilter);
        if (invoice.dueDate < filterDate) return false;
      }
      if (appliedDueDateToFilter) {
        const filterDate = new Date(appliedDueDateToFilter);
        if (invoice.dueDate > filterDate) return false;
      }
    }
    
    // Status Filter
    if (appliedStatusFilter !== 'all' && invoice.status !== appliedStatusFilter) {
      return false;
    }
    
    return true;
  });

  const handlePrint = (invoice: Invoice) => {
    window.print();
  };

  const handleDownload = (invoice: Invoice) => {
    // In production, this would generate a PDF
    alert(`Downloading invoice ${invoice.invoiceNumber}`);
  };

  const statusConfig = {
    paid: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Paid' },
    pending: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Pending' },
    overdue: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Overdue' },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-amber-50 mb-3 flex items-center gap-3">
            <Receipt className="size-8 text-amber-400" />
            Invoices
          </h2>
          <p className="text-amber-200/60 text-lg">View and manage customer invoices</p>
        </div>
        
        <Button
          onClick={() => setShowInvoiceTypeDialog(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-lg shadow-amber-500/30"
        >
          <Plus className="size-5 mr-2" />
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Filters Card */}
          <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
            <CardHeader>
              <div className="text-lg font-semibold text-amber-50 flex items-center gap-2">
                <Filter className="size-5 text-amber-400" />
                Filters
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ID Filter */}
              <div>
                <Label className="text-sm text-amber-200/60 mb-1.5 block">Invoice ID</Label>
                <Input
                  type="text"
                  value={idFilter}
                  onChange={(e) => setIdFilter(e.target.value)}
                  placeholder="Enter invoice ID..."
                  className="w-full px-3 py-2 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/40"
                />
              </div>

              {/* Date Range Filter */}
              <div>
                <Label className="text-sm text-amber-200/60 mb-1.5 block">Invoice Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={dateFromFilter}
                    onChange={(e) => setDateFromFilter(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 text-xs"
                  />
                  <Input
                    type="date"
                    value={dateToFilter}
                    onChange={(e) => setDateToFilter(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 text-xs"
                  />
                </div>
              </div>

              {/* Invoice Type Filter */}
              <div>
                <Label className="text-sm text-amber-200/60 mb-1.5 block">Invoice Type</Label>
                <Select value={invoiceTypeFilter} onValueChange={(value) => setInvoiceTypeFilter(value as 'all' | 'sales' | 'pawn')}>
                  <SelectTrigger className="w-full bg-slate-900/50 border-amber-500/20 text-amber-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-amber-500/20">
                    <SelectItem value="all" className="text-amber-50">All Types</SelectItem>
                    <SelectItem value="sales" className="text-amber-50">Sales</SelectItem>
                    <SelectItem value="pawn" className="text-amber-50">Pawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date Range Filter */}
              <div>
                <Label className="text-sm text-amber-200/60 mb-1.5 block">Due Date Range (Pawn)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={dueDateFromFilter}
                    onChange={(e) => setDueDateFromFilter(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 text-xs"
                  />
                  <Input
                    type="date"
                    value={dueDateToFilter}
                    onChange={(e) => setDueDateToFilter(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 text-xs"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <Label className="text-sm text-amber-200/60 mb-1.5 block">Status</Label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'paid' | 'pending' | 'overdue')}>
                  <SelectTrigger className="w-full bg-slate-900/50 border-amber-500/20 text-amber-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-amber-500/20">
                    <SelectItem value="all" className="text-amber-50">All Status</SelectItem>
                    <SelectItem value="paid" className="text-amber-50">Paid</SelectItem>
                    <SelectItem value="pending" className="text-amber-50">Pending</SelectItem>
                    <SelectItem value="overdue" className="text-amber-50">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="border-amber-500/30 text-amber-50 hover:bg-amber-500/10"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Cards */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredInvoices.map((invoice) => {
              const config = statusConfig[invoice.status];
              return (
                <Card
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className={`cursor-pointer transition-all hover:border-amber-500/40 ${
                    selectedInvoice?.id === invoice.id
                      ? 'bg-slate-700/50 border-amber-500/40'
                      : 'bg-slate-800/30 border-amber-500/20'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-amber-50">{invoice.invoiceNumber}</div>
                      <Badge className={config.color}>{config.label}</Badge>
                    </div>
                    <div className="text-sm text-amber-200/70 mb-1">{invoice.customerName}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-amber-200/50 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {format(invoice.date, 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm font-bold text-amber-400">
                        ${invoice.total.toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Invoice Detail */}
        <div className="lg:col-span-2">
          {selectedInvoice ? (
            <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg blur-sm opacity-75"></div>
                      <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-lg">
                        <Diamond className="size-6 text-slate-900" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-amber-50 flex items-center gap-2">
                        Luxe Jewelry
                        <Sparkles className="size-4 text-amber-400" />
                      </h3>
                      <p className="text-sm text-amber-200/60">Premium Point of Sale</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-400">{selectedInvoice.invoiceNumber}</div>
                    <Badge className={statusConfig[selectedInvoice.status].color}>
                      {statusConfig[selectedInvoice.status].label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Invoice Info */}
                <div className="grid grid-cols-2 gap-6 p-4 bg-slate-900/30 rounded-xl border border-amber-500/20">
                  <div>
                    <div className="text-sm text-amber-200/60 mb-3">Invoice Date</div>
                    <div className="flex items-center gap-2 text-amber-50">
                      <Calendar className="size-4 text-amber-400" />
                      {format(selectedInvoice.date, 'MMMM dd, yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-amber-200/60 mb-3">Payment Method</div>
                    <div className="text-amber-50">{selectedInvoice.paymentMethod}</div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 bg-slate-900/30 rounded-xl border border-amber-500/20">
                  <div className="text-sm text-amber-200/60 mb-3 flex items-center gap-2">
                    <User className="size-4" />
                    Customer Information
                  </div>
                  <div className="space-y-2">
                    <div className="text-amber-50 font-medium">{selectedInvoice.customerName}</div>
                    <div className="flex items-center gap-2 text-sm text-amber-200/70">
                      <Mail className="size-3.5" />
                      {selectedInvoice.customerEmail}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-200/70">
                      <Phone className="size-3.5" />
                      {selectedInvoice.customerPhone}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-amber-200/70">
                      <MapPin className="size-3.5 mt-0.5" />
                      {selectedInvoice.customerAddress}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-amber-500/20 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Item</th>
                        <th className="text-center py-3 px-4 text-amber-200/70 font-medium">Qty</th>
                        <th className="text-right py-3 px-4 text-amber-200/70 font-medium">Price</th>
                        <th className="text-right py-3 px-4 text-amber-200/70 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id} className="border-t border-amber-500/10">
                          <td className="py-3 px-4">
                            <div className="text-amber-50">{item.name}</div>
                            <div className="text-xs text-amber-200/50">{item.category}</div>
                          </td>
                          <td className="py-3 px-4 text-center text-amber-50">{item.quantity}</td>
                          <td className="py-3 px-4 text-right text-amber-50">${item.price.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-amber-50 font-medium">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="space-y-2 p-4 bg-slate-900/30 rounded-xl border border-amber-500/20">
                  <div className="flex justify-between text-amber-200/70">
                    <span>Subtotal:</span>
                    <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-200/70">
                    <span>Tax (10%):</span>
                    <span>${selectedInvoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-amber-500/20 my-2"></div>
                  <div className="flex justify-between text-xl font-bold text-amber-50">
                    <span>Total:</span>
                    <span className="text-amber-400">${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handlePrint(selectedInvoice)}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
                  >
                    <Printer className="size-4 mr-2" />
                    Print Invoice
                  </Button>
                  <Button
                    onClick={() => handleDownload(selectedInvoice)}
                    variant="outline"
                    className="flex-1 border-amber-500/30 text-amber-50 hover:bg-amber-500/10"
                  >
                    <Download className="size-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20 h-full flex items-center justify-center min-h-[600px]">
              <CardContent className="text-center">
                <Receipt className="size-16 text-amber-400/40 mx-auto mb-4" />
                <p className="text-amber-200/60 text-lg">Select an invoice to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Invoice Type Selection Dialog */}
      {showInvoiceTypeDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800/95 backdrop-blur-md border-amber-500/20 w-full max-w-2xl">
            <CardHeader className="border-b border-amber-500/20">
              <div className="text-2xl font-bold text-amber-50 text-center mb-2">Select Invoice Type</div>
              <p className="text-amber-200/60 text-center">Choose the type of invoice you want to create</p>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sales Invoice */}
                <div
                  onClick={() => {
                    setShowInvoiceTypeDialog(false);
                    navigate('/invoice/create?type=sales');
                  }}
                  className="group cursor-pointer"
                >
                  <Card className="bg-slate-900/50 border-2 border-amber-500/20 hover:border-amber-500/60 transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20">
                    <CardContent className="pt-8 pb-8 text-center">
                      <div className="mb-6">
                        <div className="inline-block relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-600 p-6 rounded-2xl">
                            <ShoppingCart className="size-12 text-slate-900" />
                          </div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-amber-50 mb-3">Sales</h3>
                      <p className="text-amber-200/70 text-sm mb-4">
                        Create a sales invoice using items from your inventory
                      </p>
                      <div className="text-xs text-amber-200/50">
                        • Select from inventory
                        • Auto stock updates
                        • Detailed tracking
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pawn Invoice */}
                <div
                  onClick={() => {
                    setShowInvoiceTypeDialog(false);
                    navigate('/invoice/create?type=pawn');
                  }}
                  className="group cursor-pointer"
                >
                  <Card className="bg-slate-900/50 border-2 border-amber-500/20 hover:border-amber-500/60 transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20">
                    <CardContent className="pt-8 pb-8 text-center">
                      <div className="mb-6">
                        <div className="inline-block relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-2xl">
                            <HandCoins className="size-12 text-slate-900" />
                          </div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-amber-50 mb-3">Pawn</h3>
                      <p className="text-amber-200/70 text-sm mb-4">
                        Create a pawn invoice with custom item entry
                      </p>
                      <div className="text-xs text-amber-200/50">
                        • Manual item entry
                        • Due date tracking
                        • Flexible terms
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={() => setShowInvoiceTypeDialog(false)}
                  variant="outline"
                  className="border-amber-500/30 text-amber-50 hover:bg-amber-500/10"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}