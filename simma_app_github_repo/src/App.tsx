import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Calendar, 
  ShoppingCart, 
  Compass, 
  Settings, 
  Store, 
  Circle, 
  Check, 
  Plus, 
  Sparkles, 
  Package, 
  Search, 
  ExternalLink,
  Flame,
  ChefHat
} from 'lucide-react';

// ==================== TYPES & INTERFACES ====================
type PrimaryStore = 'HEB' | 'Walmart' | 'Kroger' | 'Cheapest';
type ActiveTab = 'recipes' | 'planner' | 'grocery' | 'pantry' | 'discover' | 'prefs';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  aisle: string;
}

interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface Recipe {
  id: string;
  title: string;
  category: string;
  dietTags: string[];
  image: string | null;
  url: string | null;
  rating: number;
  favorite: boolean;
  baseServings: number;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  instructions: string;
  timesUsed: number;
  prepTime?: string;
}

interface PantryItem {
  id: string;
  name: string;
  category: string;
  inStock: boolean;
  store?: 'HEB' | 'Kroger' | 'Walmart';
  estimatedPrice?: number;
}

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  aisle: string;
  quantity: string;
  estimatedPrice: number;
  store: 'HEB' | 'Kroger' | 'Walmart';
  checked: boolean;
  fromPantry?: boolean;
}

interface DaySlot {
  type: string;
  recipeId: string | null;
  note: string;
}

interface DayPlan {
  breakfast: DaySlot;
  lunch: DaySlot;
  dinner: DaySlot;
}

// ==================== INITIAL DATA ====================
const sampleRecipes: Recipe[] = [
  {
    id: "r1",
    title: "H-E-B Copycat Poblano Chicken Lasagna",
    category: "Dinner",
    prepTime: "45 mins",
    dietTags: ["High-Protein", "Comfort Food", "Copycat"],
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80",
    url: null,
    rating: 4.8,
    favorite: true,
    baseServings: 6,
    nutrition: { calories: 520, protein: 38, carbs: 42, fat: 22, fiber: 4 },
    ingredients: [
      { name: "Boneless Skinless Chicken Breasts", amount: 2, unit: "lb", aisle: "Meat & Seafood" },
      { name: "Poblano Peppers", amount: 4, unit: "count", aisle: "Produce" },
      { name: "Oaxaca Cheese", amount: 1, unit: "block (8oz)", aisle: "Dairy & Eggs" },
      { name: "Heavy Whipping Cream", amount: 1, unit: "carton (16oz)", aisle: "Dairy & Eggs" },
      { name: "Lasagna Noodles", amount: 1, unit: "box (16oz)", aisle: "Pantry / Canned" }
    ],
    instructions: "1. Roast poblanos until charred, peel, and blend with heavy cream.\n2. Layer cooked shredded chicken, poblano sauce, noodles, and Oaxaca cheese.\n3. Bake at 375°F for 30 minutes until golden and bubbly.",
    timesUsed: 5
  },
  {
    id: "r2",
    title: "Bacon-Wrapped Jalapeño Poppers",
    category: "Appetizers",
    prepTime: "25 mins",
    dietTags: ["Keto", "Grill-Friendly", "Low-Carb"],
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80",
    url: null,
    rating: 4.6,
    favorite: true,
    baseServings: 4,
    nutrition: { calories: 310, protein: 14, carbs: 6, fat: 26, fiber: 2 },
    ingredients: [
      { name: "Fresh Jalapeños", amount: 8, unit: "count", aisle: "Produce" },
      { name: "Cream Cheese (cold)", amount: 8, unit: "oz", aisle: "Dairy & Eggs" },
      { name: "Thin-Cut Bacon", amount: 1, unit: "pack", aisle: "Meat & Seafood" },
      { name: "Garlic Powder", amount: 1, unit: "tsp", aisle: "Spices & Baking" }
    ],
    instructions: "1. Slice jalapeños in half lengthwise and deseed.\n2. Stuff with cold cream cheese mixed with garlic powder.\n3. Wrap tightly with thin-cut bacon and grill over indirect heat (375°F) for 20-25 mins until crisp.",
    timesUsed: 4
  }
];

const emptySlot = (): DaySlot => ({ type: "cook", recipeId: null, note: "" });
const emptyWeek = (): Record<string, DayPlan> => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const w: Record<string, DayPlan> = {};
  days.forEach(d => { w[d] = { breakfast: emptySlot(), lunch: emptySlot(), dinner: emptySlot() }; });
  return w;
};

// ==================== BRAND LOGO ====================
const SimmaLogo = ({ className = "h-8" }: { className?: string }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg viewBox="0 0 100 100" className="h-full w-auto aspect-square">
      <path d="M 38 22 C 24 36 30 56 48 52 C 48 36 40 22 38 22 Z" fill="#7F8F6B"/>
      <path d="M 62 22 C 76 36 70 56 52 52 C 52 36 60 22 62 22 Z" fill="#C76F42"/>
      <text x="50" y="88" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="44" fontWeight="800" fill="#2E2E2E" textAnchor="middle">S</text>
    </svg>
    <div className="flex flex-col">
      <span className="font-extrabold text-2xl tracking-tight text-[#2E2E2E] leading-none">Simma</span>
      <span className="text-[9px] font-bold tracking-widest text-[#7F8F6B] uppercase mt-0.5">Good Food Comes Together</span>
    </div>
  </div>
);

// ==================== COOKING MODE OVERLAY ====================
function CookingMode({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const steps = useMemo(() => {
    const parts = recipe.instructions.split(/\n+/).map(s => s.replace(/^\s*(step\s*)?\d+\s*[.):-]\s*/i, "").trim()).filter(Boolean);
    return parts.length ? parts : ["No instructions available."];
  }, [recipe.instructions]);

  const [i, setI] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#FCFAF7] flex flex-col p-6 select-none">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#7F8F6B]">Cooking Mode</span>
          <h2 className="text-xl font-bold text-[#2E2E2E]">{recipe.title}</h2>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#F5EDE3] shadow-xs font-bold text-lg">✕</button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
        <span className="text-xs font-bold uppercase text-[#7F8F6B] tracking-widest">Step {i + 1} of {steps.length}</span>
        <p className="text-2xl font-extrabold text-[#2E2E2E] mt-3 leading-relaxed">{steps[i]}</p>
      </div>

      <div className="flex gap-4 max-w-xl mx-auto w-full pt-6">
        <button disabled={i === 0} onClick={() => setI(x => x - 1)} className="flex-1 py-4 rounded-2xl bg-white border border-[#F5EDE3] font-bold disabled:opacity-30">‹ Previous</button>
        {i < steps.length - 1 ? (
          <button onClick={() => setI(x => x + 1)} className="flex-[2] py-4 rounded-2xl bg-[#55624F] text-white font-bold shadow-md">Next Step ›</button>
        ) : (
          <button onClick={onClose} className="flex-[2] py-4 rounded-2xl bg-[#C76F42] text-white font-bold shadow-md">Finish Cooking ✓</button>
        )}
      </div>
    </div>
  );
}

// ==================== MAIN SIMMA APP ====================
export default function App() {
  const [tab, setTab] = useState<ActiveTab>('recipes');
  const [servingMult, setServingMult] = useState<number>(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
  const [selectedStoreMode, setSelectedStoreMode] = useState<PrimaryStore>('Cheapest');
  
  // RECIPES STATE
  const [recipes] = useState<Recipe[]>(sampleRecipes);

  // PANTRY STATE
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    { id: 'p1', name: 'Sandwich Zip Bags', category: 'Paper & Plastic', inStock: false, store: 'HEB', estimatedPrice: 3.48 },
    { id: 'p2', name: 'Gallon Zip Bags', category: 'Paper & Plastic', inStock: true, store: 'HEB', estimatedPrice: 4.28 },
    { id: 'p3', name: 'Paper Towels (12 PK)', category: 'Paper & Plastic', inStock: true, store: 'HEB', estimatedPrice: 18.98 },
    { id: 'p4', name: 'Trash Bags (13 Gal)', category: 'Cleaning', inStock: false, store: 'Kroger', estimatedPrice: 9.99 },
    { id: 'p5', name: 'Dishwasher Pods', category: 'Cleaning', inStock: true, store: 'HEB', estimatedPrice: 14.49 },
    { id: 'p6', name: 'All-Purpose Spray', category: 'Cleaning', inStock: false, store: 'HEB', estimatedPrice: 3.78 },
  ]);
  const [newPantryName, setNewPantryName] = useState('');
  const [newPantryCat] = useState('Paper & Plastic');

  // PREFERENCES STATE
  const [prefs, setPrefs] = useState({
    familyName: "Navarre",
    familySize: 4,
    weeklyBudget: "150",
    preferredStore: "HEB" as PrimaryStore,
    avoidIngredients: [] as string[],
    allergies: [] as string[],
    geminiApiKey: ""
  });

  // PLANNER WEEKS STATE
  const [weeks, setWeeks] = useState<Record<string, Record<string, DayPlan>>>({
    "current": emptyWeek()
  });

  // GROCERY COMPUTATION
  const rawGroceryItems: GroceryItem[] = useMemo(() => [
    { id: 'g1', name: 'Boneless Skinless Chicken Breasts', category: 'Meat', aisle: 'Aisle 2 - Poultry', quantity: `${2 * servingMult} lbs`, estimatedPrice: 7.96 * servingMult, store: 'HEB', checked: false },
    { id: 'g2', name: 'Poblano Peppers', category: 'Produce', aisle: 'Aisle 1 - Produce', quantity: `${4 * servingMult} count`, estimatedPrice: 1.48 * servingMult, store: 'HEB', checked: false },
    { id: 'g3', name: 'Oaxaca Cheese (8oz)', category: 'Dairy', aisle: 'Aisle 4 - Cheese', quantity: '1 block', estimatedPrice: 3.89, store: 'HEB', checked: false },
    { id: 'g4', name: 'Heavy Whipping Cream (16oz)', category: 'Dairy', aisle: 'Aisle 4 - Dairy', quantity: '1 carton', estimatedPrice: 2.99, store: 'Kroger', checked: false },
    { id: 'g5', name: 'Lasagna Noodles (16oz)', category: 'Pantry', aisle: 'Aisle 6 - Pasta', quantity: '1 box', estimatedPrice: 1.78, store: 'HEB', checked: false },
  ], [servingMult]);

  const pantryGroceryItems: GroceryItem[] = useMemo(() => 
    pantryItems
      .filter(item => !item.inStock)
      .map(item => ({
        id: `pantry-sync-${item.id}`,
        name: item.name,
        category: item.category,
        aisle: item.store === 'HEB' ? 'Aisle 11 - Household' : 'Aisle 8 - Cleaning',
        quantity: '1 pk',
        estimatedPrice: item.estimatedPrice || 4.99,
        store: item.store || 'HEB',
        checked: false,
        fromPantry: true
      })), [pantryItems]);

  const allGroceryItems = useMemo(() => [...rawGroceryItems, ...pantryGroceryItems], [rawGroceryItems, pantryGroceryItems]);

  const filteredGroceryItems = useMemo(() => 
    allGroceryItems.filter(item => {
      if (selectedStoreMode === 'HEB') return item.store === 'HEB';
      if (selectedStoreMode === 'Kroger') return item.store === 'Kroger';
      return true;
    }), [allGroceryItems, selectedStoreMode]);

  const calculatedTotal = useMemo(() => 
    filteredGroceryItems.reduce((sum, item) => sum + item.estimatedPrice, 0), [filteredGroceryItems]);

  const togglePantryStock = (id: string) => {
    setPantryItems(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  const addPantryItem = () => {
    if (!newPantryName.trim()) return;
    setPantryItems(prev => [...prev, { 
      id: `p_${Date.now()}`, 
      name: newPantryName.trim(), 
      category: newPantryCat, 
      inStock: true,
      store: 'HEB',
      estimatedPrice: 3.99 
    }]);
    setNewPantryName('');
  };

  const autoFillWeek = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const current = weeks["current"] || emptyWeek();
    const updated = { ...current };

    days.forEach((day, idx) => {
      const recipePick = recipes[idx % recipes.length];
      if (recipePick) {
        updated[day] = {
          ...updated[day],
          dinner: { type: "cook", recipeId: recipePick.id, note: "" }
        };
      }
    });

    setWeeks({ ...weeks, current: updated });
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#2E2E2E] flex flex-col font-sans pb-24">
      
      {/* BRAND HEADER */}
      <header className="bg-white border-b border
