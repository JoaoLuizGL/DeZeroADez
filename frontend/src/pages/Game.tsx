import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeItem, PlacedItem, Theme } from "@/types/theme";
import ItemList from "@/components/game/ItemList";
import RatingBoard from "@/components/game/RatingBoard";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLOT_LIMITS: Record<number, number> = {
  0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3,
};

const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [currentGame, setCurrentGame] = useState<Theme | null>(null);
  const [availableItems, setAvailableItems] = useState<ThemeItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:5000/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Game not found");
          }
          throw new Error("Failed to fetch game");
        }
        const data = await response.json() as Theme & { _id: string };
        const mappedGame = {
          ...data,
          id: data._id || data.id
        };
        setCurrentGame(mappedGame);
        setAvailableItems(mappedGame.items);
      } catch (err) {
        console.error("Error fetching game:", err);
        setError(err instanceof Error ? err.message : "Could not load the game.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading game...</p>
      </div>
    );
  }

  if (error || !currentGame) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-4 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
        <p className="text-muted-foreground mb-6">{error || "Something went wrong"}</p>
        <Button onClick={() => navigate("/")}>Back to Themes</Button>
      </div>
    );
  }

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
        gameName={currentGame.name}
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

export default GamePage;
