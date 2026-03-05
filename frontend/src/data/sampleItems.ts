import { Game, GameItem } from "@/types/game";

const footballPlayers: GameItem[] = [
  { 
    id: "f1", 
    name: "Lionel Messi", 
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80" 
  },
  { 
    id: "f2", 
    name: "Cristiano Ronaldo", 
    imageUrl: "//upload.wikimedia.org/wikipedia/commons/thumb/6/67/Cristiano_Ronaldo_2275_%28cropped%29.jpg/250px-Cristiano_Ronaldo_2275_%28cropped%29.jpg" 
  },
  { 
    id: "f3", 
    name: "Neymar Jr", 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Neymar_Jr._with_Al_Hilal%2C_3_October_2023_-_03_%28cropped%29.jpg" 
  },
  { 
    id: "f4", 
    name: "Kylian Mbappé", 
    imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d445bb5170?w=800&q=80" 
  },
  { 
    id: "f5", 
    name: "Erling Haaland", 
    imageUrl: "https://images.unsplash.com/photo-1614632537190-23e414d40957?w=800&q=80" 
  },
  { 
    id: "f6", 
    name: "Vinícius Júnior", 
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80" 
  },
  { 
    id: "f7", 
    name: "Mohamed Salah", 
    imageUrl: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&q=80" 
  },
  { 
    id: "f8", 
    name: "Kevin De Bruyne", 
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80" 
  },
  { 
    id: "f9", 
    name: "Jude Bellingham", 
    imageUrl: "https://images.unsplash.com/photo-1510051646651-d978a2e13028?w=800&q=80" 
  },
  { 
    id: "f10", 
    name: "Harry Kane", 
    imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80" 
  }
];

const programmingLanguages: GameItem[] = [
  {
    id: "p1",
    name: "Python",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
  },
  {
    id: "p2",
    name: "JavaScript",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
  },
  {
    id: "p3",
    name: "Java",
    imageUrl: "https://upload.wikimedia.org/wikipedia/pt/2/2e/Java_Logo.svg"
  },
  {
    id: "p4",
    name: "C++",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg"
  },
  {
    id: "p5",
    name: "C#",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/C_Sharp_wordmark.svg"
  },
  {
    id: "p6",
    name: "PHP",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
  },
  {
    id: "p7",
    name: "TypeScript",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg"
  },
  {
    id: "p8",
    name: "Swift",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg"
  },
  {
    id: "p9",
    name: "Rust",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg"
  },
  {
    id: "p10",
    name: "Go",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg"
  }
];

export const sampleGames: Game[] = [
  {
    id: "1",
    name: "Top 10 Football Players",
    description: "Rank the top 10 football players of all time!",
    items: footballPlayers,
  },
  {
    id: "2",
    name: "Programming Languages",
    description: "Rank your favorite programming languages!",
    items: programmingLanguages,
  }
];
