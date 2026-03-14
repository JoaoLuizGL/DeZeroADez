import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { Users, Code, Plus, Gamepad2, Loader2 } from "lucide-react";
import { Theme } from "@/types/theme";

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

  const getIcon = (gameId: string) => {
    // Basic mapping for sample IDs, default icon for others
    if (gameId.includes("football") || gameId === "1") return <Users className="w-8 h-8" />;
    if (gameId.includes("code") || gameId === "2") return <Code className="w-8 h-8" />;
    return <Gamepad2 className="w-8 h-8" />;
  };

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">De Zero a Dez</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className="group bg-primary text-primary-foreground hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-6 text-center border-none shadow-lg hover:shadow-primary/20"
              onClick={() => navigate("/create-game")}
            >
              <div className="mb-4 p-3 rounded-full bg-primary-foreground/10 text-primary-foreground group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-8 h-8" />
              </div>
              <CardTitle className="mb-2">Create New Game</CardTitle>
              <CardDescription className="text-primary-foreground/70">Start your own rating list from scratch</CardDescription>
            </Card>

            {filteredGames.map((game) => (
              <Card 
                key={game.id} 
                className="group hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                <CardHeader>
                  <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-200">
                    {getIcon(game.id)}
                  </div>
                  <CardTitle>{game.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">Play Now</Button>
                </CardContent>
              </Card>
            ))}
            
            {filteredGames.length === 0 && searchQuery && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No themes found matching "{searchQuery}"</p>
              </div>
            )}

            {!searchQuery && (
              <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 bg-muted/20 opacity-60">
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
