import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import vars from '@/data/data';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotalPrice();
  const formattedTotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(total);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container px-4 text-center space-y-6">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
            <h1 className="text-4xl font-bold">No hay productos en el carrito</h1>
            <Button asChild size="lg">
              <Link to="/catalogo">Ir al Catálogo</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const data = {
    nombre: (form.querySelector("#firstName") as HTMLInputElement)?.value || "",
    apellido: (form.querySelector("#lastName") as HTMLInputElement)?.value || "",
    email: (form.querySelector("#email") as HTMLInputElement)?.value || "",
    telefono: (form.querySelector("#phone") as HTMLInputElement)?.value || "",
    direccion: (form.querySelector("#address") as HTMLInputElement)?.value || "",
    ciudad: (form.querySelector("#city") as HTMLInputElement)?.value || "",
    provincia: (form.querySelector("#province") as HTMLInputElement)?.value || "",
    codigoPostal: (form.querySelector("#postalCode") as HTMLInputElement)?.value || "",
  };

  // 🧾 Construir detalle de los productos
  const detalleProductos = items
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      const formattedPrice = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
      }).format(itemTotal);
      return `• ${item.product.name} (${item.selectedSize || ""}) x${item.quantity} — ${formattedPrice}${
        item.personalization ? `\n   🖋️ Personalización: "${item.personalization}"` : ""
      }`;
    })
    .join("\n");

  // 💬 Armar mensaje de WhatsApp
  const mensaje = `
🛍️ *Nuevo pedido desde la tienda online*

👤 *Datos del comprador:*
Nombre: ${data.nombre} ${data.apellido}
Email: ${data.email}
Teléfono: ${data.telefono}

📦 *Envío:*
Dirección: ${data.direccion}
Ciudad: ${data.ciudad}
Provincia: ${data.provincia}
Código Postal: ${data.codigoPostal}

🧾 *Detalle del pedido:*
${detalleProductos}

💰 *Total:* ${formattedTotal}

🚚 Método de envío: A coordinar
💳 Método de pago: Mercado Pago o Transferencia
`;

  // 📲 Número de WhatsApp de destino (sin + ni espacios)
  const numero = vars.phoneNumber // ← poné acá tu número
  console.log("Número de WhatsApp:", numero);

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
  clearCart();
  setIsProcessing(true);
  toast.success("Redirigiendo a WhatsApp...");
  setTimeout(() => {
    setIsProcessing(false);
    navigate("/");
  }, 3000);
};


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Información de Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre *</Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido *</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Información de Envío
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección *</Label>
                      <Input id="address" required />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad *</Label>
                        <Input id="city" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Provincia *</Label>
                        <Input id="province" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código Postal *</Label>
                      <Input id="postalCode" required />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Note */}
                <Card className="bg-soft/50 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium mb-2">💳 Medios de Pago</p>
                    <p className="text-sm text-muted-foreground">
                      En el siguiente paso podrás pagar con Mercado Pago (tarjetas de débito, crédito, efectivo) o transferencia bancaria.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {items.map((item) => {
                        const itemTotal = item.price * item.quantity;
                        const formattedPrice = new Intl.NumberFormat('es-AR', {
                          style: 'currency',
                          currency: 'ARS',
                          minimumFractionDigits: 0,
                        }).format(itemTotal);

                        return (
                          <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3">
                            <div className="w-16 h-16 rounded bg-muted overflow-hidden shrink-0">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 text-sm">
                              <p className="font-medium line-clamp-1">{item.product.name}</p>
                              {item.personalization && (
                                <p className="text-xs text-primary">"{item.personalization}"</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {item.selectedSize} • Cant: {item.quantity}
                              </p>
                              <p className="font-medium mt-1">{formattedPrice}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formattedTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Envío</span>
                        <span>A calcular</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">{formattedTotal}</span>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                      {isProcessing ? 'Procesando...' : 'Continuar al Pago'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Al continuar, aceptás nuestros términos y condiciones
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
