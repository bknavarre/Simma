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
  Flame, 
  LogOut, 
  ArrowRight, 
  Edit3, 
  Users, 
  Utensils, 
  ThumbsUp, 
  ThumbsDown, 
  Globe, 
  Bot, 
  RefreshCw, 
  Info, 
  CheckCircle2
} from 'lucide-react';

// ==================== TYPES & INTERFACES ====================
export type StoreOption = 'HEB' | 'Walmart' | 'Kroger' | 'Trader Joes' | 'Aldi';
export type StoreMode = StoreOption | 'Cheapest';
export type ActiveTab = 'recipes' | 'planner' | 'grocery' | 'pantry' | 'discover' | 'prefs';

export interface StoreInfo {
  price: number;
  aisle: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  storePrices: Record<StoreOption, StoreInfo>;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  prepTime: string;
  dietTags: string[];
  image: string;
  rating: number;
  favorite: boolean;
  baseServings: number;
  currentMultiplier: number;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  instructions: string;
  timesUsed: number;
}

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  inStock: boolean;
  storePrices: Record<StoreOption, StoreInfo>;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  aisle: string;
  quantity: string;
  price: number;
  store: StoreOption;
  checked: boolean;
  isCommunityPrice?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  adults: number;
  kids: number;
  weeklyBudget: number;
  goals: string[];
  selectedStores: StoreOption[];
  preferredStore: StoreMode;
  repeatDinners: string[];
  lovedFoods: string[];
  skippedFoods: string[];
  dietRestrictions: string[];
  zipCode: string;
  enableCommunityPool: boolean;
  completedOnboarding: boolean;
}

// ==================== INITIAL DATA ====================
const INITIAL_RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "H-E-B Copycat Poblano Chicken Lasagna",
    category: "Dinner",
    prepTime: "45 mins",
    dietTags: ["High-Protein", "Comfort Food", "Copycat"],
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    favorite: true,
    baseServings: 6,
    currentMultiplier: 1,
    nutrition: { calories: 520, protein: 38, carbs: 42, fat: 22 },
    ingredients: [
      { 
        name: "Boneless Skinless Chicken Breasts", 
        amount: 2, 
        unit: "lbs", 
        storePrices: {
          HEB: { price: 7.96, aisle: "Aisle 2 - Meat & Poultry" },
          Kroger: { price: 8.49, aisle: "Meat Dept - Row 1" },
          Walmart: { price: 7.24, aisle: "Back Meat Wall" },
          'Trader Joes': { price: 8.99, aisle: "Fresh Poultry Case" },
          Aldi: { price: 6.99, aisle: "Cooler 3 - Poultry" }
        }
      },
      { 
        name: "Poblano Peppers", 
        amount: 4, 
        unit: "count", 
        storePrices: {
          HEB: { price: 1.48, aisle: "Aisle 1 - Produce Bins" },
          Kroger: { price: 1.96, aisle: "Produce Wall" },
          Walmart: { price: 1.28, aisle: "Produce Section" },
          'Trader Joes': { price: 1.79, aisle: "Fresh Veggies" },
          Aldi: { price: 1.19, aisle: "Produce Cooler" }
        }
      },
      { 
        name: "Oaxaca Cheese (8oz)", 
        amount: 1, 
        unit: "block", 
        storePrices: {
          HEB: { price: 3.89, aisle: "Aisle 4 - Cheese & Dairy" },
          Kroger: { price: 4.29, aisle: "Deli Specialty Cheese" },
          Walmart: { price: 3.64, aisle: "Dairy Aisle 2" },
          'Trader Joes': { price: 3.99, aisle: "Cheese Case" },
          Aldi: { price: 3.29, aisle: "Cooler 1" }
        }
      },
      { 
        name: "Heavy Whipping Cream (16oz)", 
        amount: 1, 
        unit: "carton", 
        storePrices: {
          HEB: { price: 2.99, aisle: "Aisle 4 - Dairy Case" },
          Kroger: { price: 2.79, aisle: "Dairy Wall" },
          Walmart: { price: 2.48, aisle: "Dairy Section" },
          'Trader Joes': { price: 3.29, aisle: "Dairy Section" },
          Aldi: { price: 2.39, aisle: "Cooler 2" }
        }
      },
      { 
        name: "Lasagna Noodles (16oz)", 
        amount: 1, 
        unit: "box", 
        storePrices: {
          HEB: { price: 1.78, aisle: "Aisle 6 - Pasta & Grains" },
          Kroger: { price: 1.89, aisle: "Aisle 4 - Dry Pasta" },
          Walmart: { price: 1.52, aisle: "Aisle A12 - Pasta" },
          'Trader Joes': { price: 1.99, aisle: "Pantry Row 2" },
          Aldi: { price: 1.39, aisle: "Aisle 2 - Dry Goods" }
        }
      }
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
    rating: 4.6,
    favorite: true,
    baseServings: 4,
    currentMultiplier: 1,
    nutrition: { calories: 310, protein: 14, carbs: 6, fat: 26 },
    ingredients: [
      { 
        name: "Fresh Jalapeños", 
        amount: 8, 
        unit: "count", 
        storePrices: {
          HEB: { price: 0.98, aisle: "Aisle 1 - Peppers" },
          Kroger: { price: 1.20, aisle: "Produce Bins" },
          Walmart: { price: 0.88, aisle: "Produce Section" },
          'Trader Joes': { price: 1.49, aisle: "Produce Section" },
          Aldi: { price: 0.89, aisle: "Produce Wall" }
        }
      },
      { 
        name: "Cream Cheese (8oz)", 
        amount: 1, 
        unit: "block", 
        storePrices: {
          HEB: { price: 2.18, aisle: "Aisle 4 - Dairy Case" },
          Kroger: { price: 2.39, aisle: "Dairy Row" },
          Walmart: { price: 1.96, aisle: "Dairy Wall" },
          'Trader Joes': { price: 2.49, aisle: "Dairy" },
          Aldi: { price: 1.79, aisle: "Cooler 2" }
        }
      },
      { 
        name: "Thin-Cut Bacon (12oz)", 
        amount: 1, 
        unit: "pack", 
        storePrices: {
          HEB: { price: 5.48, aisle: "Aisle 2 - Pork & Bacon" },
          Kroger: { price: 5.99, aisle: "Bacon Wall" },
          Walmart: { price: 4.98, aisle: "Meat Wall" },
          'Trader Joes': { price: 6.49, aisle: "Pre-Packaged Meats" },
          Aldi: { price: 4.49, aisle: "Cooler 3" }
        }
      }
    ],
    instructions: "1. Slice jalapeños in half lengthwise and deseed.\n2. Stuff with cold cream cheese mixed with garlic powder.\n3. Wrap tightly with thin-cut bacon and grill over indirect heat (375°F) for 20-25 mins until crisp.",
    timesUsed: 4
  }
];

const INITIAL_PANTRY: PantryItem[] = [
  {
    id: 'p1',
    name: 'Sandwich Zip Bags',
    category: 'Paper & Plastic',
    inStock: true,
    storePrices: {
      HEB: { price: 3.48, aisle: "Aisle 11 - Household" },
      Kroger: { price: 3.79, aisle: "Aisle 8 - Paper" },
      Walmart: { price: 3.18, aisle: "Paper Goods" },
      'Trader Joes': { price: 3.99, aisle: "Household" },
      Aldi: { price: 2.99, aisle: "Aisle 1" }
    }
  },
  {
    id: 'p2',
    name: 'Paper Towels (12 PK)',
    category: 'Paper & Plastic',
    inStock: false,
    storePrices: {
      HEB: { price: 18.98, aisle: "Aisle 11 - Household" },
      Kroger: { price: 19.49, aisle: "Paper Aisle" },
      Walmart: { price: 17.98, aisle: "Paper Goods" },
      'Trader Joes': { price: 19.99, aisle: "Household" },
      Aldi: { price: 15.99, aisle: "Aisle 1" }
    }
  }
];

const BRAND_STORES: StoreOption[] = ['HEB', 'Walmart', 'Kroger', 'Trader Joes', 'Aldi'];
const REPEAT_DINNER_OPTIONS = ['Tacos', 'Pasta night', 'Chicken & rice', 'Burgers', 'Pizza night', 'Curry', 'Chili', 'Stir-fry', 'Salmon', 'Big salads', 'Soup', 'Mac & cheese'];
const FOOD_LOVE_SKIP_OPTIONS = ['Chicken', 'Pasta', 'Tacos', 'Pizza', 'Burgers', 'Beef', 'Salmon', 'Shrimp', 'Stir-fry', 'Rice bowls', 'Mushrooms', 'Olives', 'Cilantro', 'Very spicy', 'Shellfish', 'Fish', 'Onions', 'Tomatoes', 'Eggplant', 'Pork'];
const DIET_OPTIONS = ['No restrictions', 'High-protein', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Heart-healthy', 'Low-sodium', 'Paleo'];

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

// ==================== MAIN COMPONENT ====================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => localStorage.getItem('simma_logged_in') === 'true');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // USER PROFILE
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('simma_profile_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      name: 'Brandon Navarre',
      email: 'brandon@navarre.com',
      adults: 2,
      kids: 2,
      weeklyBudget: 175,
      goals: ['Spend less on groceries', 'Cook at home more', 'Decide dinner for me'],
      selectedStores: ['HEB', 'Kroger', 'Walmart'],
      preferredStore: 'HEB',
      repeatDinners: ['Tacos', 'Pasta night', 'Chicken & rice', 'Burgers', 'Pizza night'],
      lovedFoods: ['Chicken', 'Tacos', 'Burgers'],
      skippedFoods: ['Mushrooms'],
      dietRestrictions: ['No restrictions'],
      zipCode: '75454',
      enableCommunityPool: true,
      completedOnboarding: false
    };
  });

  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [tab, setTab] = useState<ActiveTab>('recipes');

  // APP DATA
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('simma_recipes_v3');
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('simma_pantry_v3');
    return saved ? JSON.parse(saved) : INITIAL_PANTRY;
  });

  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showCommunityInfo, setShowCommunityInfo] = useState<boolean>(false);

  // AI & DISCOVER SEARCH STATES
  const [internalSearch, setInternalSearch] = useState('');
  const [webImportUrl, setWebImportUrl] = useState('');
  const [aiChefPrompt, setAiChefPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedRecipe, setAiGeneratedRecipe] = useState<Recipe | null>(null);

  // SAVE PERSISTENCE
  useEffect(() => { localStorage.setItem('simma_logged_in', String(isLoggedIn)); }, [isLoggedIn]);
  useEffect(() => { localStorage.setItem('simma_profile_v3', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('simma_recipes_v3', JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { localStorage.setItem('simma_pantry_v3', JSON.stringify(pantryItems)); }, [pantryItems]);

  // RECIPE MULTIPLIER UPDATE
  const updateRecipeMultiplier = (recipeId: string, mult: number) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, currentMultiplier: mult } : r));
  };

  const togglePantryStock = (id: string) => {
    setPantryItems(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  // DYNAMIC GROCERY COMPUTATION
  const computedGroceryList = useMemo(() => {
    const mode = profile.preferredStore;
    const isCommunity = profile.enableCommunityPool;

    const list: GroceryItem[] = [];

    recipes.forEach(recipe => {
      const mult = recipe.currentMultiplier || 1;

      recipe.ingredients.forEach(ing => {
        let chosenStore: StoreOption = 'HEB';
        let storeData: StoreInfo = ing.storePrices.HEB;

        if (mode === 'Cheapest') {
          let lowestPrice = Infinity;
          profile.selectedStores.forEach(s => {
            if (ing.storePrices[s] && ing.storePrices[s].price < lowestPrice) {
              lowestPrice = ing.storePrices[s].price;
              chosenStore = s;
              storeData = ing.storePrices[s];
            }
          });
        } else {
          chosenStore = mode as StoreOption;
          storeData = ing.storePrices[chosenStore] || ing.storePrices.HEB;
        }

        let price = storeData.price * mult;
        let aisle = storeData.aisle;
        let isComm = false;

        if (isCommunity && chosenStore === 'HEB' && ing.name.includes("Chicken")) {
          price = Math.max(1.0, price - 0.50);
          aisle = `${storeData.aisle} (Verified by Zip ${profile.zipCode})`;
          isComm = true;
        }

        list.push({
          id: `${recipe.id}-${ing.name}`,
          name: ing.name,
          category: recipe.category,
          aisle: aisle,
          quantity: `${ing.amount * mult} ${ing.unit}`,
          price: price,
          store: chosenStore,
          checked: false,
          isCommunityPrice: isComm
        });
      });
    });

    // Add Out-of-Stock Pantry Items to Grocery List
    pantryItems.filter(p => !p.inStock).forEach(p => {
      const chosenStore = mode === 'Cheapest' ? 'HEB' : (mode as StoreOption);
      const storeData = p.storePrices[chosenStore] || p.storePrices.HEB;

      list.push({
        id: `pantry-${p.id}`,
        name: p.name,
        category: p.category,
        aisle: `${storeData.aisle} (Pantry Staple)`,
        quantity: '1 pk',
        price: storeData.price,
        store: chosenStore,
        checked: false
      });
    });

    return list;
  }, [recipes, pantryItems, profile.preferredStore, profile.selectedStores, profile.enableCommunityPool, profile.zipCode]);

  const totalGroceryCost = useMemo(() => {
    return computedGroceryList.reduce((sum, item) => sum + item.price, 0);
  }, [computedGroceryList]);

  // AI CHEF GENERATOR
  const generateAiRecipe = () => {
    if (!aiChefPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      const newRec: Recipe = {
        id: `ai_${Date.now()}`,
        title: `AI Special: ${aiChefPrompt.slice(0, 25)}...`,
        category: "Custom AI Dish",
        prepTime: "30 mins",
        dietTags: ["AI Private Chef", "Custom"],
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        favorite: false,
        baseServings: profile.adults + profile.kids,
        currentMultiplier: 1,
        nutrition: { calories: 480, protein: 32, carbs: 38, fat: 18 },
        ingredients: [
          { 
            name: "Main Ingredient Choice", 
            amount: 1, 
            unit: "lb", 
            storePrices: { HEB: { price: 6.99, aisle: "Aisle 2" }, Kroger: { price: 7.29, aisle: "Fresh" }, Walmart: { price: 6.49, aisle: "Meat" }, 'Trader Joes': { price: 7.49, aisle: "Meats" }, Aldi: { price: 5.99, aisle: "Cooler" } } 
          },
          { 
            name: "Seasonal Fresh Vegetables", 
            amount: 2, 
            unit: "cups", 
            storePrices: { HEB: { price: 2.49, aisle: "Aisle 1 - Produce" }, Kroger: { price: 2.79, aisle: "Produce" }, Walmart: { price: 2.19, aisle: "Produce" }, 'Trader Joes': { price: 2.99, aisle: "Veggies" }, Aldi: { price: 1.99, aisle: "Produce" } } 
          }
        ],
        instructions: `1. Prepare ingredients based on '${aiChefPrompt}'.\n2. Sauté in medium heat until tender.\n3. Serve warm and enjoy your customized private chef recipe!`,
        timesUsed: 1
      };
      setAiGeneratedRecipe(newRec);
      setAiLoading(false);
    }, 1200);
  };

  const addAiRecipeToVault = () => {
    if (aiGeneratedRecipe) {
      setRecipes(prev => [aiGeneratedRecipe, ...prev]);
      setAiGeneratedRecipe(null);
      setAiChefPrompt('');
      setTab('recipes');
    }
  };

  // EDIT RECIPE HANDLER
  const handleSaveRecipeEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe) return;
    setRecipes(prev => prev.map(r => r.id === editingRecipe.id ? editingRecipe : r));
    setEditingRecipe(null);
  };

  // 1. AUTH SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col justify-center items-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-[#F5EDE3] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <SimmaLogo className="h-12 justify-center" />
            <p className="text-sm text-stone-500 font-semibold pt-1">Good Food Comes Together</p>
          </div>

          <div className="flex bg-[#F5EDE3]/60 p-1 rounded-2xl border border-[#F5EDE3]">
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'login' ? 'bg-[#55624F] text-white' : 'text-[#55624F]'}`}>Log In</button>
            <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'signup' ? 'bg-[#55624F] text-white' : 'text-[#55624F]'}`}>Sign Up</button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#55624F] mb-1">Email Address</label>
              <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="brandon@example.com" className="w-full p-3 border border-[#F5EDE3] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#55624F]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#55624F] mb-1">Password</label>
              <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 border border-[#F5EDE3] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#55624F]" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-[#C76F42] text-white rounded-xl text-sm font-extrabold shadow-md hover:bg-[#B35E33] transition flex items-center justify-center gap-2">
              {authMode === 'login' ? 'Log In to Simma' : 'Create Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. FULL 8-STEP ONBOARDING WIZARD
  if (!profile.completedOnboarding) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col justify-center items-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-6 md:p-8 border border-[#F5EDE3] shadow-xl space-y-6">
          
          <div className="flex justify-between items-center border-b border-[#F5EDE3] pb-4">
            <SimmaLogo className="h-7" />
            <span className="text-xs font-extrabold text-[#7F8F6B] bg-[#F5EDE3] px-3 py-1 rounded-full">{onboardingStep} of 8</span>
          </div>

          {/* STEP 1: WHO ARE YOU COOKING FOR? */}
          {onboardingStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Who are you cooking for?</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#FCFAF7] rounded-2xl border border-[#F5EDE3]">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2E2E2E]">Adults</h4>
                    <p className="text-xs text-stone-400">Ages 13 and up</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setProfile(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="w-8 h-8 rounded-full bg-stone-200 font-bold text-stone-700 flex items-center justify-center">-</button>
                    <span className="font-extrabold text-base">{profile.adults}</span>
                    <button onClick={() => setProfile(p => ({ ...p, adults: p.adults + 1 }))} className="w-8 h-8 rounded-full bg-[#55624F] text-white font-bold flex items-center justify-center">+</button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-[#FCFAF7] rounded-2xl border border-[#F5EDE3]">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2E2E2E]">Kids</h4>
                    <p className="text-xs text-stone-400">Under 13</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setProfile(p => ({ ...p, kids: Math.max(0, p.kids - 1) }))} className="w-8 h-8 rounded-full bg-stone-200 font-bold text-stone-700 flex items-center justify-center">-</button>
                    <span className="font-extrabold text-base">{profile.kids}</span>
                    <button onClick={() => setProfile(p => ({ ...p, kids: p.kids + 1 }))} className="w-8 h-8 rounded-full bg-[#55624F] text-white font-bold flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>

              <button onClick={() => setOnboardingStep(2)} className="w-full py-3.5 bg-[#55624F] text-white rounded-xl font-bold shadow-md">Continue ›</button>
            </div>
          )}

          {/* STEP 2: GOALS */}
          {onboardingStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">What do you want Simma to help with?</h2>
              <p className="text-xs text-stone-500">Pick all that apply.</p>

              <div className="space-y-2.5">
                {[
                  { title: "Spend less on groceries", sub: "Cheapest store for your week" },
                  { title: "Cook at home more", sub: "Order takeout less often" },
                  { title: "Use what I already have", sub: "Know what's in your pantry" },
                  { title: "Decide dinner for me", sub: "A plan ready every week" },
                  { title: "Get the household on board", sub: "One shared plan and list" }
                ].map(g => {
                  const sel = profile.goals.includes(g.title);
                  return (
                    <div 
                      key={g.title}
                      onClick={() => {
                        setProfile(p => ({
                          ...p,
                          goals: sel ? p.goals.filter(x => x !== g.title) : [...p.goals, g.title]
                        }));
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex justify-between items-center ${sel ? 'bg-[#7F8F6B]/10 border-[#7F8F6B]' : 'bg-[#FCFAF7] border-[#F5EDE3]'}`}
                    >
                      <div>
                        <h4 className="font-extrabold text-xs text-[#2E2E2E]">{g.title}</h4>
                        <p className="text-[11px] text-stone-500">{g.sub}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${sel ? 'bg-[#55624F] border-[#55624F] text-white' : 'border-stone-300'}`}>
                        {sel && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setOnboardingStep(1)} className="py-3 px-4 border border-[#F5EDE3] font-bold text-xs rounded-xl">Back</button>
                <button onClick={() => setOnboardingStep(3)} className="flex-1 py-3 bg-[#55624F] text-white rounded-xl text-xs font-bold shadow-md">Continue ›</button>
              </div>
            </div>
          )}

          {/* STEP 3: WHERE DO YOU SHOP? */}
          {onboardingStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Where do you shop?</h2>
              <p className="text-xs text-stone-500">Pick up to 3 stores. We'll price your list at each one.</p>

              <div className="grid grid-cols-2 gap-3">
                {BRAND_STORES.map(s => {
                  const sel = profile.selectedStores.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setProfile(p => ({
                          ...p,
                          selectedStores: sel ? p.selectedStores.filter(x => x !== s) : [...p.selectedStores, s]
                        }));
                      }}
                      className={`p-4 rounded-2xl border font-extrabold text-sm flex items-center justify-between transition ${sel ? 'border-[#55624F] bg-[#55624F]/10 text-[#55624F]' : 'border-[#F5EDE3] bg-[#FCFAF7] text-[#2E2E2E]'}`}
                    >
                      <span>{s}</span>
                      {sel && <CheckCircle2 className="w-4 h-4 text-[#55624F]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setOnboardingStep(2)} className="py-3 px-4 border border-[#F5EDE3] font-bold text-xs rounded-xl">Back</button>
                <button onClick={() => setOnboardingStep(4)} className="flex-1 py-3 bg-[#55624F] text-white rounded-xl text-xs font-bold shadow-md">Continue ›</button>
              </div>
            </div>
          )}

          {/* STEP 4: REPEAT DINNERS */}
          {onboardingStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">What's on repeat at your house?</h2>
              <p className="text-xs text-stone-500">Pick your go-to dinners. We'll plan around them.</p>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                {REPEAT_DINNER_OPTIONS.map(d => {
                  const sel = profile.repeatDinners.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        setProfile(p => ({
                          ...p,
                          repeatDinners: sel ? p.repeatDinners.filter(x => x !== d) : [...p.repeatDinners, d]
                        }));
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex justify-between items-center ${sel ? 'bg-[#7F8F6B]/20 border-[#7F8F6B] text-[#55624F]' : 'bg-[#FCFAF7] border-[#F5EDE3] text-[#2E2E2E]'}`}
                    >
                      <span>{d}</span>
                      {sel && <Check className="w-3.5 h-3.5 text-[#55624F]" />}
                    </button>
                  );
                })}
              </div>

              <div className="bg-[#FCFAF7] p-3 rounded-2xl border border-[#F5EDE3] flex items-center gap-2 text-xs text-[#55624F]">
                <Sparkles className="w-4 h-4 text-[#C76F42]" />
                <span>{profile.repeatDinners.length} picked for your weekly rotation</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setOnboardingStep(3)} className="py-3 px-4 border border-[#F5EDE3] font-bold text-xs rounded-xl">Back</button>
                <button onClick={() => setOnboardingStep(5)} className="flex-1 py-3 bg-[#55624F] text-white rounded-xl text-xs font-bold shadow-md">Continue ›</button>
              </div>
            </div>
          )}

          {/* STEP 5: LOVE / SKIP FOODS */}
          {onboardingStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Any foods you love or skip?</h2>

              <div className="space-y-3">
                <span className="text-xs font-extrabold text-[#7F8F6B] flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> Love</span>
                <div className="flex flex-wrap gap-1.5">
                  {FOOD_LOVE_SKIP_OPTIONS.slice(0, 10).map(f => {
                    const sel = profile.lovedFoods.includes(f);
                    return (
                      <button
                        key={f}
                        onClick={() => {
                          setProfile(p => ({
                            ...p,
                            lovedFoods: sel ? p.lovedFoods.filter(x => x !== f) : [...p.lovedFoods, f],
                            skippedFoods: p.skippedFoods.filter(x => x !== f)
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${sel ? 'bg-[#7F8F6B] text-white border-[#7F8F6B]' : 'bg-white text-[#2E2E2E] border-[#F5EDE3]'}`}
                      >
                        {f} {sel && '✓'}
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-extrabold text-[#C76F42] flex items-center gap-1 pt-2"><ThumbsDown className="w-3.5 h-3.5" /> Skip / Dislike</span>
                <div className="flex flex-wrap gap-1.5">
                  {FOOD_LOVE_SKIP_OPTIONS.slice(10).map(f => {
                    const sel = profile.skippedFoods.includes(f);
                    return (
                      <button
                        key={f}
                        onClick={() => {
                          setProfile(p => ({
                            ...p,
                            skippedFoods: sel ? p.skippedFoods.filter(x => x !== f) : [...p.skippedFoods, f],
                            lovedFoods: p.lovedFoods.filter(x => x !== f)
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${sel ? 'bg-[#C76F42] text-white border-[#C76F42]' : 'bg-white text-[#2E2E2E] border-[#F5EDE3]'}`}
                      >
                        {f} {sel && '✕'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {profile.skippedFoods.includes('Mushrooms') && (
                <div className="bg-[#F5EDE3] p-3 rounded-2xl text-xs font-bold text-[#C76F42]">
                  Noted. No mushrooms, ever. 🚫
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setOnboardingStep(4)} className="py-3 px-4 border border-[#F5EDE3] font-bold text-xs rounded-xl">Back</button>
                <button onClick={() => setOnboardingStep(6)} className="flex-1 py-3 bg-[#55624F] text-white rounded-xl text-xs font-bold shadow-md">Continue ›</button>
              </div>
            </div>
          )}

          {/* STEP 6: DIET RESTRICTIONS */}
          {onboardingStep === 6 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Any diets we should follow?</h2>
              <p className="text-xs text-stone-500">We'll only suggest recipes that fit.</p>

              <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto">
                {DIET_OPTIONS.map(d => {
                  const sel = profile.dietRestrictions.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => {
                        setProfile(p => ({
                          ...p,
                          dietRestrictions: sel ? p.dietRestrictions.filter(x => x !== d) : [...p.dietRestrictions, d]
                        }));
                      }}
                      className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${sel ? 'bg-[#55624F] text-white border-[#55624F]' : 'bg-[#FCFAF7] text-[#2E2E2E] border-[#F5EDE3]'}`}
                    >
                      <span>{d}</span>
                      {sel && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setOnboardingStep(5)} className="py-3 px-4 border border-[#F5EDE3] font-bold text-xs rounded-xl">Back</button>
                <button onClick={() => setOnboardingStep(7)} className="flex-1 py-3 bg-[#55624F] text-white rounded-xl text-xs font-bold shadow-md">Continue ›</button>
              </div>
            </div>
          )}

          {/* STEP 7: YOU'RE ALL SET SUMMARY CARD */}
          {onboardingStep === 7 && (
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold tracking-widest text-[#7F8F6B] uppercase">YOUR SIMMA PLAN</span>
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">You're all set!</h2>
              <p className="text-xs text-stone-500">Here's how Simma will run your week.</p>

              <div className="bg-[#FCFAF7] p-4 rounded-3xl border border-[#F5EDE3] space-y-3">
                <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-[#F5EDE3]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7F8F6B]">Cheapest Store Choice</span>
                    <h4 className="font-extrabold text-sm text-[#2E2E2E]">H-E-B • ${totalGroceryCost.toFixed(2)}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-[#C76F42]">${(totalGroceryCost / (profile.adults + profile.kids)).toFixed(2)} / plate</span>
                </div>

                <ul className="text-xs space-y-2 text-stone-600 font-medium">
                  <li className="flex items-center gap-2"><Utensils className="w-4 h-4 text-[#55624F]" /> Scaled for {profile.adults + profile.kids} family members</li>
                  <li className="flex items-center gap-2"><Store className="w-4 h-4 text-[#55624F]" /> Dynamic single-store aisle mapping</li>
                  <li className="flex items-center gap-2"><Package className="w-4 h-4 text-[#55624F]" /> Pantry synchronization enabled</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setOnboardingStep(6)} className="py-3 px-4 border border-[#F5EDE3] font-bold text-xs rounded-xl">Back</button>
                <button onClick={() => setOnboardingStep(8)} className="flex-1 py-3 bg-[#C76F42] text-white rounded-xl text-xs font-bold shadow-md">Unlock Full Vault ›</button>
              </div>
            </div>
          )}

          {/* STEP 8: PAYWALL / TRIAL CARD */}
          {onboardingStep === 8 && (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Unlock Simma Premium</h2>
              <p className="text-xs text-stone-500">Access multi-store aisle mapping, crowdsourced pricing, and AI private chef.</p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl border-2 border-[#55624F] bg-[#55624F]/5 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] bg-[#55624F] text-white px-2 py-0.5 rounded-full font-bold uppercase">7-Day Free Trial</span>
                    <h4 className="font-extrabold text-base text-[#2E2E2E] mt-1">Annual Subscription</h4>
                    <p className="text-xs text-stone-500">$4.58/mo, billed yearly ($54.99/yr)</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-[#55624F]" />
                </div>

                <div className="p-4 rounded-2xl border border-[#F5EDE3] bg-[#FCFAF7] flex justify-between items-center text-left opacity-70">
                  <div>
                    <h4 className="font-extrabold text-base text-[#2E2E2E]">Monthly Plan</h4>
                    <p className="text-xs text-stone-500">$6.99/mo, billed monthly</p>
                  </div>
                  <Circle className="w-6 h-6 text-stone-300" />
                </div>
              </div>

              <button 
                onClick={() => setProfile(p => ({ ...p, completedOnboarding: true }))} 
                className="w-full py-4 bg-[#C76F42] text-white rounded-2xl text-base font-extrabold shadow-lg hover:bg-[#B35E33] transition"
              >
                Start My 7-Day Free Trial
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // 3. MAIN APP DASHBOARD
  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#2E2E2E] flex flex-col font-sans pb-24">
      
      {/* BRAND HEADER */}
      <header className="bg-white border-b border-[#F5EDE3] sticky top-0 z-30 shadow-xs px-4 py-3 flex justify-between items-center">
        <SimmaLogo className="h-8" />
        
        <div className="flex items-center gap-3">
          <div className="bg-[#F5EDE3] px-3 py-1 rounded-full text-xs font-bold text-[#55624F] flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {profile.adults + profile.kids} Household
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="p-1.5 text-stone-400 hover:text-[#C76F42]" title="Log Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* COMMUNITY PRICING MODAL EXPLANATION */}
      {showCommunityInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-[#2E2E2E] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#55624F]" /> How Community Pricing Works
              </h3>
              <button onClick={() => setShowCommunityInfo(false)} className="font-bold text-stone-400">✕</button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              When enabled, Simma aggregates crowd-sourced price updates and real-time aisle tags submitted by neighboring shoppers in your local Zip Code (<strong>{profile.zipCode}</strong>).
            </p>
            <button onClick={() => setShowCommunityInfo(false)} className="w-full py-3 bg-[#55624F] text-white font-bold rounded-xl text-xs">Got It</button>
          </div>
        </div>
      )}

      {/* EDIT RECIPE MODAL */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-[#2E2E2E]">Edit Recipe Details</h3>
              <button onClick={() => setEditingRecipe(null)} className="font-bold text-stone-400">✕</button>
            </div>

            <form onSubmit={handleSaveRecipeEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#55624F]">Title</label>
                <input value={editingRecipe.title} onChange={e => setEditingRecipe({ ...editingRecipe, title: e.target.value })} className="w-full p-2.5 border rounded-xl border-[#F5EDE3] font-bold" />
              </div>

              <div>
                <label className="font-bold text-[#55624F]">Image URL</label>
                <input value={editingRecipe.image} onChange={e => setEditingRecipe({ ...editingRecipe, image: e.target.value })} className="w-full p-2.5 border rounded-xl border-[#F5EDE3]" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#55624F]">Prep Time</label>
                  <input value={editingRecipe.prepTime} onChange={e => setEditingRecipe({ ...editingRecipe, prepTime: e.target.value })} className="w-full p-2.5 border rounded-xl border-[#F5EDE3]" />
                </div>
                <div>
                  <label className="font-bold text-[#55624F]">Category</label>
                  <input value={editingRecipe.category} onChange={e => setEditingRecipe({ ...editingRecipe, category: e.target.value })} className="w-full p-2.5 border rounded-xl border-[#F5EDE3]" />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#55624F]">Instructions</label>
                <textarea rows={4} value={editingRecipe.instructions} onChange={e => setEditingRecipe({ ...editingRecipe, instructions: e.target.value })} className="w-full p-2.5 border rounded-xl border-[#F5EDE3]" />
              </div>

              <button type="submit" className="w-full py-3 bg-[#55624F] text-white font-extrabold rounded-xl shadow-md">Save Recipe Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* TAB 1: RECIPES */}
        {tab === 'recipes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2E2E2E]">My Recipe Vault</h2>
                <p className="text-stone-500 text-sm">Individual serving multiplier per recipe</p>
              </div>
              <button onClick={() => setTab('discover')} className="flex items-center gap-2 bg-[#55624F] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs">
                <Plus className="w-4 h-4" /> Add / Discover
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-3xl border border-[#F5EDE3] shadow-xs overflow-hidden flex flex-col">
                  {recipe.image && (
                    <div className="h-44 overflow-hidden relative">
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                      <button onClick={() => setEditingRecipe(recipe)} className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#55624F] p-2 rounded-full border border-[#F5EDE3] shadow-xs" title="Edit Recipe">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-[#2E2E2E]">{recipe.title}</h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#7F8F6B] mt-1">
                        <span>{recipe.prepTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#C76F42]"><Flame className="w-3.5 h-3.5" /> {recipe.nutrition.calories} kcal</span>
                      </div>
                    </div>

                    <div className="bg-[#FCFAF7] p-3 rounded-2xl border border-[#F5EDE3] space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-[#55624F]">Serving Multiplier:</span>
                        <span className="text-xs font-bold text-[#C76F42]">{recipe.baseServings * (recipe.currentMultiplier || 1)} servings</span>
                      </div>
                      <div className="flex gap-1.5">
                        {[0.5, 1, 2, 3, 4].map(mult => (
                          <button
                            key={mult}
                            onClick={() => updateRecipeMultiplier(recipe.id, mult)}
                            className={`flex-1 py-1 text-xs font-extrabold rounded-lg border transition ${recipe.currentMultiplier === mult ? 'bg-[#55624F] text-white border-[#55624F]' : 'bg-white text-[#55624F] border-[#F5EDE3]'}`}
                          >
                            {mult === 0.5 ? '1/2x' : `${mult}x`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F5EDE3] space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#7F8F6B]">Scaled Ingredients:</span>
                      <ul className="text-xs text-stone-600 space-y-1">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{ing.amount * (recipe.currentMultiplier || 1)} {ing.unit} {ing.name}</span>
                            <span className="font-bold text-[#55624F]">${(ing.storePrices[profile.preferredStore === 'Cheapest' ? 'HEB' : profile.preferredStore]?.price * (recipe.currentMultiplier || 1)).toFixed(2)}</span>
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

        {/* TAB 2: PLANNER */}
        {tab === 'planner' && (
          <div className="space-y-6">
            <div className="bg-[#55624F] text-white p-6 rounded-3xl shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold">Weekly Meal Schedule</h2>
                <p className="text-stone-200 text-sm">Organized by loved family rotation</p>
              </div>
            </div>

            <div className="space-y-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                <div key={day} className="bg-white p-4 rounded-2xl border border-[#F5EDE3] shadow-xs flex justify-between items-center">
                  <span className="font-extrabold text-[#55624F] text-base">{day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#FCFAF7] border border-[#F5EDE3] px-3 py-1 rounded-xl font-bold text-[#2E2E2E]">
                      {recipes[0].title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GROCERY */}
        {tab === 'grocery' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Smart Grocery List</h2>
                  <p className="text-stone-500 text-xs">All items priced and mapped specifically to your store choice</p>
                </div>

                <div className="flex items-center gap-2 bg-[#F5EDE3]/60 p-2 rounded-2xl border border-[#F5EDE3]">
                  <Store className="w-4 h-4 text-[#55624F]" />
                  <span className="text-xs font-bold text-[#55624F]">Target Store:</span>
                  <select
                    value={profile.preferredStore}
                    onChange={e => setProfile(p => ({ ...p, preferredStore: e.target.value as StoreMode }))}
                    className="bg-white border border-[#7F8F6B]/30 rounded-xl px-3 py-1 text-xs font-bold focus:outline-none"
                  >
                    <option value="HEB">H-E-B Only (All Items)</option>
                    <option value="Kroger">Kroger Only (All Items)</option>
                    <option value="Walmart">Walmart Only (All Items)</option>
                    <option value="Trader Joes">Trader Joe's Only</option>
                    <option value="Aldi">Aldi Only</option>
                    <option value="Cheapest">Best Multi-Store Price Mix</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#FCFAF7] p-3.5 rounded-2xl border border-[#F5EDE3] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#55624F]" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#2E2E2E]">Community Pricing Pool</span>
                      <button onClick={() => setShowCommunityInfo(true)} className="text-stone-400 hover:text-[#55624F]"><Info className="w-3.5 h-3.5" /></button>
                    </div>
                    <span className="text-[11px] text-stone-400">Zip Code: {profile.zipCode}</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={profile.enableCommunityPool} 
                    onChange={e => setProfile(p => ({ ...p, enableCommunityPool: e.target.checked }))} 
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#55624F]"></div>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#F5EDE3] shadow-xs overflow-hidden">
              <div className="p-4 bg-[#F5EDE3]/40 border-b border-[#F5EDE3] flex justify-between items-center text-xs">
                <span className="font-extrabold text-[#55624F]">
                  Showing All Items Priced For: <span className="text-[#C76F42]">{profile.preferredStore}</span>
                </span>
                <span className="font-extrabold text-base text-[#2E2E2E]">${totalGroceryCost.toFixed(2)}</span>
              </div>

              <div className="divide-y divide-[#F5EDE3]/60">
                {computedGroceryList.map(item => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#FCFAF7] transition">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-[#7F8F6B]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#2E2E2E]">{item.name}</span>
                          {item.isCommunityPrice && (
                            <span className="text-[9px] bg-[#7F8F6B] text-white px-2 py-0.5 rounded-full font-bold">Community Discount</span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">{item.aisle} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-[#2E2E2E]">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PANTRY */}
        {tab === 'pantry' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Household Pantry Staples</h2>
                  <p className="text-xs text-stone-500 mt-1">Out-of-stock items auto-sync to your Grocery list.</p>
                </div>
                <Package className="w-6 h-6 text-[#55624F]" />
              </div>

              <div className="space-y-3 pt-2">
                {pantryItems.map(item => (
                  <div key={item.id} className="p-3.5 bg-[#FCFAF7] rounded-2xl border border-[#F5EDE3] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button onClick={() => togglePantryStock(item.id)}>
                        {item.inStock ? (
                          <div className="w-5 h-5 rounded-full bg-[#7F8F6B] flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-[#C76F42] stroke-[2]" />
                        )}
                      </button>
                      <div>
                        <h4 className="font-bold text-xs text-[#2E2E2E]">{item.name}</h4>
                        <span className="text-[10px] text-stone-400">{item.category}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${item.inStock ? 'bg-[#7F8F6B]/20 text-[#55624F]' : 'bg-[#C76F42]/15 text-[#C76F42]'}`}>
                      {item.inStock ? 'In Stock' : 'Needs Restock'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DISCOVER */}
        {tab === 'discover' && (
          <div className="space-y-6">
            
            {/* CARD 1: PRIVATE CHEF AI RECIPE BUILDER */}
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#C76F42]">
                <Bot className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Private Chef AI Builder</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#2E2E2E]">Generate Custom Recipe</h3>
              <p className="text-xs text-stone-500">Enter ingredients in your fridge or a craving, and AI will construct a full recipe.</p>

              <div className="space-y-3">
                <input 
                  value={aiChefPrompt} 
                  onChange={e => setAiChefPrompt(e.target.value)} 
                  placeholder="e.g. Quick chicken dinner with garlic and jalapeños under 30 mins..." 
                  className="w-full p-3 border rounded-xl text-xs font-bold border-[#F5EDE3]" 
                />
                <button 
                  onClick={generateAiRecipe} 
                  disabled={aiLoading} 
                  className="w-full py-3 bg-[#55624F] text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2"
                >
                  {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Build Recipe with AI
                </button>
              </div>

              {aiGeneratedRecipe && (
                <div className="bg-[#FCFAF7] p-4 rounded-2xl border border-[#F5EDE3] space-y-3 mt-3">
                  <h4 className="font-extrabold text-base text-[#2E2E2E]">{aiGeneratedRecipe.title}</h4>
                  <p className="text-xs text-stone-600">{aiGeneratedRecipe.instructions}</p>
                  <button onClick={addAiRecipeToVault} className="w-full py-2.5 bg-[#C76F42] text-white font-extrabold rounded-xl text-xs shadow-xs">
                    + Add to My Recipe Book
                  </button>
                </div>
              )}
            </div>

            {/* CARD 2: WEB RECIPE IMPORTER */}
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#7F8F6B]">
                <Globe className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Web Importer</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#2E2E2E]">Import Web or TikTok Recipe</h3>
              <div className="flex gap-2">
                <input value={webImportUrl} onChange={e => setWebImportUrl(e.target.value)} placeholder="Paste URL (e.g., foodnetwork.com)..." className="flex-1 p-2.5 border rounded-xl text-xs border-[#F5EDE3]" />
                <button className="bg-[#55624F] text-white px-4 py-2.5 rounded-xl text-xs font-bold">Import</button>
              </div>
            </div>

            {/* CARD 3: INTERNAL RECIPE VAULT SEARCH */}
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#55624F]">
                <Search className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Vault Search</span>
              </div>
              <input value={internalSearch} onChange={e => setInternalSearch(e.target.value)} placeholder="Search saved recipes by title or diet tag..." className="w-full p-2.5 border rounded-xl text-xs border-[#F5EDE3]" />
            </div>

          </div>
        )}

        {/* TAB 6: PREFS */}
        {tab === 'prefs' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-5">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Household Preferences</h2>

              <div className="space-y-3">
                <span className="text-xs font-bold text-[#55624F]">Loved Foods</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.lovedFoods.map(f => (
                    <span key={f} className="bg-[#7F8F6B] text-white px-3 py-1 rounded-full text-xs font-bold">{f}</span>
                  ))}
                </div>

                <span className="text-xs font-bold text-[#C76F42]">Skipped / Disliked Foods</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skippedFoods.map(f => (
                    <span key={f} className="bg-[#C76F42] text-white px-3 py-1 rounded-full text-xs font-bold">{f}</span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F5EDE3]">
                <button onClick={() => setProfile(p => ({ ...p, completedOnboarding: false }))} className="w-full py-3 bg-[#F5EDE3] text-[#55624F] font-bold rounded-xl text-xs">
                  Re-run Onboarding Setup Wizard
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5EDE3] z-40 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-2.5 flex justify-between items-center">
          
          <button onClick={() => setTab('recipes')} className={`flex flex-col items-center gap-1 transition ${tab === 'recipes' ? 'text-[#55624F]' : 'text-stone-400'}`}>
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Recipes</span>
          </button>

          <button onClick={() => setTab('planner')} className={`flex flex-col items-center gap-1 transition ${tab === 'planner' ? 'text-[#55624F]' : 'text-stone-400'}`}>
            <Calendar className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Planner</span>
          </button>

          <button onClick={() => setTab('grocery')} className={`flex flex-col items-center gap-1 transition ${tab === 'grocery' ? 'text-[#55624F]' : 'text-stone-400'}`}>
            <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Grocery</span>
          </button>

          <button onClick={() => setTab('pantry')} className={`flex flex-col items-center gap-1 transition ${tab === 'pantry' ? 'text-[#55624F]' : 'text-stone-400'}`}>
            <Package className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Pantry</span>
          </button>

          <button onClick={() => setTab('discover')} className={`flex flex-col items-center gap-1 transition ${tab === 'discover' ? 'text-[#55624F]' : 'text-stone-400'}`}>
            <Compass className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Discover</span>
          </button>

          <button onClick={() => setTab('prefs')} className={`flex flex-col items-center gap-1 transition ${tab === 'prefs' ? 'text-[#55624F]' : 'text-stone-400'}`}>
            <Settings className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Prefs</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
