import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { Plus, Loader2 } from "lucide-react";
import { Theme } from "@/types/theme";
import { useImageProxy } from "@/hooks/useImageProxy";

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

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:5000/");
        if (!response.ok) {
          throw new Error("Failed to fetch themes");
        }
        const data = await response.json() as (Theme & { _id: string })[];
        // Backend uses _id, but frontend types might expect id. 
        // Mapping _id to id for consistency if needed, but keeping both for now.
        const mappedData = data.map((game) => ({
          ...game,
          id: game._id || game.id
        }));
        setGames(mappedData);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Could not load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            De Zero a Dez
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Select a theme and start rating!
          </p>
          
          <SearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search themes..." 
          />
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading themes...</p>
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
                onClick={() => navigate(`/game/${game.id}`)} 
              />
            ))}
            
            {filteredGames.length === 0 && searchQuery && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No themes found matching "{searchQuery}"</p>
              </div>
            )}

            {!searchQuery && (
              <Card className="border-dashed border-2 h-[280px] flex flex-col items-center justify-center p-6 bg-muted/20 opacity-60">
                <CardHeader className="text-center">
                  <CardTitle className="text-muted-foreground">More coming soon...</CardTitle>
                  <CardDescription>Stay tuned for new themes</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
