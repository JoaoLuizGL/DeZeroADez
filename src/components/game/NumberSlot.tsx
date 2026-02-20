import { PlacedItem } from "@/types/game";
import { cn } from "@/lib/utils";
import { X, Star } from "lucide-react";

interface NumberSlotProps {
  rating: number;
  slots: number;
  placedItems: PlacedItem[];
  hasSelectedItem: boolean;
  onPlaceItem: (rating: number) => void;
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
  const availableSlots = slots - placedItems.length;
  const canPlace = hasSelectedItem && availableSlots > 0;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Number header */}
      <button
        onClick={() => canPlace && onPlaceItem(rating)}
        disabled={!canPlace}
        className={cn(
          "font-display text-3xl w-full text-center py-1 rounded-t-md transition-all border-b-2",
          isSpecial
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-secondary text-foreground border-border",
          canPlace && "cursor-pointer hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_20px_hsl(var(--selected-glow)/0.3)]",
          !canPlace && "cursor-default"
        )}
      >
        {rating}
      </button>

      {/* Slots */}
      <div className="flex flex-col gap-1 w-full">
        {Array.from({ length: slots }).map((_, idx) => {
          const placed = placedItems[idx];
          return (
            <div
              key={idx}
              onClick={() => {
                if (placed) onRemoveItem(placed.id);
                else if (canPlace) onPlaceItem(rating);
              }}
              className={cn(
                "relative w-full aspect-square rounded-sm border transition-all duration-200 overflow-hidden",
                placed
                  ? "border-border bg-secondary cursor-pointer hover:border-destructive group"
                  : canPlace
                    ? "border-dashed border-gold-dim bg-slot-bg cursor-pointer hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_12px_hsl(var(--selected-glow)/0.15)]"
                    : "border-border/30 bg-slot-bg"
              )}
            >
              {placed ? (
                <>
                  <img src={placed.imageUrl} alt={placed.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <X className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-0.5 py-0.5">
                    <span className="text-[8px] text-foreground line-clamp-1">{placed.name}</span>
                  </div>
                </>
              ) : (
                isSpecial && idx === 0 && (
                  <div className="w-full h-full flex items-center justify-center">
                    {rating === 0 ? (
                      <X className="w-6 h-6 text-destructive/40" />
                    ) : (
                      <Star className="w-6 h-6 text-primary/40" />
                    )}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NumberSlot;
