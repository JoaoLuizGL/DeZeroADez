import { PlacedItem } from "@/types/game";
import NumberSlot from "./NumberSlot";

interface RatingBoardProps {
  placedItems: PlacedItem[];
  hasSelectedItem: boolean;
  onPlaceItem: (rating: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const RATING_CONFIG: { rating: number; slots: number }[] = [
  { rating: 0, slots: 1 },
  { rating: 1, slots: 3 },
  { rating: 2, slots: 3 },
  { rating: 3, slots: 3 },
  { rating: 4, slots: 3 },
  { rating: 5, slots: 3 },
  { rating: 6, slots: 3 },
  { rating: 7, slots: 3 },
  { rating: 8, slots: 3 },
  { rating: 9, slots: 3 },
  { rating: 10, slots: 1 },
];

const RatingBoard = ({ placedItems, hasSelectedItem, onPlaceItem, onRemoveItem }: RatingBoardProps) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-2xl text-primary tracking-wide">DE SOLA A DEZ</h2>
        {hasSelectedItem && (
          <span className="text-xs text-accent animate-pulse">
            Clique em um número para classificar
          </span>
        )}
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <div className="grid grid-cols-11 gap-2 h-full min-w-[700px]">
          {RATING_CONFIG.map(({ rating, slots }) => (
            <NumberSlot
              key={rating}
              rating={rating}
              slots={slots}
              placedItems={placedItems.filter((i) => i.rating === rating)}
              hasSelectedItem={hasSelectedItem}
              onPlaceItem={onPlaceItem}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingBoard;
