import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { products } from '@/data/products';
import { ProductCategory, ProductSize, InteriorType } from '@/types/product';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedSize, setSelectedSize] = useState<ProductSize | 'all'>('all');
  const [selectedInterior, setSelectedInterior] = useState<InteriorType | 'all'>('all');

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const sizeMatch = selectedSize === 'all' || product.sizes.includes(selectedSize);
    const interiorMatch = selectedInterior === 'all' || product.interiors.includes(selectedInterior);
    
    return categoryMatch && sizeMatch && interiorMatch;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-soft/30 py-16">
          <div className="container px-4">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold">Nuestro Catálogo</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explorá nuestra colección completa de agendas y cuadernos artesanales
              </p>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                ✨ 15 cupos disponibles esta semana
              </Badge>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b bg-background sticky top-16 z-40">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ProductCategory | 'all')}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="agendas">Agendas</SelectItem>
                  <SelectItem value="cuadernos">Cuadernos</SelectItem>
                  <SelectItem value="recetarios">Recetarios</SelectItem>
                  <SelectItem value="libretas">Libretas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as ProductSize | 'all')}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tamaños</SelectItem>
                  <SelectItem value="A5">A5</SelectItem>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="A4.5">A4.5</SelectItem>
                  <SelectItem value="Pocket">Pocket</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedInterior} onValueChange={(value) => setSelectedInterior(value as InteriorType | 'all')}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Interior" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los interiores</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="dos-por-hoja">2 días por hoja</SelectItem>
                  <SelectItem value="universitaria">Universitaria</SelectItem>
                  <SelectItem value="docente">Docente</SelectItem>
                  <SelectItem value="perpetua">Perpetua</SelectItem>
                  <SelectItem value="rayado">Rayado</SelectItem>
                  <SelectItem value="liso">Liso</SelectItem>
                  <SelectItem value="cuadriculado">Cuadriculado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container px-4">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No se encontraron productos con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton variant="floating" />
    </div>
  );
};

export default Shop;
