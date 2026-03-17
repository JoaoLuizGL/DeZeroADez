import { ThemeItem } from "@/types/theme";
import ItemCard from "./ItemCard";
import BackButton from "../BackButton";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ItemListProps {
  items: ThemeItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onRemoveItem: (itemId: string) => void;
  isPlacedItemSelected: boolean;
}

const ItemList = ({ 
  items, 
  selectedItemId, 
  onSelectItem, 
  onRemoveItem, 
  isPlacedItemSelected 
}: ItemListProps) => {
  if (isPlacedItemSelected && selectedItemId) {
    return (
      <button
        onClick={() => onRemoveItem(selectedItemId)}
        className="flex flex-col h-full w-[12.5vw] bg-[#0f0202] border-r-2 border-red-950/30 transition-all duration-300 items-center justify-center gap-4 group hover:bg-[#1a0505]"
      >
        <div className="bg-red-950/40 p-6 rounded-full group-hover:bg-red-950/60 transition-colors border border-red-900/10">
          <X className="w-16 h-16 text-red-100/60 group-hover:text-red-100/80" />
        </div>
        <span className="text-red-100/40 font-bold text-lg text-center px-4 uppercase tracking-wider transition-colors group-hover:text-red-100/60">
          Devolver para a lista
        </span>
      </button>
    );
  }

  return (
    <div 
      className={cn(
        "flex flex-col h-full w-[12.5vw] bg-card border-r-2 border-border transition-all duration-300"
      )}
    >
      <div className="px-3 py-1 border-b border-border">
        <BackButton />
      </div>
      <div className="p-3 border-b border-border">
        <h2 className="font-display text-2xl text-primary tracking-wide">ITENS</h2>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "itens"} disponíveis
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-3">
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onClick={() => {
                onSelectItem(item.id);
              }}
            />
          ))}
        </div>
        {items.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Todos os itens foram classificados!
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;
