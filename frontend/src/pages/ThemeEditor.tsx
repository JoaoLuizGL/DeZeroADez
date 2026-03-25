import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
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
import { ThemeItem } from "@/types/theme";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const ThemeEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const themeId = searchParams.get("id");
  const isEditing = !!themeId;

  const { user, isAuthenticated, openAuthModal, isAuthModalOpen } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const themeImageInputRef = useRef<HTMLInputElement>(null);
  
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [items, setItems] = useState<ThemeItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [themeImagePreview, setThemeImagePreview] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ThemeItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  const MAX_ITEMS = 29;

  // Fetch theme data if editing
  useEffect(() => {
    const fetchTheme = async () => {
      if (!themeId) return;

      try {
        const response = await fetch(`http://localhost:5000/${themeId}`);
        if (!response.ok) throw new Error("Failed to fetch theme");
        
        const theme = await response.json();
        setThemeName(theme.name);
        setThemeDescription(theme.description);
        
        // Fetch theme image if it's an ID
        if (theme.imageUrl && /^[0-9a-fA-F]{24}$/.test(theme.imageUrl)) {
          const imgRes = await fetch(`http://localhost:5000/images/${theme.imageUrl}`);
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            setThemeImagePreview(imgData.data);
          }
        } else {
          setThemeImagePreview(theme.imageUrl);
        }

        // Fetch items images if they are IDs
        const processedItems = await Promise.all((theme.items || []).map(async (item: any) => {
          if (item.imageUrl && /^[0-9a-fA-F]{24}$/.test(item.imageUrl)) {
            try {
              const imgRes = await fetch(`http://localhost:5000/images/${item.imageUrl}`);
              if (imgRes.ok) {
                const imgData = await imgRes.json();
                return { ...item, imageUrl: imgData.data };
              }
            } catch (err) {
              console.error(`Error fetching image for item ${item.id}:`, err);
            }
          }
          return item;
        }));
        
        setItems(processedItems);
      } catch (err) {
        console.error("Error fetching theme:", err);
        alert("Failed to load theme for editing.");
        navigate("/my-themes");
      } finally {
        setIsLoading(false);
      }
    };

    if (isEditing) {
      fetchTheme();
    }
  }, [themeId, isEditing, navigate]);

  useEffect(() => {
    if (!isAuthenticated && !isAuthModalOpen && !isLoading) {
      openAuthModal();
    }
  }, [isAuthenticated, openAuthModal, isAuthModalOpen, isLoading]);

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

  const handleThemeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThemeImagePreview(reader.result as string);
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

  const handleOpenEditDialog = (item: ThemeItem) => {
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
      const newItem: ThemeItem = {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert("Please add at least one item to the theme.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Upload theme image if it's base64
      let finalThemeImageUrl = themeImagePreview || "/placeholder.svg";
      if (themeImagePreview?.startsWith("data:image")) {
        const themeImgResponse = await fetch("http://localhost:5000/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: themeImagePreview }),
        });
        
        if (!themeImgResponse.ok) {
          throw new Error("Failed to upload theme image");
        }
        
        const themeImgData = await themeImgResponse.json();
        finalThemeImageUrl = themeImgData.id;
      }

      // 2. Upload item images if they are base64
      const processedItems = await Promise.all(items.map(async (item) => {
        // If it's a base64 image, upload it
        if (item.imageUrl.startsWith("data:image")) {
          const imgResponse = await fetch("http://localhost:5000/images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: item.imageUrl }),
          });
          
          if (!imgResponse.ok) {
            throw new Error(`Failed to upload image for ${item.name}`);
          }
          
          const imgData = await imgResponse.json();
          // Replace base64 with the image ID
          return { ...item, imageUrl: imgData.id };
        }
        return item;
      }));

      // 3. Save the theme
      const token = localStorage.getItem("token");
      const url = isEditing ? `http://localhost:5000/${themeId}` : "http://localhost:5000/";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: themeName,
          description: themeDescription,
          imageUrl: finalThemeImageUrl,
          items: processedItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save the theme");
      }

      const savedTheme = await response.json();
      console.log("Saved theme:", savedTheme);
      navigate(isEditing ? `/theme/${themeId}` : "/");
    } catch (err: any) {
      console.error("Error saving theme:", err);
      alert(err.message || "Failed to save the theme. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading theme details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <AuthModal />
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
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {isEditing ? "Edit Theme" : "Create New Theme"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {isEditing 
              ? "Update your theme details and items." 
              : "Define your theme and items to start rating."}
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Theme Details</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Update the basic information for your theme." 
                : "Enter the basic information for your new rating theme."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="name">Theme Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Best Programming Languages" 
                    required 
                    name="name" 
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Theme Image</Label>
                  <div 
                    onClick={() => themeImageInputRef.current?.click()}
                    className="relative w-24 h-24 rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group bg-secondary/50 flex flex-col items-center justify-center gap-1"
                  >
                    {themeImagePreview ? (
                      <>
                        <img src={themeImagePreview} alt="Theme preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        <span className="text-[8px] font-medium text-muted-foreground uppercase">Upload</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={themeImageInputRef} 
                    onChange={handleThemeImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  placeholder="Describe what people will be rating..." 
                  className="min-h-[100px]"
                  required
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value)}
                />
              </div>

              {/* Items Section */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Theme Items</Label>
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
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="default" 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={items.length === 0 || isSaving}
                >
                  {isSaving 
                    ? (isEditing ? "Updating..." : "Creating...") 
                    : (isEditing ? "Update Theme" : "Create Theme")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemeEditor;
