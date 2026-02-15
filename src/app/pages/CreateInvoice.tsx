import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useCart } from '../context/CartContext';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MultiSelect } from '../components/ui/multi-select';
import { 
  Receipt, 
  User,
  Phone,
  MapPin,
  ShoppingCart,
  Plus,
  X,
  Trash2,
  ArrowLeft,
  Diamond,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '../components/ui/textarea';

export function CreateInvoice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceType = (searchParams.get('type') as 'sales' | 'pawn') || 'sales';
  const { products } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [status, setStatus] = useState<'paid' | 'pending' | 'overdue'>('pending');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Sales invoice items (from inventory)
  const [selectedItems, setSelectedItems] = useState<Array<{
    productId: string;
    quantity: number;
    returnType: 'making-charges' | 'percentage';
    price: number;
    discount: number;
  }>>([]);
  
  // Pawn invoice items (manual entry)
  const [pawnItems, setPawnItems] = useState<Array<{
    name: string;
    quantity: number;
    price: number;
  }>>([]);

  // Dialog state
  const [showItemDialog, setShowItemDialog] = useState(false);
  
  // Filter states for product selection (used in dialog)
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [materialFilters, setMaterialFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered products based on filters
  const filteredProductsForInvoice = products.filter((product) => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesMaterial = materialFilters.length === 0 || materialFilters.some(mat => product.material.toLowerCase().includes(mat.toLowerCase()));
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesMaterial && matchesSearch;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'rings', label: 'Rings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'watches', label: 'Watches' },
  ];

  const materials = [
    { value: '24K Gold', label: '24K Gold' },
    { value: '22K Gold', label: '22K Gold' },
    { value: '18K Gold', label: '18K Gold' },
    { value: '14K Gold', label: '14K Gold' },
    { value: 'White Gold', label: 'White Gold' },
    { value: 'Yellow Gold', label: 'Yellow Gold' },
    { value: 'Rose Gold', label: 'Rose Gold' },
    { value: 'Platinum', label: 'Platinum' },
    { value: 'Sterling Silver', label: 'Sterling Silver' },
    { value: 'Stainless Steel', label: 'Stainless Steel' },
    { value: 'Diamond', label: 'Diamond' },
    { value: 'Pearl', label: 'Pearl' },
    { value: 'Gemstone', label: 'Gemstone' },
    { value: 'Sapphire', label: 'Sapphire' },
    { value: 'Emerald', label: 'Emerald' },
    { value: 'Ruby', label: 'Ruby' },
  ];

  const statusConfig = {
    paid: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Paid' },
    pending: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Pending' },
    overdue: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Overdue' },
  };

  // Pawn item functions
  const addPawnItem = () => {
    setPawnItems([...pawnItems, { name: '', quantity: 1, price: 0 }]);
  };

  const removePawnItem = (index: number) => {
    setPawnItems(pawnItems.filter((_, i) => i !== index));
  };

  const updatePawnItemName = (index: number, name: string) => {
    const updated = [...pawnItems];
    updated[index].name = name;
    setPawnItems(updated);
  };

  const updatePawnItemQuantity = (index: number, quantity: number) => {
    const updated = [...pawnItems];
    updated[index].quantity = Math.max(1, quantity);
    setPawnItems(updated);
  };

  const updatePawnItemPrice = (index: number, price: number) => {
    const updated = [...pawnItems];
    updated[index].price = Math.max(0, price);
    setPawnItems(updated);
  };

  const calculatePawnTotal = () => {
    const total = pawnItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    return { total };
  };

  const addItemToInvoice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedItems([...selectedItems, { productId, quantity: 1, returnType: 'percentage', price: product.price, discount: 0 }]);
    }
    setShowItemDialog(false);
    // Reset filters
    setCategoryFilter('all');
    setMaterialFilters([]);
    setSearchTerm('');
    toast.success('Item added to invoice');
  };

  const removeItemFromInvoice = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateInvoiceItemQuantity = (index: number, quantity: number) => {
    const updated = [...selectedItems];
    updated[index].quantity = Math.max(1, quantity);
    setSelectedItems(updated);
  };

  const updateInvoiceItemReturnType = (index: number, returnType: 'making-charges' | 'percentage') => {
    const updated = [...selectedItems];
    updated[index].returnType = returnType;
    setSelectedItems(updated);
  };

  const updateInvoiceItemPrice = (index: number, price: number) => {
    const updated = [...selectedItems];
    updated[index].price = Math.max(0, price);
    setSelectedItems(updated);
  };

  const updateInvoiceItemDiscount = (index: number, discount: number) => {
    const updated = [...selectedItems];
    updated[index].discount = Math.max(0, discount);
    setSelectedItems(updated);
  };

  const updateInvoiceItemProduct = (index: number, productId: string) => {
    const updated = [...selectedItems];
    updated[index].productId = productId;
    setSelectedItems(updated);
  };

  const calculateInvoiceTotal = () => {
    const subtotal = selectedItems.reduce((sum, item) => {
      const lineTotal = (item.price * item.quantity) - item.discount;
      return sum + lineTotal;
    }, 0);
    const tax = subtotal * 0.1;
    const totalDiscount = selectedItems.reduce((sum, item) => sum + item.discount, 0);
    return { subtotal, tax, total: subtotal + tax, totalDiscount };
  };

  const handleCreateInvoice = () => {
    if (!customerName || selectedItems.length === 0) {
      toast.error('Please fill customer name and add at least one item');
      return;
    }

    // In a real app, this would save to backend/database
    toast.success('Invoice created successfully!');
    navigate('/invoice');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-amber-50 mb-3 flex items-center gap-3">
            <Receipt className="size-8 text-amber-400" />
            Create New Invoice
            <Badge className={invoiceType === 'pawn' 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 text-lg px-4 py-1.5' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-lg px-4 py-1.5'
            }>
              {invoiceType === 'pawn' ? 'Pawn' : 'Sales'}
            </Badge>
          </h2>
          <p className="text-amber-200/60 text-lg">
            {invoiceType === 'pawn' 
              ? 'Fill in the details to create a new pawn invoice with custom items'
              : 'Fill in the details to create a new sales invoice from inventory'
            }
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/invoice')}
          variant="outline"
          className="border-amber-500/30 text-amber-50 hover:bg-amber-500/10"
        >
          <ArrowLeft className="size-5 mr-2" />
          Back to Invoices
        </Button>
      </div>

      <div className="space-y-6">
        {/* Customer Info */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
          <CardHeader>
            <div className="text-lg font-semibold text-amber-50 flex items-center gap-2">
              <User className="size-5 text-amber-400" />
              Customer Information
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-amber-200/60 mb-1.5 block">Name *</Label>
                <Input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full pl-4 pr-4 py-3 bg-slate-900/50 border border-amber-500/20 rounded-xl text-amber-50 placeholder-amber-200/40 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <Label className="text-sm text-amber-200/60 mb-1.5 block">Phone</Label>
                <Input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full pl-4 pr-4 py-3 bg-slate-900/50 border border-amber-500/20 rounded-xl text-amber-50 placeholder-amber-200/40 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <Label className="text-sm text-amber-200/60 mb-1.5 block">Address</Label>
                <Input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Enter address"
                  className="w-full pl-4 pr-4 py-3 bg-slate-900/50 border border-amber-500/20 rounded-xl text-amber-50 placeholder-amber-200/40 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-amber-50 flex items-center gap-2">
                <ShoppingCart className="size-5 text-amber-400" />
                Invoice Items
              </div>
              <Button
                onClick={() => {
                  if (invoiceType === 'pawn') {
                    addPawnItem();
                  } else {
                    setShowItemDialog(true);
                  }
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
              >
                <Plus className="size-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items Table */}
            {invoiceType === 'pawn' ? (
              pawnItems.length > 0 ? (
                <div className="border border-amber-500/20 rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Item</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Qty</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Price</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Total</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pawnItems.map((item, index) => {
                        const lineTotal = item.price * item.quantity;
                        return (
                          <tr key={index} className="border-t border-amber-500/10">
                            <td className="py-3 px-4">
                              <Input
                                type="text"
                                value={item.name}
                                onChange={(e) => updatePawnItemName(index, e.target.value)}
                                placeholder="Enter item name"
                                className="w-full min-w-[200px] px-3 py-2 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/40 h-9"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updatePawnItemQuantity(index, parseInt(e.target.value) || 1)}
                                className="w-20 px-2 py-1 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 h-9"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => updatePawnItemPrice(index, parseFloat(e.target.value) || 0)}
                                className="w-28 px-2 py-1 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 h-9"
                              />
                            </td>
                            <td className="py-3 px-4 text-left text-amber-50 font-medium">
                              ${lineTotal.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-left">
                              <Button
                                onClick={() => removePawnItem(index)}
                                variant="outline"
                                size="sm"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-900/50 border-t-2 border-amber-500/30">
                      <tr>
                        <td colSpan={3} className="py-3 px-4 text-right text-amber-200/70 font-semibold text-lg">
                          Total:
                        </td>
                        <td className="py-3 px-4 text-left text-amber-400 font-bold text-lg">
                          ${calculatePawnTotal().total.toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="border border-amber-500/20 rounded-xl p-12 text-center">
                  <ShoppingCart className="size-12 text-amber-400/40 mx-auto mb-4" />
                  <p className="text-amber-200/60">No items added yet. Click "Add Item" to get started.</p>
                </div>
              )
            ) : (
              /* Sales Invoice Items Table */
              selectedItems.length > 0 ? (
                <div className="border border-amber-500/20 rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">ID</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Item</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Return Type</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Qty</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Price</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Discount</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Total</th>
                        <th className="text-left py-3 px-4 text-amber-200/70 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map((item, index) => {
                        const product = products.find(p => p.id === item.productId);
                        const lineTotal = (item.price * item.quantity) - item.discount;
                        return (
                          <tr key={index} className="border-t border-amber-500/10">
                            <td className="py-3 px-4">
                              <div className="text-xs text-amber-200/50">{product?.id.slice(0, 8)}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                <span className="text-amber-50 text-sm">{product ? product.name : 'Unknown Product'}</span>
                                {product && <span className="text-xs text-amber-200/50">{product.category}</span>}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Select
                                value={item.returnType}
                                onValueChange={(value) => updateInvoiceItemReturnType(index, value as 'making-charges' | 'percentage')}
                              >
                                <SelectTrigger className="w-[160px] bg-slate-900/50 border-amber-500/20 text-amber-50 h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-amber-500/20">
                                  <SelectItem value="making-charges" className="text-amber-50">Making Charges</SelectItem>
                                  <SelectItem value="percentage" className="text-amber-50">Percentage</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateInvoiceItemQuantity(index, parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 h-9"
                              />
                            </td>
                            <td className="py-3 px-4 text-left">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => updateInvoiceItemPrice(index, parseFloat(e.target.value) || 0)}
                                className="w-24 px-2 py-1 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 h-9 text-left"
                              />
                            </td>
                            <td className="py-3 px-4 text-left">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.discount}
                                onChange={(e) => updateInvoiceItemDiscount(index, parseFloat(e.target.value) || 0)}
                                className="w-24 px-2 py-1 bg-slate-900/50 border-amber-500/20 rounded-lg text-amber-50 h-9 text-left"
                              />
                            </td>
                            <td className="py-3 px-4 text-left text-amber-50 font-medium">
                              ${lineTotal.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-left">
                              <Button
                                onClick={() => removeItemFromInvoice(index)}
                                variant="outline"
                                size="sm"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-900/50 border-t-2 border-amber-500/30">
                      <tr>
                        <td colSpan={6} className="py-3 px-4 text-right text-amber-200/70">
                          Total Discount:
                        </td>
                        <td className="py-3 px-4 text-left text-amber-50 font-medium">
                          ${calculateInvoiceTotal().totalDiscount.toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="py-3 px-4 text-right text-amber-200/70 font-semibold text-lg">
                          Total:
                        </td>
                        <td className="py-3 px-4 text-left text-amber-400 font-bold text-lg">
                          ${calculateInvoiceTotal().total.toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="border border-amber-500/20 rounded-xl p-12 text-center">
                  <ShoppingCart className="size-12 text-amber-400/40 mx-auto mb-4" />
                  <p className="text-amber-200/60">No items added yet. Click "Add Item" to get started.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Invoice Status & Notes */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
          <CardHeader>
            <div className="text-lg font-semibold text-amber-50">Invoice Status & Notes</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-amber-200/60 mb-1.5 block">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as 'paid' | 'pending' | 'overdue')}
                >
                  <SelectTrigger className="w-full pl-4 pr-4 py-3 bg-slate-900/50 border border-amber-500/20 rounded-xl text-amber-50">
                    <SelectValue>
                      <Badge className={statusConfig[status].color}>
                        {statusConfig[status].label}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-amber-500/20">
                    <SelectItem value="paid" className="text-amber-50">Paid</SelectItem>
                    <SelectItem value="pending" className="text-amber-50">Pending</SelectItem>
                    <SelectItem value="overdue" className="text-amber-50">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {invoiceType === 'pawn' && (
                <div>
                  <Label className="text-sm text-amber-200/60 mb-1.5 block">Due Date</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-slate-900/50 border border-amber-500/20 rounded-xl text-amber-50 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="text-sm text-amber-200/60 mb-1.5 block">Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or comments..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/20 rounded-xl text-amber-50 placeholder-amber-200/40 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Button
                onClick={handleCreateInvoice}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 py-6 text-lg"
              >
                <Receipt className="size-5 mr-2" />
                Create Invoice
              </Button>
              <Button
                onClick={() => navigate('/invoice')}
                variant="outline"
                className="flex-1 border-amber-500/30 text-amber-50 hover:bg-amber-500/10 py-6 text-lg"
              >
                <X className="size-5 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Item Dialog */}
      {showItemDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800/95 backdrop-blur-md border-amber-500/20 w-full max-w-4xl max-h-[90vh] flex flex-col">
            <CardHeader className="border-b border-amber-500/20">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-amber-50 flex items-center gap-2">
                  <ShoppingCart className="size-5 text-amber-400" />
                  Select Item to Add
                </h3>
                <Button
                  onClick={() => {
                    setShowItemDialog(false);
                    setCategoryFilter('all');
                    setMaterialFilters([]);
                    setSearchTerm('');
                  }}
                  variant="outline"
                  size="sm"
                  className="border-amber-500/30 text-amber-50 hover:bg-amber-500/10"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6 flex-1 overflow-auto">
              {/* Filters */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-amber-400/60" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or ID..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-amber-500/20 rounded-xl text-amber-50 placeholder-amber-200/40 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="flex-1 bg-slate-900/50 border-amber-500/20 text-amber-50 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-amber-500/20">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="text-amber-50">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1">
                    <MultiSelect
                      options={materials}
                      selected={materialFilters}
                      onChange={setMaterialFilters}
                      placeholder="Filter by materials"
                    />
                  </div>
                </div>
              </div>

              {/* Product List - Only show if filters applied */}
              {categoryFilter !== 'all' || materialFilters.length > 0 || searchTerm ? (
                filteredProductsForInvoice.length > 0 ? (
                  <div className="border border-amber-500/20 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-900/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-amber-200/70 font-medium">ID</th>
                          <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Category</th>
                          <th className="text-left py-3 px-4 text-amber-200/70 font-medium">Material</th>
                          <th className="text-center py-3 px-4 text-amber-200/70 font-medium">Stock</th>
                          <th className="text-right py-3 px-4 text-amber-200/70 font-medium">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProductsForInvoice.map((product) => (
                          <tr
                            key={product.id}
                            className="border-t border-amber-500/10 hover:bg-slate-900/50 cursor-pointer transition-colors group"
                            onClick={() => addItemToInvoice(product.id)}
                          >
                            <td className="py-3 px-4">
                              <div className="text-xs text-amber-200/50">{product.id.slice(0, 8)}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Diamond className="size-4 text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                                <span className="text-amber-50 group-hover:text-amber-400 transition-colors font-medium">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                                {product.category}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-amber-50">{product.material}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className={product.stock > 10 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : product.stock > 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                                {product.stock}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="text-base font-bold text-amber-400">${product.price.toFixed(2)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 border border-amber-500/20 rounded-xl">
                    <Diamond className="size-12 text-amber-400/40 mx-auto mb-4" />
                    <p className="text-amber-200/60">No products found. Try adjusting your filters.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-16 border border-amber-500/20 rounded-xl bg-slate-900/30">
                  <Search className="size-16 text-amber-400/40 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-amber-50 mb-2">Search for Products</h4>
                  <p className="text-amber-200/60">Use the search bar or filters above to find products</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}