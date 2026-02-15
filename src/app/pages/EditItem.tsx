import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCart } from '../context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MultiSelect } from '../components/ui/multi-select';
import { Package, ArrowLeft, Sparkles, Image as ImageIcon, Boxes, Award } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types';

export function EditItem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, updateProduct } = useCart();
  
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'rings',
    price: 0,
    description: '',
    material: '',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
  });

  const materialOptions = [
    '24K Gold',
    '22K Gold',
    '18K Gold',
    '14K Gold',
    'Platinum',
    'Sterling Silver',
    'Diamond',
    'Pearl',
    'Gemstone',
    'Rose Gold',
    'White Gold',
  ].map(mat => ({ value: mat, label: mat }));

  useEffect(() => {
    // Find the product to edit
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData(product);
      // Parse materials from comma-separated string
      if (product.material) {
        const materials = product.material.split(',').map(m => m.trim());
        setSelectedMaterials(materials);
      }
    } else {
      toast.error('Product not found');
      navigate('/inventory');
    }
  }, [id, products, navigate]);

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials(prev => {
      if (prev.includes(material)) {
        return prev.filter(m => m !== material);
      } else {
        return [...prev, material];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || selectedMaterials.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.stock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    const updatedProduct: Product = {
      id: id!,
      name: formData.name!,
      category: formData.category as any,
      price: formData.price || 0,
      description: formData.description!,
      material: selectedMaterials.join(', '),
      stock: Number(formData.stock),
      image: formData.image!,
    };

    updateProduct(updatedProduct);
    toast.success('Product updated successfully!');
    navigate('/inventory');
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="text-amber-200/70 hover:text-amber-50 hover:bg-slate-800/50 mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Inventory
        </Button>
        <h2 className="text-4xl font-bold text-amber-50 mb-3 flex items-center gap-3">
          <Package className="size-8 text-amber-400" />
          Edit Product
        </h2>
        <p className="text-amber-200/60 text-lg">Update product details for your jewelry collection</p>
      </div>

      {/* Form Card */}
      <Card className="bg-slate-800/30 backdrop-blur-sm border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-50 flex items-center gap-2">
            <Sparkles className="size-5 text-amber-400" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <Label htmlFor="name" className="text-amber-200/70 flex items-center gap-2">
                Product Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Diamond Solitaire Ring"
                className="mt-2 bg-slate-900/50 border-amber-500/30 text-amber-50 placeholder:text-amber-200/30 h-11"
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-amber-200/70 flex items-center gap-2">
                Category <span className="text-red-400">*</span>
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value as any })}
              >
                <SelectTrigger className="mt-2 bg-slate-900/50 border-amber-500/30 text-amber-50 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-amber-500/20">
                  <SelectItem value="rings" className="text-amber-50">Rings</SelectItem>
                  <SelectItem value="necklaces" className="text-amber-50">Necklaces</SelectItem>
                  <SelectItem value="bracelets" className="text-amber-50">Bracelets</SelectItem>
                  <SelectItem value="earrings" className="text-amber-50">Earrings</SelectItem>
                  <SelectItem value="watches" className="text-amber-50">Watches</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Materials (Multi-select Dropdown) */}
            <div>
              <Label className="text-amber-200/70 flex items-center gap-2">
                <Award className="size-4" />
                Materials <span className="text-red-400">*</span>
              </Label>
              <div className="mt-2">
                <MultiSelect
                  options={materialOptions}
                  selected={selectedMaterials}
                  onChange={setSelectedMaterials}
                  placeholder="Select materials..."
                />
              </div>
              {selectedMaterials.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedMaterials.map(material => (
                    <span
                      key={material}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-amber-500/20 text-amber-50 text-xs border border-amber-500/30"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stock */}
            <div>
              <Label htmlFor="stock" className="text-amber-200/70 flex items-center gap-2">
                <Boxes className="size-4" />
                Stock Quantity <span className="text-red-400">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                placeholder="10"
                className="mt-2 bg-slate-900/50 border-amber-500/30 text-amber-50 placeholder:text-amber-200/30 h-11"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-amber-200/70 flex items-center gap-2">
                Description <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the product in detail, including craftsmanship, features, and unique qualities..."
                className="mt-2 bg-slate-900/50 border-amber-500/30 text-amber-50 placeholder:text-amber-200/30 min-h-[120px] resize-y"
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="image" className="text-amber-200/70 flex items-center gap-2">
                <ImageIcon className="size-4" />
                Image URL
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="mt-2 bg-slate-900/50 border-amber-500/30 text-amber-50 placeholder:text-amber-200/30 h-11"
              />
              <p className="text-xs text-amber-200/40 mt-2">Leave empty to use default image</p>
              
              {/* Image Preview */}
              {formData.image && (
                <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-amber-500/20">
                  <p className="text-sm text-amber-200/60 mb-3">Preview:</p>
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-900/50">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-amber-500/20">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 bg-slate-900/50 border-amber-500/50 text-amber-50 hover:bg-amber-500/10 hover:border-amber-500/70 hover:text-amber-50 h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-lg shadow-amber-500/30 h-12"
              >
                <Package className="size-5 mr-2" />
                Update Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}