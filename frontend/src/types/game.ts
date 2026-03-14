export interface Game {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  creator?: string;
  items: GameItem[];
}

export interface GameItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface PlacedItem extends GameItem {
  rating: number;
  slotIndex: number;
}
