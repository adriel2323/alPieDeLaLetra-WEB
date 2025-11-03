import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'default' | 'floating';
}

export const WhatsAppButton = ({ 
  message = 'Hola! Me gustaría consultar sobre los productos de Al Pie de la Letra',
  className,
  variant = 'default'
}: WhatsAppButtonProps) => {
  const phoneNumber = '5493364364774'; // Placeholder - user will update
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  if (variant === 'floating') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    );
  }

  return (
    <Button
      asChild
      variant="outline"
      className={className}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4" />
        Pedila por WhatsApp
      </a>
    </Button>
  );
};
