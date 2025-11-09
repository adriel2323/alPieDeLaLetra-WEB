// src/pages/ProductDetail.tsx
import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getProductBySlug } from '@/data/products';
import { modeloOptions } from '@/data/options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Package, Clock, CheckCircle, Wand2, Maximize2 } from 'lucide-react';
import { ProductSize, InteriorType, CoverType, Product } from '@/types/product';
import AppVars from '@/data/data';

// ⬇️ Asegurate que este import apunte a tu archivo real del selector:
import { AgendaModelSelector } from '@/components/products/AgendaModelOption';
// (Si tu archivo está en otra ruta, ajustá el import. El componente debe devolver el id seleccionado.)

import ProductImageGallery from '@/components/products/ProductImageGallery';
import FullscreenModelDialog from '@/components/products/FullscreenModelDialog';

// —— Configuración WhatsApp ————————————————————————————————
const WHATSAPP_NUMBER = AppVars.phoneNumber;

function buildWaLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// —— Chips de personalización ——————————————————————————————
const PERSONALIZATION_STYLES = [
  { id: 'nombre', label: 'Nombre/Iniciales' },
  { id: 'frase', label: 'Frase/Versículo' },
  { id: 'foto', label: 'Foto/Imagen' },
  { id: 'trama', label: 'Trama/Patrón' },
  { id: 'logo', label: 'Logo/Marca' },
] as const;
type PersonalizationStyleId = typeof PERSONALIZATION_STYLES[number]['id'];

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug || '');
  const { addItem } = useCart();

  // ——— Estado base del producto
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product?.sizes?.[0] || 'A5');
  const [selectedInterior, setSelectedInterior] = useState<InteriorType>(product?.interiors?.[0] || 'semanal');
  const [selectedCover, setSelectedCover] = useState<CoverType>(product?.coverTypes?.[0] || 'dura');
  const [personalization, setPersonalization] = useState('');
  const [quantity, setQuantity] = useState(1);

  // ——— Modelo (UNIFICADO EN ID)
  const [selectedModelId, setSelectedModelId] = useState<string>(modeloOptions[0]?.id ?? '');

  // Derivados seguros desde el ID
  const selectedModelDef = useMemo(
    () => modeloOptions.find(m => m.id === selectedModelId),
    [selectedModelId]
  );
  const selectedModelLabel = selectedModelDef?.modelo ?? 'a confirmar';
  const selectedModelImage = selectedModelDef?.image ?? product?.images?.[0] ?? '';

  // ——— Personalización UI
  const [styleId, setStyleId] = useState<PersonalizationStyleId>('nombre');
  const [fsImage, setFsImage] = useState<string | null>(null);

  // ——— Colecciones (filtro visual)
  const collections = useMemo(
    () => Array.from(new Set(modeloOptions.map(m => m.collection ?? 'otras'))),
    []
  );
  const [selectedCollection, setSelectedCollection] = useState<string>(collections[0] ?? 'todas');

  const filteredModels = useMemo(
    () =>
      modeloOptions.filter(m =>
        !selectedCollection || selectedCollection === 'todas' ? true : m.collection === selectedCollection
      ),
    [selectedCollection]
  );

  // ——— Mensajes WA
  const whatsappPersonalizationMessage = useMemo(() => {
    const styleLabel = PERSONALIZATION_STYLES.find(s => s.id === styleId)?.label ?? 'A definir';
    const name = product?.name ?? 'Producto';
    return [
      `¡Hola! Quiero personalizar este producto:`,
      ``,
      `*${name}*`,
      `Modelo: ${selectedModelLabel}`,
      `Tamaño: ${selectedSize} | Interior: ${selectedInterior} | Tapa: ${selectedCover}`,
      personalization ? `Texto (opcional): “${personalization}”` : `Texto: a definir`,
      ``,
      `Estilo de personalización elegido: *${styleLabel}*`,
      `¿Podemos ver opciones? Si hace falta, te envío imagen/referencia acá mismo.`,
    ].join('\n');
  }, [product?.name, selectedModelLabel, selectedSize, selectedInterior, selectedCover, personalization, styleId]);

  const whatsappMessage = useMemo(() => {
    const name = product?.name ?? 'Producto';
    return `Hola! Me interesa este producto:
    
*${name}*
Modelo: ${selectedModelLabel}
Tamaño: ${selectedSize}
Interior: ${selectedInterior}
Tapa: ${selectedCover}
${personalization ? `Personalización: "${personalization}"` : ''}
Cantidad: ${quantity}

¿Está disponible? ✨`;
  }, [product?.name, selectedModelLabel, selectedSize, selectedInterior, selectedCover, personalization, quantity]);

  const formattedPrice = useMemo(() => {
    const base = product?.basePrice ?? 0;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(base * quantity);
  }, [product?.basePrice, quantity]);

  // ——— Add to cart con tipos consistentes
  const handleAddToCart = () => {
    if (!product) return;

    const cartProduct: Pick<Product, 'id' | 'name' | 'basePrice' | 'images'> = {
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      images: product.images,
    };

    addItem({
      product: cartProduct,
      quantity,
      price: product.basePrice,
      selectedSize,
      selectedInterior,
      selectedCover,
      personalization: personalization || undefined,
      // Guardamos el NOMBRE del modelo (legible en WA)
      selectedModel: selectedModelLabel,
    });

    toast.success('¡Producto agregado al carrito!', {
      description: `${product.name} ${personalization ? `- "${personalization}"` : ''}`,
    });
  };

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

  return (
    <div className="min-h-screen overflow-x-clip">
      <Header />
      <main className="py-8 w-full max-w-full">
        <div className="container px-4">
          {/* Breadcrumb */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/catalogo" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al catálogo
            </Link>
          </Button>

          <div className="w-full max-w-full min-w-0 grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galería */}
            <div className="space-y-4 min-w-0">
              <ProductImageGallery
                images={product?.images ?? []}
                altBase={product?.name ?? 'Producto'}
                onOpenFullscreen={(src) => setFsImage(src)}
              />
            </div>

            {/* Info */}
            <div className="space-y-8 min-w-0">
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold break-words">{product.name}</h1>
                  {product.remainingQuota <= 5 && (
                    <Badge variant="destructive" className="shrink-0">
                      ¡Solo {product.remainingQuota} disponibles!
                    </Badge>
                  )}
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-primary mt-3 sm:mt-4">{formattedPrice}</p>
                <p className="text-muted-foreground mt-3 break-words">{product.description}</p>
              </div>

              {/* Detalles */}
              <div className="space-y-6 lg:space-y-0 grid grid-cols-1 lg:grid-cols-2  pt-6 border-t w-full max-w-full">
                <div>
                  <h3 className="font-semibold mb-3  flex items-center gap-2">
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
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Materiales
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.materials.map((material, i) => (
                      <li key={i} className="flex items-start gap-2">• {material}</li>
                    ))}
                  </ul>
                </div>

                <div className=''>
                  <h3 className="lg:mt-3 font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Tiempo de Producción
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.productionTime}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Entrega rápida en 24–48hs disponible con recargo
                  </p>
                </div>
              </div>

              {/* Personalización */}
              <div className="space-y-4 rounded-2xl border p-4 sm:p-5 w-full max-w-full">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Personalizá tu agenda</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Portada o interior: <strong>foto</strong>, <strong>frase</strong>, <strong>nombre</strong> o <strong>trama</strong>. Lo definimos por WhatsApp con <em>boceto previo</em>.
                </p>

                {/* Chips (radiogroup) */}
                <div role="radiogroup" aria-label="Estilos de personalización" className="flex flex-wrap gap-2">
                  {PERSONALIZATION_STYLES.map((s) => {
                    const selected = styleId === s.id;
                    return (
                      <button
                        key={s.id}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setStyleId(s.id)}
                        className={[
                          "px-3 py-1.5 rounded-full text-sm transition-colors",
                          "ring-1 ring-slate-300/60",
                          selected ? "bg-primary text-primary-foreground ring-primary"
                                   : "bg-white hover:bg-slate-50"
                        ].join(" ")}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>

                {/* Texto opcional */}
                <div className="space-y-2">
                  <Label htmlFor="personalization">Texto (opcional)</Label>
                  <Input
                    id="personalization"
                    placeholder='Ej.: "María" o "¡Vamos por más!"'
                    value={personalization}
                    onChange={(e) => setPersonalization(e.target.value)}
                    maxLength={40}
                  />
                  <p className="text-xs text-muted-foreground">
                    Si elegís “Foto/Logo”, te pediremos el archivo por WhatsApp.
                  </p>
                </div>

                {/* CTAs */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button asChild className="w-full">
                    <a href={buildWaLink(whatsappPersonalizationMessage)} target="_blank" rel="noopener noreferrer">
                      Definir personalización por WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="#inspirate">Ver ideas e inspiración</a>
                  </Button>
                </div>

                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Boceto incluido (1 revisión). Producción: 8–10 h. Entrega rápida 24–48 h (con recargo).</li>
                  <li>• Para fotos: luz natural y al menos ~1500 px del lado más corto.</li>
                </ul>
              </div>

              {/* Opciones básicas */}
              <div className="space-y-6 border-y py-6 w-full max-w-full">
                <div className="space-y-3">
                  <Label>Modelo de Agenda</Label>

                  {/* Filtros de colección */}
                  <div className="flex flex-wrap gap-2">
                    {['todas', ...collections].map((col) => {
                      const isActive = selectedCollection === col;
                      return (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setSelectedCollection(col)}
                          className={[
                            "px-3 py-1.5 rounded-full text-sm transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                          ].join(" ")}
                        >
                          {col === 'todas' ? 'Todas' : col.charAt(0).toUpperCase() + col.slice(1)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selector por ID (ring estable y click OK) */}
                  <AgendaModelSelector
                    options={filteredModels}
                    value={selectedModelId}          // ← id
                    onChange={setSelectedModelId}    // ← id
                  />
                </div>

                {/* Pantalla completa del modelo seleccionado */}
                <FullscreenModelDialog
                  src={fsImage || selectedModelImage}
                  alt={product.name}
                  trigger={
                    <Button variant="outline" className="w-full">
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Ver en pantalla completa
                    </Button>
                  }
                />

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

              {/* Acciones */}
              <div className="space-y-4 w-full max-w-full">
                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al Carrito
                </Button>
                <WhatsAppButton message={whatsappMessage} className="w-full" />
              </div>

              

              {/* Inspirate */}
              <div id="inspirate" className="space-y-3 w-full max-w-full">
                <h3 className="font-semibold">Inspirate</h3>
                <div
                  className="
                    w-full max-w-full
                    flex flex-nowrap gap-3
                    overflow-x-auto overflow-y-hidden
                    snap-x snap-mandatory scroll-smooth
                    px-2 py-1
                    [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.400)_transparent]
                    [&::-webkit-scrollbar]:h-2
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-slate-400/60
                    hover:[&::-webkit-scrollbar-thumb]:bg-slate-500/70
                    [&::-webkit-scrollbar-thumb]:rounded-full
                  "
                  aria-label="Ejemplos de personalización"
                >
                  {[
                    '/img/ejs/nombre-foil-like.jpg',
                    '/img/ejs/frase-minimal.jpg',
                    '/img/ejs/foto-mascota.jpg',
                    '/img/ejs/trama-terrazzo.jpg',
                    '/img/ejs/logo-emprendimiento.jpg',
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="snap-center flex-none w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white"
                    >
                      <img src={src} alt={`Ejemplo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  ¿Tenés una foto o idea? Enviámela por WhatsApp y armamos el boceto.
                </p>
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
