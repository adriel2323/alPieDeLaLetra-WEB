import { useState, useId, useRef, useEffect } from "react";
import { Maximize2 } from "lucide-react";
import clsx from "clsx";

type Props = {
  images: string[];
  altBase?: string;
  className?: string;
  onOpenFullscreen?: (src: string) => void;
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

  useEffect(() => {
    if (index > images.length - 1) setIndex(0);
  }, [images, index]);

  const select = (i: number) => setIndex(i);

  const onKeyDownThumbs = (e: React.KeyboardEvent) => {
    if (!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1;
    const next = (index + dir + images.length) % images.length;
    setIndex(next);
    thumbRefs.current[next]?.focus();
  };

  return (
    <section
      className={clsx(
        // Mobile-first: que nunca se pase del ancho
        "w-full max-w-full min-w-0",
        // Grid: en desktop deja columna para thumbs
        "grid gap-4 lg:grid-cols-[100px,1fr]",
        className
      )}
      aria-roledescription="gallery"
      aria-label="Galería de imágenes del producto"
    >
      {/* Thumbs */}
      <div className="order-2 lg:order-1 min-w-0">
        {/* Mobile: fila con scroll-x (sin márgenes negativos) */}
        <div
          className="
            flex lg:hidden flex-nowrap gap-3
            overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory scroll-smooth
            py-1 px-2
            [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.400)_transparent]
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-slate-400/60
            hover:[&::-webkit-scrollbar-thumb]:bg-slate-500/70
            [&::-webkit-scrollbar-thumb]:rounded-full
          "
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
                ref={(el) => (thumbRefs.current[i] = el)}
                id={`${groupId}-thumb-${i}`}
                role="option"
                aria-selected={selected}
                className={clsx(
                  "snap-center flex-none w-20 h-20 rounded-xl overflow-hidden ring-1 ring-slate-300/50 bg-white shadow-sm",
                  selected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-slate-400/60"
                )}
                onClick={() => select(i)}
              >
                <img
                  src={src}
                  alt={`${altBase} miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>

        {/* Desktop: columna con scroll-y */}
        <div
          className="
            hidden lg:flex lg:flex-col gap-3
            lg:max-h-[70svh] xl:max-h-[75svh] min-h-0
            overflow-y-auto pr-1
            snap-y snap-mandatory
            [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.400)_transparent]
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-slate-400/60
            hover:[&::-webkit-scrollbar-thumb]:bg-slate-500/70
            [&::-webkit-scrollbar-thumb]:rounded-full
          "
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
                ref={(el) => (thumbRefs.current[i] = el)}
                id={`${groupId}-thumb-${i}`}
                role="option"
                aria-selected={selected}
                className={clsx(
                  "snap-start w-full aspect-square rounded-xl overflow-hidden ring-1 ring-slate-300/50 bg-white shadow-sm",
                  selected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-slate-400/60"
                )}
                onClick={() => select(i)}
              >
                <img
                  src={src}
                  alt={`${altBase} miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Imagen principal */}
      <div className="order-1 lg:order-2 relative min-w-0">
        <div
          className="
            w-full max-w-full h-auto mx-auto
            rounded-2xl bg-muted/60 ring-1 ring-slate-200 overflow-hidden
            flex items-center justify-center
            p-3 sm:p-4
            /* Alto máximo seguro en mobile, sin recortar */
            max-h-[70svh] sm:max-h-[75svh] md:max-h-[80svh]
          "
        >
          <img
            src={images[index]}
            alt={`${altBase} ${index + 1} de ${images.length}`}
            className="max-w-full max-h-full object-contain select-none"
          />
        </div>

        {/* botón fullscreen opcional */}
        {onOpenFullscreen && (
          <button
            className="
              absolute top-2 right-2
              inline-flex items-center justify-center
              rounded-md bg-white/90 px-2 py-1 text-sm shadow hover:bg-white
              ring-1 ring-slate-200
            "
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
