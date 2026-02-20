import { useState, useCallback } from "react";
import { GameItem, PlacedItem } from "@/types/game";
import { sampleItems } from "@/data/sampleItems";
import ItemList from "@/components/game/ItemList";
import RatingBoard from "@/components/game/RatingBoard";

const SLOT_LIMITS: Record<number, number> = {
  0: 1, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 1,
};

const Index = () => {
  const [availableItems, setAvailableItems] = useState<GameItem[]>(sampleItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  }, []);

  const handlePlaceItem = useCallback(
    (rating: number) => {
      if (!selectedItemId) return;
      const item = availableItems.find((i) => i.id === selectedItemId);
      if (!item) return;

      const currentCount = placedItems.filter((i) => i.rating === rating).length;
      if (currentCount >= SLOT_LIMITS[rating]) return;

      setPlacedItems((prev) => [...prev, { ...item, rating, slotIndex: currentCount }]);
      setAvailableItems((prev) => prev.filter((i) => i.id !== selectedItemId));
      setSelectedItemId(null);
    },
    [selectedItemId, availableItems, placedItems]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      const item = placedItems.find((i) => i.id === itemId);
      if (!item) return;
      setPlacedItems((prev) => prev.filter((i) => i.id !== itemId));
      setAvailableItems((prev) => [...prev, { id: item.id, name: item.name, imageUrl: item.imageUrl }]);
    },
    [placedItems]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0">
        <ItemList
          items={availableItems}
          selectedItemId={selectedItemId}
          onSelectItem={handleSelectItem}
        />
      </div>

      {/* Main board */}
      <RatingBoard
        placedItems={placedItems}
        hasSelectedItem={selectedItemId !== null}
        onPlaceItem={handlePlaceItem}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Index;
