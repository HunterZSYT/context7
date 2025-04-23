'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Database } from '@/types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

// Schema for product form validation
const productFormSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  category_id: z.string().min(1, { message: 'Please select a category.' }),
  stock: z.coerce.number().int().nonnegative({ message: 'Stock must be a non-negative integer.' }),
  brand: z.string().min(1, { message: 'Brand is required.' }),
  sku: z.string().min(3, { message: 'SKU must be at least 3 characters.' }),
  is_featured: z.boolean(),
  discount_percent: z.coerce.number().min(0).max(100),
  images: z.array(z.string()),
  specs: z.record(z.unknown()),
});

// Define the form values type from the schema
type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductForm({ product }: { product?: Product }) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const router = useRouter();
  
  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategoriesLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*');
          
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Failed to load categories. Please try again.');
      } finally {
        setCategoriesLoading(false);
      }
    }
    
    fetchCategories();
  }, []);
  
  // Initialize form with default values or existing product data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price ? Number(product.price) : 0,
      category_id: product?.category_id || '',
      stock: product?.stock || 0,
      brand: product?.brand || '',
      sku: product?.sku || '',
      is_featured: product?.is_featured ?? false,
      discount_percent: product?.discount_percent ?? 0,
      images: product?.images || [],
      specs: product?.specs || {},
    },
  });
  
  // Handle form submission
  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    setIsLoading(true);
    
    try {
      // Prepare the data for Supabase
      const productData: ProductInsert = {
        name: values.name,
        description: values.description,
        price: values.price,
        category_id: values.category_id,
        stock: values.stock,
        brand: values.brand,
        sku: values.sku,
        is_featured: values.is_featured,
        discount_percent: values.discount_percent,
        images: values.images,
        specs: values.specs
      };
      
      let result;
      
      if (product?.id) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
          .select();
          
        if (result.error) throw result.error;
        toast.success('Product updated successfully!');
      } else {
        // Insert new product
        result = await supabase
          .from('products')
          .insert(productData)
          .select();
          
        if (result.error) throw result.error;
        toast.success('Product created successfully!');
      }
      
      router.push('/admin/products');
      router.refresh(); // Refresh to update the UI with the new data
    } catch (error: unknown) {
      console.error('Error saving product:', error);
      
      // Handle duplicate SKU error specifically
      const err = error as { code?: string; message?: string };
      if (err.code === '23505' && err.message?.includes('sku')) {
        toast.error('A product with this SKU already exists. Please use a unique SKU.');
      } else {
        toast.error('Failed to save product. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder image URL input
  const [imageUrl, setImageUrl] = useState('');
  
  const addImage = () => {
    if (!imageUrl.trim()) return;
    
    const currentImages = form.getValues('images');
    form.setValue('images', [...currentImages, imageUrl.trim()]);
    setImageUrl('');
  };
  
  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Product Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="AMD Ryzen 9 5900X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Brand */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="AMD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Stock */}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* SKU */}
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="AMD-R9-5900X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category */}
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={categoriesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.length === 0 && !categoriesLoading && (
                          <SelectItem value="no-category" disabled>
                            No categories available
                          </SelectItem>
                        )}
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {categories.length === 0 && !categoriesLoading && (
                      <FormDescription>
                        Please <Link href="/admin/categories/new" className="text-primary underline">add categories</Link> first.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Discount Percent */}
              <FormField
                control={form.control}
                name="discount_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional discount percentage (0-100)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Featured */}
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Product</FormLabel>
                      <FormDescription>
                        Display this product on the featured section of the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Description - Full Width */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed product description..." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Simple image URL input */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Product Images</h3>
                <div className="flex gap-2">
                  <Input 
                    type="url"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" onClick={addImage}>
                    Add Image
                  </Button>
                </div>
              </div>
              
              {/* Display added images */}
              {(form.watch('images')?.length || 0) > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {form.watch('images')?.map((url, index) => (
                    <div key={index} className="relative group aspect-square border rounded-md overflow-hidden">
                      <Image
                        src={url}
                        alt={`Product ${index}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                        onClick={() => removeImage(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/admin/products')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {product ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}