import { ThemeItem } from "@/types/theme";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useImageProxy } from "@/hooks/useImageProxy";

interface ItemCardProps {
  item: ThemeItem;
  isSelected: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}

const ItemCard = ({ item, isSelected, onClick, size = "md" }: ItemCardProps) => {
  const sizeClasses = (size === "sm" ? "h-24" : "h-40") + " w-full";
  const { displayUrl, loading } = useImageProxy(item.imageUrl);

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center rounded-md transition-all duration-200 cursor-pointer group ring-1 ring-gold-dim",
        sizeClasses,
        isSelected
          ? "ring-2 ring-accent scale-105 shadow-[0_0_15px_hsl(var(--selected-glow)/0.4)]"
          : "hover:scale-105"
      )}
    >
      <div className={cn(
        "w-full flex-1 rounded-md overflow-hidden bg-secondary border border-border/50 relative",
        isSelected && "border-accent"
      )}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : (
          <img
            src={displayUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <span className={cn(
        "text-lg font-bold leading-tight text-center line-clamp-2 w-full px-1 py-0.5 rounded-sm transition-colors duration-200",
        isSelected 
          ? "bg-accent text-accent-foreground" 
          : "text-foreground group-hover:text-accent"
      )}>
        {item.name}
      </span>
    </button>
  );
};

export default ItemCard;
