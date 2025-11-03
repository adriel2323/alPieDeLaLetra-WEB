import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getProductBySlug } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Package, Clock, CheckCircle } from 'lucide-react';
import { ProductSize, InteriorType, CoverType } from '@/types/product';

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug || '');
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<ProductSize>(product?.sizes[0] || 'A5');
  const [selectedInterior, setSelectedInterior] = useState<InteriorType>(product?.interiors[0] || 'semanal');
  const [selectedCover, setSelectedCover] = useState<CoverType>(product?.coverTypes[0] || 'dura');
  const [personalization, setPersonalization] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Producto no encontrado</h1>
          <Button asChild>
            <Link to="/catalogo">Volver al catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      selectedSize,
      selectedInterior,
      selectedCover,
      personalization,
      price: product.basePrice,
    });
    toast.success('¡Producto agregado al carrito!', {
      description: `${product.name} ${personalization ? `- "${personalization}"` : ''}`,
    });
  };

  const whatsappMessage = `Hola! Me interesa este producto:
  
*${product.name}*
Tamaño: ${selectedSize}
Interior: ${selectedInterior}
Tapa: ${selectedCover}
${personalization ? `Personalización: "${personalization}"` : ''}
Cantidad: ${quantity}

¿Está disponible? ✨`;

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(product.basePrice * quantity);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container px-4">
          {/* Breadcrumb */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/catalogo" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al catálogo
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1).map((image, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img src={image} alt={`${product.name} ${i + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-4xl font-bold">{product.name}</h1>
                  {product.remainingQuota <= 5 && (
                    <Badge variant="destructive">
                      ¡Solo {product.remainingQuota} disponibles!
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold text-primary mt-4">{formattedPrice}</p>
                <p className="text-muted-foreground mt-4">{product.description}</p>
              </div>

              {/* Options */}
              <div className="space-y-6 border-y py-6">
                {/* Size */}
                <div className="space-y-2">
                  <Label>Tamaño</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? 'default' : 'outline'}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Interior */}
                <div className="space-y-2">
                  <Label>Tipo de Interior</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.interiors.map((interior) => (
                      <Button
                        key={interior}
                        variant={selectedInterior === interior ? 'default' : 'outline'}
                        onClick={() => setSelectedInterior(interior)}
                        className="capitalize"
                      >
                        {interior}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Cover Type */}
                <div className="space-y-2">
                  <Label>Tipo de Tapa</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.coverTypes.map((cover) => (
                      <Button
                        key={cover}
                        variant={selectedCover === cover ? 'default' : 'outline'}
                        onClick={() => setSelectedCover(cover)}
                        className="capitalize"
                      >
                        Tapa {cover}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Personalization */}
                <div className="space-y-2">
                  <Label htmlFor="personalization">
                    Personalización (opcional)
                  </Label>
                  <Input
                    id="personalization"
                    placeholder="Ej: María, Tu nombre aquí..."
                    value={personalization}
                    onChange={(e) => setPersonalization(e.target.value)}
                    maxLength={30}
                  />
                  <p className="text-xs text-muted-foreground">
                    Máximo 30 caracteres. Sin cargo adicional.
                  </p>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al Carrito
                </Button>
                <WhatsAppButton 
                  message={whatsappMessage}
                  className="w-full"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-6 pt-6 border-t">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Qué Incluye
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Materiales</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.materials.map((material, i) => (
                      <li key={i} className="flex items-start gap-2">
                        • {material}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Tiempo de Producción
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.productionTime}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Entrega rápida en 24-48hs disponible con recargo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton variant="floating" />
    </div>
  );
};

export default ProductDetail;
