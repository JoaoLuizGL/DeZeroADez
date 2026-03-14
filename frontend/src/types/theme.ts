export interface Theme {
  _id?: string;
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  creator?: string;
  items: ThemeItem[];
}

export interface ThemeItem {
  _id?: string;
  id: string;
  name: string;
  imageUrl: string;
}

export interface PlacedItem extends ThemeItem {
  rating: number;
  slotIndex: number;
}
