import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

const BackButton = ({ to = "/", label = "Voltar", className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1 px-0 hover:bg-transparent text-muted-foreground hover:text-primary transition-colors ${className}`}
      onClick={() => navigate(to)}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </Button>
  );
};

export default BackButton;
