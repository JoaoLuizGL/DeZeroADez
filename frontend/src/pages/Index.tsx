import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { Users, Code, Plus } from "lucide-react";
import { sampleGames } from "@/data/sampleItems";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const getIcon = (gameId: string) => {
    switch (gameId) {
      case "1": return <Users className="w-8 h-8" />;
      case "2": return <Code className="w-8 h-8" />;
      default: return <Users className="w-8 h-8" />;
    }
  };

  const filteredGames = sampleGames.filter((game) =>
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
                <CardDescription>{game.description}</CardDescription>
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

          {/* Placeholder for future themes - only show if search is empty or matches */}
          {!searchQuery && (
            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 bg-muted/20 opacity-60">
              <CardHeader className="text-center">
                <CardTitle className="text-muted-foreground">More coming soon...</CardTitle>
                <CardDescription>Stay tuned for new themes</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
