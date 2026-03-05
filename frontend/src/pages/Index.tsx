import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Code } from "lucide-react";
import { sampleGames } from "@/data/sampleItems";

const Index = () => {
  const navigate = useNavigate();

  const getIcon = (gameId: string) => {
    switch (gameId) {
      case "1": return <Users className="w-8 h-8" />;
      case "2": return <Code className="w-8 h-8" />;
      default: return <Users className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">De Zero a Dez</h1>
          <p className="text-xl text-muted-foreground">
            Select a theme and start rating!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleGames.map((game) => (
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
                <Button className="w-full">Play Now</Button>
              </CardContent>
            </Card>
          ))}
          
          {/* Placeholder for future themes */}
          <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 bg-muted/20 opacity-60">
            <CardHeader className="text-center">
              <CardTitle className="text-muted-foreground">More coming soon...</CardTitle>
              <CardDescription>Stay tuned for new themes</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
