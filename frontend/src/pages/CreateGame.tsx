import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import BackButton from "@/components/BackButton";
import { GameItem } from "@/types/game";
import { cn } from "@/lib/utils";

const CreateGame = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GameItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<GameItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const MAX_ITEMS = 29;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingItem(null);
    setNewItemName("");
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (item: GameItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setImagePreview(item.imageUrl !== "/placeholder.svg" ? item.imageUrl : null);
    setIsDialogOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newItemName.trim()) return;

    const imageUrl = imagePreview || "/placeholder.svg";

    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id ? { ...item, name: newItemName.trim(), imageUrl } : item
      ));
    } else if (items.length < MAX_ITEMS) {
      // Add new item
      const newItem: GameItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: newItemName.trim(),
        imageUrl,
      };
      setItems([...items, newItem]);
    }
    
    setNewItemName("");
    setImagePreview(null);
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleRemoveItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening the edit dialog
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Please add at least one item to the game.");
      return;
    }
    // Logic to save the game will be implemented later
    console.log("Saving new game with items:", items);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Dialog placed outside the main form to prevent nested form submission issues */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingItem(null);
          setNewItemName("");
          setImagePreview(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Item" : `Add New Item (${items.length + 1}/${MAX_ITEMS})`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveItem} className="space-y-6 pt-4">
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-32 h-32 rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group bg-secondary/50 flex flex-col items-center justify-center gap-2"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">Upload Image</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              <p className="text-[10px] text-muted-foreground text-center">
                Recommended: Square image (1:1)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input 
                id="item-name" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., TypeScript, React, etc..." 
                autoFocus
                maxLength={40}
              />
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!newItemName.trim() || (!editingItem && items.length >= MAX_ITEMS)}>
                {editingItem ? "Save Changes" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="max-w-2xl mx-auto">
        <BackButton />
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Create New Game</h1>
          <p className="text-xl text-muted-foreground">
            Define your theme and items to start rating.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Game Details</CardTitle>
            <CardDescription>Enter the basic information for your new rating game.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Game Name</Label>
                <Input id="name" placeholder="e.g., Best Programming Languages" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what people will be rating..." 
                  className="min-h-[100px]"
                  required
                />
              </div>

              {/* Items Section */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Game Items</Label>
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    items.length >= MAX_ITEMS ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {items.length}/{MAX_ITEMS} items added
                  </span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {/* Add Item Trigger Button */}
                  <button 
                    type="button"
                    disabled={items.length >= MAX_ITEMS}
                    onClick={handleOpenAddDialog}
                    className={cn(
                      "group transition-all duration-200 cursor-pointer flex flex-col items-center justify-center aspect-square text-center rounded-md border-none shadow-md",
                      items.length >= MAX_ITEMS 
                        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
                        : "bg-primary text-primary-foreground hover:scale-[1.05] active:scale-95"
                    )}
                  >
                    <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                      {items.length >= MAX_ITEMS ? "Limit Reached" : "New Item"}
                    </span>
                  </button>

                  {/* Existing Items */}
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => handleOpenEditDialog(item)}
                      className="group relative aspect-square rounded-md overflow-hidden border bg-secondary flex flex-col shadow-sm transition-all hover:border-primary/50 cursor-pointer hover:scale-[1.05] active:scale-95"
                    >
                      <div className="flex-1 w-full overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        />
                      </div>
                      <div className="bg-background/95 p-1 text-center border-t">
                        <span className="text-[10px] font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">{item.name}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => handleRemoveItem(e, item.id)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-sm z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="flex-1"
                  disabled={items.length === 0}
                >
                  Create Game
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGame;
