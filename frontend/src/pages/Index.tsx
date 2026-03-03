import { useState, useCallback } from "react";
import { GameItem, PlacedItem } from "@/types/game";
import { sampleItems } from "@/data/sampleItems";
import ItemList from "@/components/game/ItemList";
import RatingBoard from "@/components/game/RatingBoard";

const SLOT_LIMITS: Record<number, number> = {
  0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3,
};

const Index = () => {
  const [availableItems, setAvailableItems] = useState<GameItem[]>(sampleItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  }, []);

  const handlePlaceItem = useCallback(
    (rating: number, slotIndex: number) => {
      if (!selectedItemId) return;

      const availableItem = availableItems.find((i) => i.id === selectedItemId);
      const placedItem = placedItems.find((i) => i.id === selectedItemId);
      
      if (!availableItem && !placedItem) return;

      const itemToPlace = availableItem || placedItem!;

      // ✅ Regra: Slots 0 e 10 (index 0) só aceitam se for o ÚLTIMO item TOTAL a ser colocado
      const isSpecialSlot0 = (rating === 0 || rating === 10) && slotIndex === 0;
      if (isSpecialSlot0) {
        if (availableItem && availableItems.length > 1) return;
        if (placedItem && availableItems.length > 0) return;
      }

      const slotLimit = SLOT_LIMITS[rating];

      // Prevent exceeding slot limit
      const ratingItems = placedItems.filter((i) => i.rating === rating);
      if (ratingItems.length >= slotLimit && (!placedItem || placedItem.rating !== rating)) {
        return;
      }

      // Prevent overwriting an occupied slot
      const slotOccupied = placedItems.some(
        (i) => i.rating === rating && i.slotIndex === slotIndex
      );
      if (slotOccupied) return;

      if (availableItem) {
        setPlacedItems((prev) => [
          ...prev,
          { ...availableItem, rating, slotIndex },
        ]);
        setAvailableItems((prev) =>
          prev.filter((i) => i.id !== selectedItemId)
        );
      } else {
        setPlacedItems((prev) =>
          prev.map((i) =>
            i.id === selectedItemId ? { ...i, rating, slotIndex } : i
          )
        );
      }

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
      
      // If the item being removed was selected, deselect it
      if (selectedItemId === itemId) {
        setSelectedItemId(null);
      }
    },
    [placedItems, selectedItemId]
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
        selectedItemId={selectedItemId}
        availableItemsCount={availableItems.length}
        onPlaceItem={handlePlaceItem}
        onRemoveItem={handleRemoveItem}
        onSelectItem={handleSelectItem}
      />
    </div>
  );
};

export default Index;
