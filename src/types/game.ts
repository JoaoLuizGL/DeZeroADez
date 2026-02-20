export interface GameItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface PlacedItem extends GameItem {
  rating: number;
  slotIndex: number;
}
