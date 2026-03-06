import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BackButton from "@/components/BackButton";

const CreateGame = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save the game will be implemented later
    console.log("Saving new game...");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-8">
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
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" className="flex-1">
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
