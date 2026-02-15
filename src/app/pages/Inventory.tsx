import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MultiSelect } from '../components/ui/multi-select';
import { Package, Plus, Edit, AlertTriangle, TrendingUp, TrendingDown, Sparkles, Trash2, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types';

export function Inventory() {
  const { products, deleteProduct } = useCart();
  const navigate = useNavigate();
  
  // Active card filter
  const [activeCard, setActiveCard] = useState<'all' | 'low-stock' | 'out-of-stock'>('all');
  
  // Temporary filter states (before applying)
  const [tempCategoryFilter, setTempCategoryFilter] = useState<string>('all');
  const [tempMaterialFilters, setTempMaterialFilters] = useState<string[]>([]);
  
  // Applied filter states
  const [appliedCategoryFilter, setAppliedCategoryFilter] = useState<string>('all');
  const [appliedMaterialFilters, setAppliedMaterialFilters] = useState<string[]>([]);

  const filteredProducts = products.filter((product) => {
    // Card filter
    let matchesCard = true;
    if (activeCard === 'low-stock') {
      matchesCard = product.stock > 0 && product.stock <= 5;
    } else if (activeCard === 'out-of-stock') {
      matchesCard = product.stock === 0;
    }
    
    const matchesCategory = appliedCategoryFilter === 'all' || product.category === appliedCategoryFilter;
    const matchesMaterial = appliedMaterialFilters.length === 0 || appliedMaterialFilters.some(mat => product.material.toLowerCase().includes(mat.toLowerCase()));
    return matchesCard && matchesCategory && matchesMaterial;
  });

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const handleStockUpdate = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newStock = Math.max(0, product.stock + change);
    updateStock(productId, newStock);
    toast.success(`Stock updated to ${newStock}`);
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addToCart(product);
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error('Product out of stock');
    }
  };

  const handleEdit = (product: Product) => {
    navigate(`/inventory/edit/${product.id}`);
  };

  const handleDelete = (product: Product) => {
    deleteProduct(product.id);
    toast.success(`${product.name} deleted from inventory`);
  };

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

  const applyFilters = () => {
    setAppliedCategoryFilter(tempCategoryFilter);
    setAppliedMaterialFilters(tempMaterialFilters);
    toast.success('Filters applied');
  };

  const clearFilters = () => {
    setTempCategoryFilter('all');
    setTempMaterialFilters([]);
    setAppliedCategoryFilter('all');
    setAppliedMaterialFilters([]);
    toast.success('Filters cleared');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold text-amber-50 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
            <Package className="size-6 sm:size-8 text-amber-400" />
            Inventory Management
          </h2>
          <p className="text-amber-200/60 text-sm sm:text-lg">Manage products and stock levels</p>
        </div>

        <Button 
          onClick={() => navigate('/inventory/new')}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-lg shadow-amber-500/30 w-full sm:w-auto"
        >
          <Plus className="size-5 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            activeCard === 'all'
              ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/40 shadow-lg shadow-blue-500/20'
              : 'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/30'
          } backdrop-blur-sm`}
          onClick={() => setActiveCard('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-amber-200/70">
              Total Products
            </CardTitle>
            <div className={`p-2.5 rounded-lg ${
              activeCard === 'all' ? 'bg-blue-500/30' : 'bg-blue-500/20'
            }`}>
              <Package className="size-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {totalProducts}
            </div>
            <p className="text-xs text-amber-200/50 mt-2 flex items-center gap-1">
              <Sparkles className="size-3" />
              In catalog
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            activeCard === 'low-stock'
              ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/40 shadow-lg shadow-amber-500/20'
              : 'bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20 hover:border-amber-500/30'
          } backdrop-blur-sm`}
          onClick={() => setActiveCard('low-stock')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-amber-200/70">
              Low Stock
            </CardTitle>
            <div className={`p-2.5 rounded-lg ${
              activeCard === 'low-stock' ? 'bg-amber-500/30' : 'bg-amber-500/20'
            }`}>
              <AlertTriangle className="size-5 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {lowStockCount}
            </div>
            <p className="text-xs text-amber-200/50 mt-2 flex items-center gap-1">
              <Sparkles className="size-3" />
              ≤ 5 units
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            activeCard === 'out-of-stock'
              ? 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/40 shadow-lg shadow-red-500/20'
              : 'bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/30'
          } backdrop-blur-sm`}
          onClick={() => setActiveCard('out-of-stock')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-amber-200/70">
              Out of Stock
            </CardTitle>
            <div className={`p-2.5 rounded-lg ${
              activeCard === 'out-of-stock' ? 'bg-red-500/30' : 'bg-red-500/20'
            }`}>
              <TrendingDown className="size-5 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">
              {outOfStockCount}
            </div>
            <p className="text-xs text-amber-200/50 mt-2 flex items-center gap-1">
              <Sparkles className="size-3" />
              Needs restock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-4 sm:p-5 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <Select value={tempCategoryFilter} onValueChange={setTempCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[280px] bg-slate-900/50 border-amber-500/20 text-amber-50 h-11">
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
          <div className="w-full sm:w-[280px]">
            <MultiSelect
              options={materials}
              selected={tempMaterialFilters}
              onChange={setTempMaterialFilters}
              placeholder="Select materials"
            />
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Button
              onClick={applyFilters}
              className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold h-11 px-5"
            >
              <Filter className="size-4 mr-2" />
              Apply
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-1 sm:flex-none border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-11 px-5"
            >
              <X className="size-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-50 flex items-center gap-2">
            <Package className="size-5 text-amber-400" />
            Product Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="size-16 text-amber-400/20 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-amber-50 mb-3">No products found</h3>
              <p className="text-amber-200/60">Add products to start managing inventory</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-xl overflow-hidden border border-amber-500/20">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-900/50 border-amber-500/20 hover:bg-slate-900/50">
                      <TableHead className="text-amber-200/70">Product</TableHead>
                      <TableHead className="text-amber-200/70">Category</TableHead>
                      <TableHead className="text-amber-200/70">Material</TableHead>
                      <TableHead className="text-amber-200/70">Stock</TableHead>
                      <TableHead className="text-right text-amber-200/70">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="border-amber-500/10 hover:bg-slate-900/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="size-12 rounded-lg overflow-hidden bg-slate-900/50 flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold text-amber-50">{product.name}</div>
                              <div className="text-sm text-amber-200/50 line-clamp-1">{product.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-amber-100 text-sm">{product.material}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.stock === 0 ? 'destructive' : product.stock <= 5 ? 'default' : 'default'}
                            className={`w-12 justify-center ${
                              product.stock === 0 
                                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                                : product.stock <= 5
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product)}
                              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                            >
                              <Edit className="size-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(product)}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="size-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-slate-900/30 rounded-xl border border-amber-500/20 p-4"
                  >
                    <div className="flex gap-3 mb-4">
                      <div className="size-20 rounded-lg overflow-hidden bg-slate-900/50 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-amber-50 mb-1">{product.name}</div>
                        <div className="text-sm text-amber-200/50 line-clamp-2 mb-2">{product.description}</div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            {product.category}
                          </Badge>
                          <Badge 
                            className={`text-xs ${
                              product.stock === 0 
                                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                                : product.stock <= 5
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            Stock: {product.stock}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-amber-200/70 mb-3">
                      Material: <span className="text-amber-100">{product.material}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Edit className="size-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product)}
                        className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="size-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}