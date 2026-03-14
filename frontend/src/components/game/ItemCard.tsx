import { useState, useEffect } from "react";
import { ThemeItem } from "@/types/theme";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ItemCardProps {
  item: ThemeItem;
  isSelected: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}

const ItemCard = ({ item, isSelected, onClick, size = "md" }: ItemCardProps) => {
  const sizeClasses = (size === "sm" ? "size-24" : "size-40") + " w-fit";
  const [displayUrl, setDisplayUrl] = useState(item.imageUrl);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the URL is a MongoDB ObjectId (24 hex characters)
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(item.imageUrl);
    
    if (isMongoId) {
      const fetchImage = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/images/${item.imageUrl}`);
          if (response.ok) {
            const data = await response.json();
            setDisplayUrl(data.data);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchImage();
    } else {
      setDisplayUrl(item.imageUrl);
    }
  }, [item.imageUrl]);

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
