import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { createServerSupabaseClient } from "@/lib/supabase";

// Function to fetch featured products from Supabase
async function getFeaturedProducts() {
  const supabase = createServerSupabaseClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(4);
  
  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  
  return products;
}

// Function to fetch categories from Supabase
async function getCategories() {
  const supabase = createServerSupabaseClient();
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .limit(4);
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return categories;
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-bold">
              Tech Haven
            </Link>
          </div>
          <nav className="hidden space-x-4 md:flex">
            <Link href="/products" className="text-sm font-medium">
              Products
            </Link>
            <Link href="/pc-builder" className="text-sm font-medium">
              PC Builder
            </Link>
            <Link href="/categories" className="text-sm font-medium">
              Categories
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin" target="_blank">
                Admin Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-muted py-12 md:py-24">
          <div className="container flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Build Your Perfect PC with Tech Haven
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Premium computer components and hardware for gaming, content creation, and professional work.
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" asChild>
                <Link href="/pc-builder">Build Your PC</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured products section */}
        <section className="py-12">
          <div className="container space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Products</h2>
                <p className="text-muted-foreground">
                  Explore our handpicked selection of top-tier components.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    ...product,
                    image: product.images?.[0] || '',
                    category: product.category_id
                  }} 
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Categories section */}
        <section className="bg-muted py-12">
          <div className="container space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Shop by Category</h2>
              <p className="text-muted-foreground">
                Find exactly what you need for your next build.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <CategoryCard 
                    key={category.id}
                    name={category.name} 
                    href={`/categories/${category.slug}`} 
                  />
                ))
              ) : (
                <>
                  <CategoryCard name="CPUs" href="/categories/cpus" />
                  <CategoryCard name="GPUs" href="/categories/gpus" />
                  <CategoryCard name="Motherboards" href="/categories/motherboards" />
                  <CategoryCard name="Memory" href="/categories/memory" />
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Tech Haven. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CategoryCard({ name, href }: { name: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative flex h-40 items-center justify-center overflow-hidden rounded-lg bg-slate-950"
    >
      <div className="absolute inset-0 z-10 bg-black/50 transition-opacity group-hover:bg-black/60" />
      <h3 className="z-20 text-xl font-medium text-white">{name}</h3>
    </Link>
  );
}
