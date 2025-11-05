// src/components/product/ProductImageGallery.tsx
import { useState, useId, useRef, useEffect } from "react";
import { Maximize2 } from "lucide-react";
import clsx from "clsx";

type Props = {
  images: string[];
  altBase?: string;               // ej: product.name
  className?: string;
  onOpenFullscreen?: (src: string) => void; // opcional, para tu FullscreenModelDialog
};

export default function ProductImageGallery({
  images,
  altBase = "Imagen de producto",
  className,
  onOpenFullscreen,
}: Props) {
  const [index, setIndex] = useState(0);
  const groupId = useId();
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Asegurar índice válido si cambian las imágenes
  useEffect(() => {
    if (index > images.length - 1) setIndex(0);
  }, [images, index]);

  const select = (i: number) => setIndex(i);

  const onKeyDownThumbs = (e: React.KeyboardEvent) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1;
    const next = (index + dir + images.length) % images.length;
    setIndex(next);
    thumbRefs.current[next]?.focus();
  };

  return (
    <section
      className={clsx("grid gap-4 lg:grid-cols-[96px,1fr]", className)}
      aria-roledescription="gallery"
      aria-label="Galería de imágenes del producto"
    >
      {/* Thumbs - vertical en desktop / horizontal en mobile */}
      <div className="order-2 lg:order-1">
        {/* mobile: fila con scroll-x */}
        <div className="flex lg:hidden flex-nowrap overflow-x-auto gap-2
                        snap-x snap-mandatory scroll-smooth
                        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
             role="listbox"
             aria-label="Miniaturas"
             aria-activedescendant={`${groupId}-thumb-${index}`}
             onKeyDown={onKeyDownThumbs}
        >
          {images.map((src, i) => {
            const selected = i === index;
            return (
              <button
                key={i}
                ref={el => (thumbRefs.current[i] = el)}
                id={`${groupId}-thumb-${i}`}
                role="option"
                aria-selected={selected}
                className={clsx(
                  "snap-center flex-none w-20 h-20 rounded-lg overflow-hidden ring-1 ring-muted-foreground/20",
                  selected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-muted-foreground/40"
                )}
                onClick={() => select(i)}
              >
                <img src={src} alt={`${altBase} miniatura ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>

        {/* desktop: columna con scroll-y */}
        <div
          className="hidden lg:flex lg:flex-col gap-2 lg:max-h-[540px] overflow-y-auto
                     snap-y snap-mandatory
                     [scrollbar-width:thin]"
          role="listbox"
          aria-label="Miniaturas"
          aria-activedescendant={`${groupId}-thumb-${index}`}
          onKeyDown={onKeyDownThumbs}
        >
          {images.map((src, i) => {
            const selected = i === index;
            return (
              <button
                key={i}
                ref={el => (thumbRefs.current[i] = el)}
                id={`${groupId}-thumb-${i}`}
                role="option"
                aria-selected={selected}
                className={clsx(
                  "snap-start w-full aspect-square rounded-lg overflow-hidden ring-1 ring-muted-foreground/20",
                  selected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-muted-foreground/40"
                )}
                onClick={() => select(i)}
              >
                <img src={src} alt={`${altBase} miniatura ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Imagen principal */}
      <div className="order-1 lg:order-2 relative">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
          <img
            src={images[index]}
            alt={`${altBase} ${index + 1} de ${images.length}`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* botón fullscreen opcional */}
        {onOpenFullscreen && (
          <button
            className="absolute top-2 right-2 rounded-md bg-white/90 px-2 py-1 text-sm shadow hover:bg-white"
            aria-label="Ver en pantalla completa"
            onClick={() => onOpenFullscreen(images[index])}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
}
