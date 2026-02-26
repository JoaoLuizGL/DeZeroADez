import { PlacedItem } from "@/types/game";
import { cn } from "@/lib/utils";
import { X, Star } from "lucide-react";

interface NumberSlotProps {
  rating: number;
  slots: number;
  placedItems: PlacedItem[];
  hasSelectedItem: boolean;
  onPlaceItem: (rating: number, slotIndex: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const NumberSlot = ({
  rating,
  slots,
  placedItems,
  hasSelectedItem,
  onPlaceItem,
  onRemoveItem,
}: NumberSlotProps) => {
  const isSpecial = rating === 0 || rating === 10;

  const renderSlot = (idx: number) => {
    const placed = placedItems[idx] ?? null;
    const isEmpty = !placed;
    const canReceive = hasSelectedItem && isEmpty;
    const isSecondaryArea = isSpecial && idx > 0;

    return (
      <div key={idx} className="relative">
        {isSpecial && idx === 1 && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-border/50 rounded-full" />
        )}

        <div
          onClick={() => {
            if (placed) {
              onRemoveItem(placed.id);
            } else if (canReceive) {
              onPlaceItem(rating, idx);
            }
          }}
          className={cn(
            "relative w-full aspect-square rounded-sm border transition-all duration-200 overflow-hidden group/slot",

            placed
              ? "border-border bg-secondary cursor-pointer hover:border-destructive"
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
                className="w-full h-full object-cover transition-opacity duration-200 group-hover/slot:opacity-40"
              />

              <div className="absolute inset-0 bg-background/70 opacity-0 group-hover/slot:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                <X className="w-5 h-5 text-destructive" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-1 py-1 min-h-[2.5vw] flex items-center">
                <span className="text-xs text-foreground w-full text-center leading-tight">
                  {placed.name}
                </span>
              </div>
            </>
          ) : (
            <>
              {isSpecial && idx === 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  {rating === 0 ? (
                    <X className="w-6 h-6 text-destructive" />
                  ) : (
                    <Star className="w-6 h-6 text-primary" />
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