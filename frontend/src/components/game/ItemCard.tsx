import { GameItem } from "@/types/game";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: GameItem;
  isSelected: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}

const ItemCard = ({ item, isSelected, onClick, size = "md" }: ItemCardProps) => {
  const sizeClasses = size === "sm" ? "w-20 h-20" : "w-24 h-24";

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-md transition-all duration-200 cursor-pointer group",
        sizeClasses,
        isSelected
          ? "ring-2 ring-accent scale-105 shadow-[0_0_15px_hsl(var(--selected-glow)/0.4)]"
          : "hover:ring-1 hover:ring-gold-dim hover:scale-105"
      )}
    >
      <div className={cn(
        "w-full flex-1 rounded-md overflow-hidden bg-secondary border border-border/50",
        isSelected && "border-accent"
      )}>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-[10px] font-medium text-foreground leading-tight text-center line-clamp-2 w-full px-0.5">
        {item.name}
      </span>
    </button>
  );
};

export default ItemCard;
