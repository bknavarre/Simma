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
  ChefHat,
  DollarSign,
  LogOut,
  ArrowRight,
  ShieldCheck
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

interface UserProfile {
  name: string;
  email: string;
  familySize: number;
  weeklyBudget: number;
  preferredStore: PrimaryStore;
  allergies: string[];
  completedOnboarding: boolean;
}

// ==================== INITIAL DATA ====================
const defaultRecipes: Recipe[] = [
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
  // SESSION & AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('simma_logged_in') === 'true';
  });

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // PROFILE & ONBOARDING STATE
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('simma_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      name: 'Brandon Navarre',
      email: 'brandon@navarre.com',
      familySize: 4,
      weeklyBudget: 175,
      preferredStore: 'HEB',
      allergies: [],
      completedOnboarding: false
    };
  });

  const [onboardingStep, setOnboardingStep] = useState<number>(1);

  // APP NAVIGATION & STATE
  const [tab, setTab] = useState<ActiveTab>('recipes');
  const [servingMult, setServingMult] = useState<number>(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
  const [selectedStoreMode, setSelectedStoreMode] = useState<PrimaryStore>('Cheapest');

  // RECIPES & PANTRY WITH LOCALSTORAGE PERSISTENCE
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('simma_recipes');
    return saved ? JSON.parse(saved) : defaultRecipes;
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('simma_pantry');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', name: 'Sandwich Zip Bags', category: 'Paper & Plastic', inStock: false, store: 'HEB', estimatedPrice: 3.48 },
      { id: 'p2', name: 'Gallon Zip Bags', category: 'Paper & Plastic', inStock: true, store: 'HEB', estimatedPrice: 4.28 },
      { id: 'p3', name: 'Paper Towels (12 PK)', category: 'Paper & Plastic', inStock: true, store: 'HEB', estimatedPrice: 18.98 },
      { id: 'p4', name: 'Trash Bags (13 Gal)', category: 'Cleaning', inStock: false, store: 'Kroger', estimatedPrice: 9.99 },
      { id: 'p5', name: 'Dishwasher Pods', category: 'Cleaning', inStock: true, store: 'HEB', estimatedPrice: 14.49 },
      { id: 'p6', name: 'All-Purpose Spray', category: 'Cleaning', inStock: false, store: 'HEB', estimatedPrice: 3.78 },
    ];
  });

  const [newPantryName, setNewPantryName] = useState('');
  const [newPantryCat] = useState('Paper & Plastic');

  const [weeks, setWeeks] = useState<Record<string, Record<string, DayPlan>>>(() => {
    const saved = localStorage.getItem('simma_weeks');
    return saved ? JSON.parse(saved) : { "current": emptyWeek() };
  });

  // SAVE TO LOCALSTORAGE ON UPDATES
  useEffect(() => {
    localStorage.setItem('simma_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('simma_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('simma_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('simma_pantry', JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem('simma_weeks', JSON.stringify(weeks));
  }, [weeks]);

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
      if (selectedStoreMode === 'Walmart') return item.store === 'Walmart';
      return true;
    }), [allGroceryItems, selectedStoreMode]);

  const itemsByStore = useMemo(() => {
    const grouped: Record<string, GroceryItem[]> = {};
    filteredGroceryItems.forEach(item => {
      const s = item.store || 'HEB';
      if (!grouped[s]) grouped[s] = [];
      grouped[s].push(item);
    });
    return grouped;
  }, [filteredGroceryItems]);

  const calculatedTotal = useMemo(() => 
    filteredGroceryItems.reduce((sum, item) => sum + item.estimatedPrice, 0), [filteredGroceryItems]);

  // ACTIONS
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    setProfile(prev => ({ ...prev, email: authEmail, name: authEmail.split('@')[0] || 'User' }));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

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
          breakfast: { type: "cook", recipeId: null, note: "Oatmeal or Eggs" },
          lunch: { type: "cook", recipeId: null, note: "Leftovers" },
          dinner: { type: "cook", recipeId: recipePick.id, note: "" }
        };
      }
    });

    setWeeks({ ...weeks, current: updated });
  };

  const setSlotRecipe = (day: string, slot: 'breakfast' | 'lunch' | 'dinner', recipeId: string | null) => {
    const current = weeks["current"] || emptyWeek();
    setWeeks({
      ...weeks,
      current: {
        ...current,
        [day]: {
          ...current[day],
          [slot]: { ...current[day][slot], recipeId }
        }
      }
    });
  };

  // 1. LOGIN / SIGNUP SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col justify-center items-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-[#F5EDE3] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <SimmaLogo className="h-12 justify-center" />
            <p className="text-sm text-stone-500 font-semibold pt-1">Good Food Comes Together</p>
          </div>

          <div className="flex bg-[#F5EDE3]/60 p-1 rounded-2xl border border-[#F5EDE3]">
            <button 
              onClick={() => setAuthMode('login')} 
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'login' ? 'bg-[#55624F] text-white' : 'text-[#55624F]'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setAuthMode('signup')} 
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'signup' ? 'bg-[#55624F] text-white' : 'text-[#55624F]'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#55624F] mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={authEmail} 
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="brandon@example.com" 
                className="w-full p-3 border border-[#F5EDE3] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#55624F]" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55624F] mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={authPassword} 
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-3 border border-[#F5EDE3] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#55624F]" 
              />
            </div>

            <button type="submit" className="w-full py-3.5 bg-[#C76F42] text-white rounded-xl text-sm font-extrabold shadow-md hover:bg-[#B35E33] transition flex items-center justify-center gap-2">
              {authMode === 'login' ? 'Log In to Simma' : 'Create Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-stone-400 font-semibold flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#7F8F6B]" /> Secure Personal Recipe Hub
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. FIRST-TIME WELCOME / ONBOARDING WIZARD
  if (!profile.completedOnboarding) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col justify-center items-center p-4">
        <div className="bg-white max-w-lg w-full rounded-3xl p-8 border border-[#F5EDE3] shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-[#F5EDE3] pb-4">
            <SimmaLogo className="h-8" />
            <span className="text-xs font-extrabold text-[#7F8F6B] bg-[#F5EDE3] px-3 py-1 rounded-full">Step {onboardingStep} of 3</span>
          </div>

          {onboardingStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Welcome to Simma! 👋</h2>
              <p className="text-stone-500 text-sm">Let's set up your household preferences to personalize your meal plan and grocery budget.</p>
              
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#55624F]">Household / Family Name</label>
                  <input 
                    value={profile.name} 
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="w-full mt-1 p-3 border border-[#F5EDE3] rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#55624F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#55624F]">Family Size (Number of People)</label>
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    value={profile.familySize} 
                    onChange={e => setProfile({ ...profile, familySize: Number(e.target.value) })}
                    className="w-full mt-1 p-3 border border-[#F5EDE3] rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#55624F]"
                  />
                </div>
              </div>

              <button onClick={() => setOnboardingStep(2)} className="w-full py-3 bg-[#55624F] text-white rounded-xl text-sm font-bold mt-4 shadow-md">
                Continue ›
              </button>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Budget & Primary Store 🛒</h2>
              <p className="text-stone-500 text-sm">Set your target weekly grocery spending and preferred grocery chain.</p>

              <div className="bg-[#FCFAF7] p-4 rounded-2xl border border-[#F5EDE3] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#55624F] flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-[#C76F42]" /> Weekly Budget Goal
                  </span>
                  <span className="text-base font-extrabold text-[#C76F42]">${profile.weeklyBudget} / week</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  step="10" 
                  value={profile.weeklyBudget}
                  onChange={e => setProfile({ ...profile, weeklyBudget: Number(e.target.value) })}
                  className="w-full accent-[#55624F] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#55624F]">Primary Grocery Store</label>
                <select 
                  value={profile.preferredStore}
                  onChange={e => setProfile({ ...profile, preferredStore: e.target.value as PrimaryStore })}
                  className="w-full mt-1 p-3 border border-[#F5EDE3] rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#55624F]"
                >
                  <option value="HEB">H-E-B</option>
                  <option value="Kroger">Kroger</option>
                  <option value="Walmart">Walmart</option>
                  <option value="Cheapest">Best Multi-Store Price Mix</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setOnboardingStep(1)} className="py-3 px-4 bg-white border border-[#F5EDE3] font-bold text-sm rounded-xl">Back</button>
                <button onClick={() => setOnboardingStep(3)} className="flex-1 py-3 bg-[#55624F] text-white rounded-xl text-sm font-bold shadow-md">Next Step ›</button>
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">All Set! Ready to Cook 🎉</h2>
              <p className="text-stone-500 text-sm">Your custom recipe vault, meal planner, and dynamic grocery sorter are configured.</p>

              <div className="bg-[#FCFAF7] p-4 rounded-2xl border border-[#F5EDE3] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Account:</span>
                  <span className="font-bold text-[#2E2E2E]">{profile.name} ({profile.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Weekly Target:</span>
                  <span className="font-bold text-[#C76F42]">${profile.weeklyBudget}/wk @ {profile.preferredStore}</span>
                </div>
              </div>

              <button 
                onClick={() => setProfile({ ...profile, completedOnboarding: true })} 
                className="w-full py-4 bg-[#C76F42] text-white rounded-2xl text-base font-extrabold shadow-lg hover:bg-[#B35E33] transition"
              >
                Launch Simma Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. MAIN DASHBOARD APP WITH FULL 6-TAB NAVIGATION
  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#2E2E2E] flex flex-col font-sans pb-24">
      
      {/* BRAND HEADER */}
      <header className="bg-white border-b border-[#F5EDE3] sticky top-0 z-30 shadow-xs px-4 py-3 flex justify-between items-center">
        <SimmaLogo className="h-9" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#F5EDE3]/60 p-1 rounded-xl border border-[#F5EDE3]">
            <span className="text-xs font-bold text-[#55624F] px-1.5">Servings:</span>
            {[1, 2, 3].map(mult => (
              <button key={mult} onClick={() => setServingMult(mult)} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${servingMult === mult ? 'bg-[#55624F] text-white' : 'text-[#55624F] hover:bg-white'}`}>
                {mult}x
              </button>
            ))}
          </div>

          <button onClick={handleLogout} className="p-2 text-stone-400 hover:text-[#C76F42] transition" title="Log Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* TAB 1: RECIPES */}
        {tab === 'recipes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2E2E2E]">My Recipe Vault</h2>
                <p className="text-stone-500 text-sm">Saved recipes, macro targets, and serving scaler</p>
              </div>
              <button className="flex items-center gap-2 bg-[#55624F] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xs hover:bg-[#434F3E] transition">
                <Plus className="w-4 h-4" /> Add Recipe
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {recipes.map(recipe => (
                <div key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="bg-white rounded-3xl border border-[#F5EDE3] shadow-xs overflow-hidden hover:border-[#7F8F6B]/40 transition flex flex-col cursor-pointer">
                  {recipe.image && (
                    <div className="h-48 overflow-hidden relative">
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#55624F] font-bold text-xs px-3 py-1 rounded-full border border-[#F5EDE3]">
                        {recipe.category}
                      </span>
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-extrabold text-lg text-[#2E2E2E]">{recipe.title}</h3>
                      <div className="flex items-center gap-3 text-xs font-semibold text-[#7F8F6B] mt-1">
                        {recipe.prepTime && <span>{recipe.prepTime}</span>}
                        <span>•</span>
                        <span>{recipe.baseServings * servingMult} Servings</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#C76F42]"><Flame className="w-3.5 h-3.5" /> {recipe.nutrition.calories * servingMult} kcal</span>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {recipe.dietTags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold bg-[#F5EDE3] text-[#C76F42] px-2.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F5EDE3]">
                      <h4 className="text-xs font-bold uppercase text-[#55624F] tracking-wider mb-2">Scaled Ingredients ({servingMult}x):</h4>
                      <ul className="text-xs text-stone-600 space-y-1">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7F8F6B]"></span>
                            {ing.amount * servingMult} {ing.unit} {ing.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PLANNER (BREAKFAST, LUNCH, DINNER SLOTS) */}
        {tab === 'planner' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#55624F] text-white p-6 rounded-3xl shadow-sm">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#7F8F6B] bg-white/10 px-3 py-1 rounded-full inline-block mb-2">Meal Schedule</span>
                <h2 className="text-2xl font-extrabold">Weekly Meal Planner</h2>
                <p className="text-stone-200 text-sm mt-1">Full daily slot scheduling & smart autofill</p>
              </div>
              <button onClick={autoFillWeek} className="bg-[#C76F42] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xs hover:bg-[#B35E33] transition">
                ✨ Auto Fill Week
              </button>
            </div>

            <div className="space-y-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                const dayPlan = weeks.current[day] || emptyWeek()[day];
                return (
                  <div key={day} className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-3">
                    <div className="flex justify-between items-center border-b border-[#F5EDE3] pb-2">
                      <span className="font-extrabold text-base text-[#55624F]">{day}</span>
                      <span className="text-xs font-bold text-[#7F8F6B] bg-[#F5EDE3] px-2.5 py-0.5 rounded-full">3 Meals</span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      {(['breakfast', 'lunch', 'dinner'] as const).map(meal => {
                        const slot = dayPlan[meal];
                        const recipe = recipes.find(r => r.id === slot?.recipeId);
                        return (
                          <div key={meal} className="bg-[#FCFAF7] p-3 rounded-2xl border border-[#F5EDE3] flex flex-col justify-between space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C76F42]">{meal}</span>
                              {recipe && <span className="text-[10px] font-bold text-[#7F8F6B] bg-[#F5EDE3] px-1.5 py-0.5 rounded-md">Scheduled</span>}
                            </div>

                            <select
                              value={slot?.recipeId || ""}
                              onChange={e => setSlotRecipe(day, meal, e.target.value || null)}
                              className="w-full bg-white border border-[#F5EDE3] rounded-xl p-2 text-xs font-bold text-[#2E2E2E] focus:ring-1 focus:ring-[#55624F]"
                            >
                              <option value="">-- {meal.charAt(0).toUpperCase() + meal.slice(1)} Option --</option>
                              {recipes.map(r => (
                                <option key={r.id} value={r.id}>{r.title}</option>
                              ))}
                            </select>

                            {slot?.note && !recipe && (
                              <p className="text-[11px] text-stone-500 italic px-1">{slot.note}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: GROCERY (STORE BREAKDOWN FOR BEST PRICE MIX) */}
        {tab === 'grocery' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#C76F42]">Shop Smart</span>
                <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Smart Grocery List</h2>
                <p className="text-stone-500 text-sm">Aisle Sorting & Multi-Store Breakdown</p>
              </div>

              <div className="flex items-center gap-3 bg-[#F5EDE3]/60 p-2 rounded-2xl border border-[#F5EDE3]">
                <Store className="w-5 h-5 text-[#55624F] ml-1" />
                <label htmlFor="store-select" className="text-xs font-bold uppercase tracking-wider text-[#55624F]">Store:</label>
                <select
                  id="store-select"
                  value={selectedStoreMode}
                  onChange={(e) => setSelectedStoreMode(e.target.value as PrimaryStore)}
                  className="bg-white border border-[#7F8F6B]/30 rounded-xl px-3 py-1.5 text-sm font-bold text-[#2E2E2E] focus:ring-2 focus:ring-[#55624F] focus:outline-none cursor-pointer"
                >
                  <option value="Cheapest">Best Mix (Grouped by Store)</option>
                  <option value="HEB">H-E-B Only (All Items)</option>
                  <option value="Kroger">Kroger Only (All Items)</option>
                  <option value="Walmart">Walmart Only</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#F5EDE3] shadow-xs overflow-hidden">
              <div className="p-4 bg-[#F5EDE3]/40 border-b border-[#F5EDE3] flex justify-between items-center">
                <span className="font-bold text-sm text-[#55624F]">
                  Store Mode: <span className="text-[#C76F42] font-extrabold">{selectedStoreMode === 'Cheapest' ? 'Optimal Multi-Store Mix' : selectedStoreMode}</span>
                </span>
                <span className="text-sm font-semibold text-[#2E2E2E]">
                  Estimated Total: <span className="text-[#55624F] text-base font-extrabold ml-1">${calculatedTotal.toFixed(2)}</span>
                </span>
              </div>

              {selectedStoreMode === 'Cheapest' ? (
                <div className="divide-y divide-[#F5EDE3]">
                  {Object.entries(itemsByStore).map(([storeName, items]) => {
                    const storeTotal = items.reduce((s, i) => s + i.estimatedPrice, 0);
                    return (
                      <div key={storeName} className="p-4 space-y-3">
                        <div className="flex justify-between items-center bg-[#FCFAF7] p-3 rounded-2xl border border-[#F5EDE3]">
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-[#C76F42]" />
                            <span className="font-extrabold text-sm text-[#2E2E2E]">{storeName}</span>
                            <span className="text-xs text-[#7F8F6B] font-semibold">({items.length} items)</span>
                          </div>
                          <span className="font-extrabold text-sm text-[#55624F]">${storeTotal.toFixed(2)}</span>
                        </div>

                        <div className="space-y-2 pl-2">
                          {items.map(item => (
                            <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-[#F5EDE3]/40 last:border-0">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" checked={item.checked} readOnly className="w-4 h-4 rounded border-[#7F8F6B] text-[#55624F]" />
                                <div>
                                  <span className="font-bold text-sm text-[#2E2E2E]">{item.name}</span>
                                  <p className="text-[11px] text-stone-500">{item.aisle} • {item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-bold text-sm text-[#2E2E2E]">${item.estimatedPrice.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="divide-y divide-[#F5EDE3]/60">
                  {filteredGroceryItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#FCFAF7] transition">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={item.checked} readOnly className="w-5 h-5 rounded border-[#7F8F6B] text-[#55624F]" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2E2E2E]">{item.name}</span>
                            {item.fromPantry && (
                              <span className="text-[10px] bg-[#F5EDE3] text-[#C76F42] px-2 py-0.5 rounded-full font-extrabold">Pantry Staple</span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500">{item.aisle} • Qty: {item.quantity}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-[#2E2E2E]">${item.estimatedPrice.toFixed(2)}</span>
                        <span className="block text-[11px] text-[#7F8F6B] font-bold uppercase">{item.store}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PANTRY */}
        {tab === 'pantry' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-5 h-5 text-[#55624F]" />
                <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Pantry & Household Staples</h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">Out-of-stock items automatically sync to your Grocery list.</p>
              
              <div className="flex gap-2 mt-4">
                <input value={newPantryName} onChange={e => setNewPantryName(e.target.value)} placeholder="Add staple item (e.g., Paper Towels)..." className="flex-1 px-3.5 py-2.5 border rounded-xl text-sm border-[#F5EDE3] focus:outline-none focus:ring-2 focus:ring-[#55624F]" />
                <button onClick={addPantryItem} className="bg-[#55624F] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#434F3E] transition">+ Add Item</button>
              </div>
            </div>

            <div className="grid gap-3">
              {pantryItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#F5EDE3] flex justify-between items-center shadow-xs">
                  <div className="flex items-center gap-3">
                    <button onClick={() => togglePantryStock(item.id)}>
                      {item.inStock ? (
                        <div className="w-5 h-5 rounded-full bg-[#7F8F6B] flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-[#C76F42] stroke-[2.2]" />
                      )}
                    </button>
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2E2E]">{item.name}</h4>
                      <span className="text-[11px] text-[#7F8F6B]">{item.category} • {item.store || 'HEB'}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.inStock ? 'bg-[#7F8F6B]/15 text-[#55624F]' : 'bg-[#F5EDE3] text-[#C76F42] border border-[#C76F42]/30'}`}>
                    {item.inStock ? 'In Stock' : 'Added to Grocery List'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DISCOVER / EXPLORE */}
        {tab === 'discover' && (
          <div className="space-y-6">
            <div className="bg-[#FCFAF7] p-6 rounded-3xl border border-[#F5EDE3] shadow-xs">
              <div className="flex items-center gap-2 text-[#C76F42] mb-1">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs uppercase font-extrabold tracking-wider">AI Recipe Builder & Importer</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Explore & Import Recipes</h2>
              <p className="text-stone-500 text-sm mt-1">Paste any recipe website URL or enter ingredients to auto-generate structured recipes</p>

              <div className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input 
                    type="text" 
                    placeholder="Paste recipe URL (e.g., foodnetwork.com, allrecipes.com)..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#7F8F6B]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#55624F]"
                  />
                </div>
                <button className="bg-[#55624F] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#434F3E] transition flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Import
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PREFS */}
        {tab === 'prefs' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Preferences & Profile</h2>
                <p className="text-stone-500 text-sm mt-1">Configure family settings, weekly budget slider, and store targets</p>
              </div>
              
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#55624F]">Household / Family Name</label>
                  <input 
                    value={profile.name} 
                    onChange={e => setProfile({ ...profile, name: e.target.value })} 
                    className="w-full mt-1 p-2.5 border border-[#F5EDE3] rounded-xl text-sm font-bold text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#55624F]" 
                  />
                </div>

                <div className="bg-[#FCFAF7] p-4 rounded-2xl border border-[#F5EDE3] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#55624F] flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-[#C76F42]" /> Target Weekly Budget
                    </span>
                    <span className="text-base font-extrabold text-[#C76F42]">${profile.weeklyBudget} / week</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={profile.weeklyBudget}
                    onChange={e => setProfile({ ...profile, weeklyBudget: Number(e.target.value) })}
                    className="w-full accent-[#55624F] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#55624F]">Preferred Grocery Store</label>
                  <select
                    value={profile.preferredStore}
                    onChange={e => setProfile({ ...profile, preferredStore: e.target.value as PrimaryStore })}
                    className="w-full mt-1 p-2.5 border border-[#F5EDE3] rounded-xl text-sm font-bold text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#55624F]"
                  >
                    <option value="HEB">H-E-B</option>
                    <option value="Kroger">Kroger</option>
                    <option value="Walmart">Walmart</option>
                    <option value="Cheapest">Best Price Mix</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-[#F5EDE3]">
                  <button 
                    onClick={() => setProfile({ ...profile, completedOnboarding: false })} 
                    className="w-full py-2.5 bg-[#F5EDE3] text-[#55624F] rounded-xl text-xs font-bold hover:bg-[#EADBCC] transition"
                  >
                    Re-run Setup Wizard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* RECIPE DETAIL MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-xl text-[#2E2E2E]">{selectedRecipe.title}</h3>
              <button onClick={() => setSelectedRecipe(null)} className="font-bold text-stone-400 hover:text-[#2E2E2E]">✕</button>
            </div>
            <p className="text-sm text-stone-600">{selectedRecipe.instructions}</p>
            <button onClick={() => { setCookingRecipe(selectedRecipe); setSelectedRecipe(null); }} className="w-full py-3 bg-[#55624F] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-[#434F3E] transition">
              <ChefHat className="w-5 h-5" /> Enter Cooking Mode
            </button>
          </div>
        </div>
      )}

      {/* COOKING MODE OVERLAY */}
      {cookingRecipe && <CookingMode recipe={cookingRecipe} onClose={() => setCookingRecipe(null)} />}

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5EDE3] z-40 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-2.5 flex justify-between items-center">
          
          <button 
            onClick={() => setTab('recipes')}
            className={`flex flex-col items-center gap-1 transition ${tab === 'recipes' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Recipes</span>
          </button>

          <button 
            onClick={() => setTab('planner')}
            className={`flex flex-col items-center gap-1 transition ${tab === 'planner' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <Calendar className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Planner</span>
          </button>

          <button 
            onClick={() => setTab('grocery')}
            className={`flex flex-col items-center gap-1 transition ${tab === 'grocery' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Grocery</span>
          </button>

          <button 
            onClick={() => setTab('pantry')}
            className={`flex flex-col items-center gap-1 transition ${tab === 'pantry' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <Package className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Pantry</span>
          </button>

          <button 
            onClick={() => setTab('discover')}
            className={`flex flex-col items-center gap-1 transition ${tab === 'discover' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <Compass className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Discover</span>
          </button>

          <button 
            onClick={() => setTab('prefs')}
            className={`flex flex-col items-center gap-1 transition ${tab === 'prefs' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <Settings className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Prefs</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
