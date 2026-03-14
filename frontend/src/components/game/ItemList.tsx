import { ThemeItem } from "@/types/theme";
import ItemCard from "./ItemCard";
import BackButton from "../BackButton";

interface ItemListProps {
  items: ThemeItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
}

const ItemList = ({ items, selectedItemId, onSelectItem }: ItemListProps) => {
  return (
    <div className="flex flex-col h-full w-[12.5vw] bg-card border-r-2 border-border">
      <div className="px-3 py-1 border-b border-border">
        <BackButton />
      </div>
      <div className="p-3 border-b border-border">
        <h2 className="font-display text-2xl text-primary tracking-wide">ITENS</h2>
        <p className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "itens"} disponíveis
        </p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-3">
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onClick={() => onSelectItem(item.id)}
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
