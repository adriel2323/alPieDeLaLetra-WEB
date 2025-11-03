// src/components/product/AgendaModelSelector.tsx
import { useId, useRef, useEffect, useCallback, useState } from "react";
import clsx from "clsx";

export type AgendaModelOption = {
  id: string;
  image: string;   // URL de la miniatura
  modelo: string;  // ej: "semanal", "dos-dias", "universitaria", etc.
};

type Props = {
  label?: string;
  options: AgendaModelOption[];
  value?: string | null; // modelo seleccionado
  onChange?: (modelo: string) => void;
  className?: string;
};

export function AgendaModelSelector({
  label = "Modelo de agenda",
  options,
  value,
  onChange,
  className,
}: Props) {
  const groupId = useId();
  const [internal, setInternal] = useState<string | null>(value ?? null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Mantener controlado/semicontrolado
  useEffect(() => {
    if (typeof value !== "undefined") setInternal(value);
  }, [value]);

  const setSelected = useCallback(
    (modelo: string) => {
      if (typeof value === "undefined") setInternal(modelo);
      onChange?.(modelo);
    },
    [onChange, value]
  );

  // Navegación con flechas (ARIA radios)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = options.findIndex(o => (internal ?? "") === o.modelo);
    const focusAt = (idx: number) => refs.current[idx]?.focus();

    if (["ArrowRight", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const next = (currentIndex + 1 + options.length) % options.length;
      setSelected(options[next].modelo);
      focusAt(next);
    } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      const prev = (currentIndex - 1 + options.length) % options.length;
      setSelected(options[prev].modelo);
      focusAt(prev);
    }
  };

  return (
    <div className={clsx("space-y-2", className)}>
      <span className="block text-sm font-medium">{label}</span>

      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 gap-3"
        onKeyDown={handleKeyDown}
      >
        {options.map((opt, idx) => {
          const checked = internal === opt.modelo;
          return (
            <button
              key={opt.id}
              ref={el => (refs.current[idx] = el)}
              role="radio"
              aria-checked={checked}
              aria-label={opt.modelo}
              onClick={() => setSelected(opt.modelo)}
              className={clsx(
                "relative aspect-square w-full rounded-xl overflow-hidden",
                "ring-1 ring-muted-foreground/20",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                checked
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:ring-2 hover:ring-muted-foreground/40"
              )}
              tabIndex={checked || (internal == null && idx === 0) ? 0 : -1}
            >
              <img
                src={opt.image}
                alt={`Modelo ${opt.modelo}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* Check visual */}
              {checked && (
                <span className="absolute inset-0 pointer-events-none bg-black/0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Radios reales invisibles para formularios si los necesitás */}
      <fieldset className="sr-only" aria-hidden="true">
        <legend id={groupId}>{label}</legend>
        {options.map(opt => (
          <label key={opt.id}>
            <input
              type="radio"
              name="agenda-modelo"
              value={opt.modelo}
              checked={(internal ?? "") === opt.modelo}
              onChange={() => setSelected(opt.modelo)}
            />
            {opt.modelo}
          </label>
        ))}
      </fieldset>
    </div>
  );
}
