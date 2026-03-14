import { PlacedItem } from "@/types/theme";
import { cn } from "@/lib/utils";
import { X, Star } from "lucide-react";

interface NumberSlotProps {
  rating: number;
  slots: number;
  placedItems: PlacedItem[];
  selectedItemId: string | null;
  availableItemsCount: number;
  onPlaceItem: (rating: number, slotIndex: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSelectItem: (id: string) => void;
}

const NumberSlot = ({
  rating,
  slots,
  placedItems,
  selectedItemId,
  availableItemsCount,
  onPlaceItem,
  onRemoveItem,
  onSelectItem,
}: NumberSlotProps) => {
  const isSpecial = rating === 0 || rating === 10;
  const hasSelectedItem = selectedItemId !== null;

  const renderSlot = (idx: number) => {
    const placed = placedItems[idx] ?? null;
    const isSelected = placed && selectedItemId === placed.id;
    const isEmpty = !placed;
    
    // ✅ Regra: Slots 0 e 10 (index 0) só aceitam se for o último item da lista
    const isSpecialSlot0 = isSpecial && idx === 0;
    
    // Se estivermos movendo um item já colocado, ele "conta" como disponível.
    // Mas a lógica de Index.tsx já cuida disso. Aqui apenas visualmente mostramos bloqueado.
    const isLockedByRule = isSpecialSlot0 && availableItemsCount > 1;
    
    const canReceive = hasSelectedItem && isEmpty && !isLockedByRule;
    const isSecondaryArea = isSpecial && idx > 0;

    return (
      <div key={idx} className="relative">
        {isSpecial && idx === 1 && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-border/50 rounded-full" />
        )}

        <div
          onClick={() => {
            if (placed) {
              if (isSelected) {
                onRemoveItem(placed.id);
              } else {
                onSelectItem(placed.id);
              }
            } else if (canReceive) {
              onPlaceItem(rating, idx);
            }
          }}
          className={cn(
            "relative w-full aspect-square rounded-sm border transition-all duration-300 overflow-hidden group/slot",

            placed
              ? cn(
                  "bg-secondary cursor-pointer",
                  isSelected
                    ? "border-accent ring-2 ring-accent scale-105 z-20 shadow-[0_0_20px_hsl(var(--selected-glow)/0.5)]"
                    : "border-border hover:scale-110 hover:border-accent hover:shadow-[0_0_15px_hsl(var(--selected-glow)/0.4)] hover:z-30"
                )
              : canReceive
              ? cn(
                  "border-dashed cursor-pointer",
                  // Accent hover ONLY when item is selected
                  hasSelectedItem &&
                    "hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_12px_hsl(var(--selected-glow)/0.15)]",
                  isSecondaryArea
                    ? "border-primary/40 bg-primary/5"
                    : "border-gold-dim bg-slot-bg"
                )
              : cn(
                  "border-border/30",
                  isLockedByRule && "opacity-40 cursor-not-allowed grayscale-[0.5]",
                  isSecondaryArea
                    ? "bg-primary/5"
                    : "bg-slot-bg"
                )
          )}
        >
          {placed ? (
            <>
              <img
                src={placed.imageUrl}
                alt={placed.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-300",
                  isSelected && "group-hover/slot:scale-95"
                )}
              />

              <div className={cn(
                "absolute bottom-0 left-0 right-0 px-1 py-1 min-h-[2.5vw] flex items-center transition-colors duration-200",
                isSelected ? "bg-accent/90" : "bg-background/90"
              )}>
                <span className={cn(
                  "text-[10px] sm:text-xs w-full text-center leading-tight font-medium transition-colors duration-200",
                  isSelected ? "text-accent-foreground" : "text-foreground group-hover/slot:text-accent"
                )}>
                  {placed.name}
                </span>
              </div>

              {isSelected && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/slot:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                  <X className="w-10 h-10 text-white drop-shadow-md" />
                </div>
              )}
            </>
          ) : (
            <>
              {isSpecialSlot0 && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  {rating === 0 ? (
                    <X className={cn("w-6 h-6", isLockedByRule ? "text-muted-foreground" : "text-destructive")} />
                  ) : (
                    <Star className={cn("w-6 h-6", isLockedByRule ? "text-muted-foreground" : "text-primary")} />
                  )}
                  {isLockedByRule && (
                    <span className="text-[8px] uppercase font-bold text-muted-foreground">Bloqueado</span>
                  )}
                </div>
              )}

              {isSecondaryArea && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase tracking-wide text-primary/50 text-center px-1">
                    Segura para {rating}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-1 group">
      <button
        disabled={!hasSelectedItem}
        className={cn(
          "font-display text-3xl w-full text-center py-1 rounded-t-md border-b-2 transition-all duration-200",
          isSpecial
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-secondary text-foreground border-border",

          // ✅ group-hover accent ONLY if item selected
          hasSelectedItem &&
            "group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent group-hover:shadow-[0_0_20px_hsl(var(--selected-glow)/0.3)]"
        )}
      >
        {rating}
      </button>

      <div className="flex flex-col gap-1 w-full">
        {Array.from({ length: slots }).map((_, idx) =>
          renderSlot(idx)
        )}
      </div>
    </div>
  );
};

export default NumberSlot;