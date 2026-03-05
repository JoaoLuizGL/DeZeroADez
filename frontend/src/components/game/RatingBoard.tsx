import { PlacedItem } from "@/types/game";
import NumberSlot from "./NumberSlot";

interface RatingBoardProps {
  gameName: string;
  placedItems: PlacedItem[];
  selectedItemId: string | null;
  availableItemsCount: number;
  onPlaceItem: (rating: number, slotIndex: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSelectItem: (id: string) => void;
}

const RATING_CONFIG: { rating: number; slots: number }[] = [
  { rating: 0, slots: 3 },
  { rating: 1, slots: 3 },
  { rating: 2, slots: 3 },
  { rating: 3, slots: 3 },
  { rating: 4, slots: 3 },
  { rating: 5, slots: 3 },
  { rating: 6, slots: 3 },
  { rating: 7, slots: 3 },
  { rating: 8, slots: 3 },
  { rating: 9, slots: 3 },
  { rating: 10, slots: 3 },
];

const RatingBoard = ({
  gameName,
  placedItems,
  selectedItemId,
  availableItemsCount,
  onPlaceItem,
  onRemoveItem,
  onSelectItem,
}: RatingBoardProps) => {
  const hasSelectedItem = selectedItemId !== null;
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex-1">
          <h2 className="font-display text-2xl text-primary tracking-wide whitespace-nowrap">
            DE ZERO A DEZ
          </h2>
        </div>
        
        <div className="flex-shrink-0">
          <h3 className="font-display text-lg tracking-wide whitespace-nowrap">
            {gameName}
          </h3>
        </div>

        <div className="flex-1 flex justify-end">
          {hasSelectedItem && (
            <span className="text-xs text-accent animate-pulse text-right">
              Clique em um espaço para classificar
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <div className="grid grid-cols-11 gap-2 h-full min-w-[700px]">
          {RATING_CONFIG.map(({ rating, slots }) => {
            // Create fixed-length slot array
            const ratingItems = Array.from({ length: slots }).map(
              (_, index) =>
                placedItems.find(
                  (item) =>
                    item.rating === rating &&
                    item.slotIndex === index
                ) ?? null
            );

            return (
              <NumberSlot
                key={rating}
                rating={rating}
                slots={slots}
                placedItems={ratingItems}
                selectedItemId={selectedItemId}
                availableItemsCount={availableItemsCount}
                onPlaceItem={onPlaceItem}
                onRemoveItem={onRemoveItem}
                onSelectItem={onSelectItem}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingBoard;