import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { Plus, Loader2, User as UserIcon, LayoutGrid, Settings, LogOut } from "lucide-react";
import { Theme } from "@/types/theme";
import { useImageProxy } from "@/hooks/useImageProxy";
import { ProfileModal } from "@/components/ProfileModal";
import BackButton from "@/components/BackButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const GameCard = ({ game, onClick }: { game: Theme; onClick: () => void }) => {
  const { displayUrl } = useImageProxy(game.imageUrl || "");
  
  return (
    <Card 
      className="group relative overflow-hidden h-[280px] hover:border-primary transition-all cursor-pointer flex flex-col justify-end border-none shadow-md"
      onClick={onClick}
      style={{
        backgroundImage: displayUrl ? `url(${displayUrl})` : "linear-gradient(to bottom, #3b82f6, #1e3a8a)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black transition-opacity duration-300" />
      
      {game.creator && (
        <div className="absolute top-3 right-3 z-20">
          <span className="text-[10px] font-bold bg-primary/80 text-primary-foreground px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm">
            {game.creator === "Original" ? "Original" : `BY ${game.creator}`}
          </span>
        </div>
      )}

      <CardHeader className="relative z-10 text-white p-5">
        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{game.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-white/80 text-sm leading-relaxed">{game.description}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 p-5 pt-0">
        <Button variant="secondary" className="w-full font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
};

const MyThemes = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      openAuthModal();
      return;
    }

    const fetchMyThemes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/themes/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch your themes");
        }
        const data = await response.json() as (Theme & { _id: string })[];
        const mappedData = data.map((game) => ({
          ...game,
          id: game._id || game.id
        }));
        setGames(mappedData);
      } catch (err) {
        console.error("Error fetching my themes:", err);
        setError("Could not load your themes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyThemes();
  }, [isAuthenticated, navigate, openAuthModal]);

  const handleGameClick = (id: string) => {
    navigate(`/game/${id}`);
  };

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <BackButton />
          
          <div className="flex items-center gap-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent">
                    <UserIcon className="w-4 h-4" />
                    <span className="font-medium">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-themes")}>
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    My Themes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <ProfileModal 
          open={isProfileModalOpen} 
          onOpenChange={setIsProfileModalOpen} 
        />
        
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            My Themes
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Manage and play your own creations
          </p>
          
          <SearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search your themes..." 
          />
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your themes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card 
              className="group h-[280px] bg-primary text-primary-foreground hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-6 text-center border-none shadow-lg hover:shadow-primary/20"
              onClick={() => navigate("/create-game")}
            >
              <div className="mb-4 p-4 rounded-full bg-primary-foreground/10 text-primary-foreground group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl mb-2">Create New Game</CardTitle>
              <CardDescription className="text-primary-foreground/70 text-base">Start your own rating list from scratch</CardDescription>
            </Card>

            {filteredGames.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onClick={() => handleGameClick(game.id)} 
              />
            ))}
            
            {filteredGames.length === 0 && searchQuery && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No themes found matching "{searchQuery}"</p>
              </div>
            )}
            
            {filteredGames.length === 0 && !searchQuery && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">You haven't created any themes yet.</p>
                <Button onClick={() => navigate("/create-game")}>Create Your First Theme</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyThemes;
