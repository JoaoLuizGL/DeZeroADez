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

const ThemeCard = ({ theme, onClick, onEdit }: { theme: Theme; onClick: () => void; onEdit: (e: React.MouseEvent) => void }) => {
  const { displayUrl } = useImageProxy(theme.imageUrl || "");
  
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
      
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <Button 
          variant="secondary" 
          className="h-8 px-3 gap-2 bg-black/50 border-none text-white hover:bg-primary hover:text-primary-foreground backdrop-blur-sm transition-all duration-300"
          onClick={onEdit}
        >
          <span className="text-xs font-medium">Editar</span>
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <CardHeader className="relative z-10 text-white p-5">
        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{theme.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-white/80 text-sm leading-relaxed">{theme.description}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 p-5 pt-0">
        <Button variant="secondary" className="w-full font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          Selecionar
        </Button>
      </CardContent>
    </Card>
  );
};

const MyThemes = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [themes, setThemes] = useState<Theme[]>([]);
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
          throw new Error("Falha ao buscar seus temas");
        }
        const data = await response.json() as (Theme & { _id: string })[];
        const mappedData = data.map((theme) => ({
          ...theme,
          id: theme._id || theme.id
        }));
        setThemes(mappedData);
      } catch (err) {
        console.error("Error fetching my themes:", err);
        setError("Não foi possível carregar seus temas. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyThemes();
  }, [isAuthenticated, navigate, openAuthModal]);

  const handleThemeClick = (id: string) => {
    navigate(`/theme/${id}`);
  };

  const filteredThemes = themes.filter((theme) =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.description.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-themes")}>
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Meus Temas
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
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
            Meus Temas
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie e avalie suas próprias criações
          </p>
          
          <SearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Pesquisar seus temas..." 
          />
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando seus temas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card 
              className="group h-[280px] bg-primary text-primary-foreground hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-6 text-center border-none shadow-lg hover:shadow-primary/20"
              onClick={() => navigate("/create-theme")}
            >
              <div className="mb-4 p-4 rounded-full bg-primary-foreground/10 text-primary-foreground group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl mb-2">Criar Novo Tema</CardTitle>
              <CardDescription className="text-primary-foreground/70 text-base">Comece sua própria lista de avaliação do zero</CardDescription>
            </Card>

            {filteredThemes.map((theme) => (
              <ThemeCard 
                key={theme.id} 
                theme={theme} 
                onClick={() => handleThemeClick(theme.id)} 
                onEdit={(e) => {
                  e.stopPropagation();
                  navigate(`/create-theme?id=${theme.id}`);
                }}
              />
            ))}
            
            {filteredThemes.length === 0 && searchQuery && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">Nenhum tema encontrado correspondente a "{searchQuery}"</p>
              </div>
            )}
            
            {filteredThemes.length === 0 && !searchQuery && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">Você ainda não criou nenhum tema.</p>
                <Button onClick={() => navigate("/create-theme")}>Criar seu primeiro tema</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyThemes;
