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
  Globe, 
  Bot, 
  RefreshCw, 
  Info, 
  Upload, 
  Camera, 
  Filter, 
  CreditCard, 
  MapPin, 
  X
} from 'lucide-react';

// ==================== TYPES & INTERFACES ====================
export type StoreOption = 'HEB' | 'Walmart' | 'Kroger' | 'Trader Joes' | 'Aldi';
export type StoreMode = StoreOption | 'Cheapest';
export type ActiveTab = 'recipes' | 'planner' | 'grocery' | 'pantry' | 'discover' | 'prefs';
export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type DayAction = 'recipe' | 'eat_out' | 'diy' | 'leftovers';

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

export interface MealSlotPlan {
  action: DayAction;
  recipeId?: string;
  customText?: string;
}

export interface DayPlan {
  breakfast: MealSlotPlan;
  lunch: MealSlotPlan;
  dinner: MealSlotPlan;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
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
  tier: 'free' | 'premium';
  completedOnboarding: boolean;
}

// ==================== INITIAL DATA ====================
const INITIAL_RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "H-E-B Copycat Poblano Chicken Lasagna",
    category: "Dinner",
    prepTime: "45 mins",
    dietTags: ["High-Protein", "Comfort Food", "Copycat", "Gluten-Free Option"],
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
    dietTags: ["Keto", "Low-Carb", "High-Protein", "Grill-Friendly"],
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

const DEFAULT_WEEKLY_PLAN: Record<string, DayPlan> = {
  Mon: { breakfast: { action: 'diy', customText: 'Oatmeal & Coffee' }, lunch: { action: 'leftovers', customText: 'Weekend Leftovers' }, dinner: { action: 'recipe', recipeId: 'r1' } },
  Tue: { breakfast: { action: 'diy', customText: 'Eggs & Toast' }, lunch: { action: 'leftovers' }, dinner: { action: 'recipe', recipeId: 'r2' } },
  Wed: { breakfast: { action: 'diy' }, lunch: { action: 'eat_out', customText: 'Lunch with Colleagues' }, dinner: { action: 'recipe', recipeId: 'r1' } },
  Thu: { breakfast: { action: 'diy' }, lunch: { action: 'leftovers' }, dinner: { action: 'diy', customText: 'Taco Thursday' } },
  Fri: { breakfast: { action: 'diy' }, lunch: { action: 'leftovers' }, dinner: { action: 'eat_out', customText: 'Pizza Night' } },
  Sat: { breakfast: { action: 'diy', customText: 'Pancakes' }, lunch: { action: 'diy', customText: 'Grilled Cheese' }, dinner: { action: 'recipe', recipeId: 'r2' } },
  Sun: { breakfast: { action: 'diy' }, lunch: { action: 'leftovers' }, dinner: { action: 'leftovers', customText: 'Family Roast' } }
};

// Auto tag generator helper based on ingredients and nutrition
function generateAutoDietTags(recipe: Partial<Recipe>): string[] {
  const tags = new Set<string>(recipe.dietTags || []);
  const carbs = recipe.nutrition?.carbs || 0;
  const protein = recipe.nutrition?.protein || 0;
  
  if (carbs > 0 && carbs <= 15) tags.add("Keto").add("Low-Carb");
  if (protein >= 30) tags.add("High-Protein");
  
  const ingNames = (recipe.ingredients || []).map(i => i.name.toLowerCase()).join(" ");
  if (!ingNames.includes("beef") && !ingNames.includes("chicken") && !ingNames.includes("pork") && !ingNames.includes("bacon")) {
    tags.add("Vegetarian");
  }
  if (ingNames.includes("poblano") || ingNames.includes("lasagna")) {
    tags.add("Comfort Food");
  }
  return Array.from(tags);
}

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

// ==================== MAIN APP ====================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => localStorage.getItem('simma_logged_in') === 'true');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // USER PROFILE
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('simma_profile_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      name: 'Brandon Navarre',
      email: 'brandon@navarre.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
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
      tier: 'premium',
      completedOnboarding: true
    };
  });

  const [tab, setTab] = useState<ActiveTab>('recipes');

  // RECIPES & PANTRY
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('simma_recipes_v4');
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('simma_pantry_v4');
    return saved ? JSON.parse(saved) : INITIAL_PANTRY;
  });

  // PLANNER STATE
  const [activeMeals, setActiveMeals] = useState<Record<MealType, boolean>>({
    breakfast: true,
    lunch: true,
    dinner: true
  });

  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, DayPlan>>(() => {
    const saved = localStorage.getItem('simma_weekly_plan_v4');
    return saved ? JSON.parse(saved) : DEFAULT_WEEKLY_PLAN;
  });

  // MODAL STATES
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showAddDiscoverModal, setShowAddDiscoverModal] = useState<boolean>(false);
  const [showCommunityInfo, setShowCommunityInfo] = useState<boolean>(false);

  // SORT & FILTER STATES FOR RECIPE VAULT
  const [selectedSortTag, setSelectedSortTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // DISCOVER / AI STATES
  const [aiChefPrompt, setAiChefPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [webImportUrl, setWebImportUrl] = useState('');

  // SAVE PERSISTENCE
  useEffect(() => { localStorage.setItem('simma_logged_in', String(isLoggedIn)); }, [isLoggedIn]);
  useEffect(() => { localStorage.setItem('simma_profile_v4', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('simma_recipes_v4', JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { localStorage.setItem('simma_pantry_v4', JSON.stringify(pantryItems)); }, [pantryItems]);
  useEffect(() => { localStorage.setItem('simma_weekly_plan_v4', JSON.stringify(weeklyPlan)); }, [weeklyPlan]);

  // PHOTO UPLOAD HANDLERS
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(p => ({ ...p, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecipePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingRecipe) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingRecipe({ ...editingRecipe, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // MULTIPLIER UPDATE
  const updateRecipeMultiplier = (recipeId: string, mult: number) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, currentMultiplier: mult } : r));
  };

  const togglePantryStock = (id: string) => {
    setPantryItems(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  // DYNAMIC GROCERY COMPUTATION (EXCLUDES EAT OUT, DIY, LEFTOVERS)
  const computedGroceryList = useMemo(() => {
    const mode = profile.preferredStore;
    const isCommunity = profile.enableCommunityPool;
    const list: GroceryItem[] = [];

    // Collect active recipe IDs from enabled planner slots
    const activeRecipeIds = new Set<string>();
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    days.forEach(day => {
      const dayData = weeklyPlan[day] || DEFAULT_WEEKLY_PLAN[day];
      (['breakfast', 'lunch', 'dinner'] as MealType[]).forEach(meal => {
        if (activeMeals[meal]) {
          const slot = dayData[meal];
          // Skip if 'eat_out', 'diy', or 'leftovers'
          if (slot.action === 'recipe' && slot.recipeId) {
            activeRecipeIds.add(slot.recipeId);
          }
        }
      });
    });

    const recipesToProcess = activeRecipeIds.size > 0 
      ? recipes.filter(r => activeRecipeIds.has(r.id))
      : recipes;

    recipesToProcess.forEach(recipe => {
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

    // Add Out-of-Stock Pantry Items labeled "Added to Cart"
    pantryItems.filter(p => !p.inStock).forEach(p => {
      const chosenStore = mode === 'Cheapest' ? 'HEB' : (mode as StoreOption);
      const storeData = p.storePrices[chosenStore] || p.storePrices.HEB;

      list.push({
        id: `pantry-${p.id}`,
        name: p.name,
        category: p.category,
        aisle: `${storeData.aisle} • Added to Cart`,
        quantity: '1 pk',
        price: storeData.price,
        store: chosenStore,
        checked: false
      });
    });

    return list;
  }, [recipes, pantryItems, weeklyPlan, activeMeals, profile.preferredStore, profile.selectedStores, profile.enableCommunityPool, profile.zipCode]);

  const totalGroceryCost = useMemo(() => {
    return computedGroceryList.reduce((sum, item) => sum + item.price, 0);
  }, [computedGroceryList]);

  // RECIPE FILTERING & SORTING
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.dietTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      if (selectedSortTag === 'All') return matchesSearch;
      if (selectedSortTag === 'Favorites') return matchesSearch && r.favorite;
      return matchesSearch && r.dietTags.includes(selectedSortTag);
    });
  }, [recipes, searchQuery, selectedSortTag]);

  // SAVE EDIT HANDLER
  const handleSaveRecipeEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe) return;
    const updatedWithTags = {
      ...editingRecipe,
      dietTags: generateAutoDietTags(editingRecipe)
    };
    setRecipes(prev => prev.map(r => r.id === updatedWithTags.id ? updatedWithTags : r));
    setEditingRecipe(null);
  };

  // AI CHEF GENERATOR
  const generateAiRecipe = () => {
    if (!aiChefPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      const newRec: Recipe = {
        id: `ai_${Date.now()}`,
        title: `AI Special: ${aiChefPrompt.slice(0, 25)}`,
        category: "Custom AI Dish",
        prepTime: "30 mins",
        dietTags: ["AI Private Chef", "High-Protein", "Custom"],
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        favorite: false,
        baseServings: profile.adults + profile.kids,
        currentMultiplier: 1,
        nutrition: { calories: 480, protein: 34, carbs: 32, fat: 18 },
        ingredients: [
          { 
            name: "Main Ingredient Choice", 
            amount: 1, 
            unit: "lb", 
            storePrices: { HEB: { price: 6.99, aisle: "Aisle 2 - Fresh Meat" }, Kroger: { price: 7.29, aisle: "Fresh Meat" }, Walmart: { price: 6.49, aisle: "Meat Dept" }, 'Trader Joes': { price: 7.49, aisle: "Poultry" }, Aldi: { price: 5.99, aisle: "Cooler" } } 
          },
          { 
            name: "Seasonal Fresh Veggies", 
            amount: 2, 
            unit: "cups", 
            storePrices: { HEB: { price: 2.49, aisle: "Aisle 1 - Produce" }, Kroger: { price: 2.79, aisle: "Produce" }, Walmart: { price: 2.19, aisle: "Produce" }, 'Trader Joes': { price: 2.99, aisle: "Veggies" }, Aldi: { price: 1.99, aisle: "Produce" } } 
          }
        ],
        instructions: `1. Prepare ingredients based on '${aiChefPrompt}'.\n2. Sauté on medium heat until cooked through.\n3. Serve hot and enjoy!`,
        timesUsed: 1
      };
      setRecipes(prev => [newRec, ...prev]);
      setAiLoading(false);
      setShowAddDiscoverModal(false);
      setAiChefPrompt('');
    }, 1000);
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

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#55624F] mb-1">Email Address</label>
              <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="brandon@navarre.com" className="w-full p-3 border border-[#F5EDE3] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#55624F]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#55624F] mb-1">Password</label>
              <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 border border-[#F5EDE3] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#55624F]" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-[#C76F42] text-white rounded-xl text-sm font-extrabold shadow-md hover:bg-[#B35E33] transition flex items-center justify-center gap-2">
              Log In to Simma <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#2E2E2E] flex flex-col font-sans pb-24">
      
      {/* BRAND HEADER */}
      <header className="bg-white border-b border-[#F5EDE3] sticky top-0 z-30 shadow-xs px-4 py-3 flex justify-between items-center">
        <SimmaLogo className="h-8" />
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FCFAF7] border border-[#F5EDE3] px-3 py-1 rounded-full">
            <img src={profile.avatarUrl} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-[#55624F]" />
            <span className="text-xs font-bold text-[#55624F]">{profile.name}</span>
            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${profile.tier === 'premium' ? 'bg-[#C76F42] text-white' : 'bg-stone-200 text-stone-600'}`}>
              {profile.tier}
            </span>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="p-1.5 text-stone-400 hover:text-[#C76F42]" title="Log Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ADD / DISCOVER INLINE MODAL */}
      {showAddDiscoverModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 space-y-5 shadow-xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#F5EDE3] pb-3">
              <h3 className="font-extrabold text-lg text-[#2E2E2E] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#55624F]" /> Add or Discover Recipes
              </h3>
              <button onClick={() => setShowAddDiscoverModal(false)} className="p-1 text-stone-400 hover:text-stone-700 font-bold"><X className="w-5 h-5" /></button>
            </div>

            {/* OPTION 1: AI PRIVATE CHEF */}
            <div className="bg-[#FCFAF7] p-4 rounded-2xl border border-[#F5EDE3] space-y-3">
              <div className="flex items-center gap-2 text-[#C76F42]">
                <Bot className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">AI Private Chef Builder</span>
              </div>
              <p className="text-xs text-stone-500">Describe what you want or ingredients on hand:</p>
              <input 
                value={aiChefPrompt} 
                onChange={e => setAiChefPrompt(e.target.value)} 
                placeholder="e.g. Low-carb chicken with poblano cream sauce under 30 mins..." 
                className="w-full p-2.5 border rounded-xl text-xs font-bold border-[#F5EDE3] focus:outline-none focus:ring-1 focus:ring-[#55624F]" 
              />
              <button 
                onClick={generateAiRecipe} 
                disabled={aiLoading} 
                className="w-full py-2.5 bg-[#55624F] text-white rounded-xl text-xs font-extrabold shadow-xs flex items-center justify-center gap-2"
              >
                {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Create Recipe with AI
              </button>
            </div>

            {/* OPTION 2: WEB IMPORTER */}
            <div className="bg-[#FCFAF7] p-4 rounded-2xl border border-[#F5EDE3] space-y-3">
              <div className="flex items-center gap-2 text-[#7F8F6B]">
                <Globe className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Import Web / TikTok URL</span>
              </div>
              <div className="flex gap-2">
                <input value={webImportUrl} onChange={e => setWebImportUrl(e.target.value)} placeholder="Paste recipe URL here..." className="flex-1 p-2 border rounded-xl text-xs border-[#F5EDE3]" />
                <button onClick={() => { setShowAddDiscoverModal(false); setWebImportUrl(''); }} className="bg-[#55624F] text-white px-3 py-2 rounded-xl text-xs font-bold">Import</button>
              </div>
            </div>

            {/* OPTION 3: MANUAL BLANK FORM */}
            <button 
              onClick={() => {
                const blank: Recipe = {
                  id: `m_${Date.now()}`,
                  title: "My Custom Dish",
                  category: "Dinner",
                  prepTime: "30 mins",
                  dietTags: ["Custom"],
                  image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                  rating: 5.0,
                  favorite: false,
                  baseServings: 4,
                  currentMultiplier: 1,
                  nutrition: { calories: 400, protein: 25, carbs: 30, fat: 15 },
                  ingredients: [
                    { name: "Ingredient 1", amount: 1, unit: "item", storePrices: { HEB: { price: 3.00, aisle: "Aisle 1" }, Kroger: { price: 3.50, aisle: "Aisle 1" }, Walmart: { price: 2.80, aisle: "Aisle 1" }, 'Trader Joes': { price: 3.20, aisle: "Aisle 1" }, Aldi: { price: 2.50, aisle: "Aisle 1" } } }
                  ],
                  instructions: "Add cooking steps here...",
                  timesUsed: 1
                };
                setRecipes(prev => [blank, ...prev]);
                setShowAddDiscoverModal(false);
                setEditingRecipe(blank);
              }}
              className="w-full py-3 border border-dashed border-[#55624F] text-[#55624F] rounded-2xl text-xs font-extrabold hover:bg-[#55624F]/5 transition"
            >
              + Create Blank Manual Recipe
            </button>
          </div>
        </div>
      )}

      {/* COMMUNITY INFO MODAL */}
      {showCommunityInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-[#2E2E2E] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#55624F]" /> Community Pricing Pool
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

      {/* EDIT RECIPE MODAL WITH PHOTO UPLOAD & AUTO TAGS */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#F5EDE3] pb-3">
              <h3 className="font-extrabold text-lg text-[#2E2E2E]">Edit Recipe Details</h3>
              <button onClick={() => setEditingRecipe(null)} className="font-bold text-stone-400">✕</button>
            </div>

            <form onSubmit={handleSaveRecipeEdit} className="space-y-4 text-xs">
              
              {/* PHOTO PREVIEW & UPLOAD BUTTON */}
              <div>
                <label className="font-bold text-[#55624F] block mb-1">Recipe Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#F5EDE3] relative bg-stone-100 flex-shrink-0">
                    {editingRecipe.image ? (
                      <img src={editingRecipe.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400"><Camera className="w-6 h-6" /></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#F5EDE3] text-[#55624F] font-extrabold rounded-xl cursor-pointer hover:bg-[#eadecc] transition">
                      <Upload className="w-4 h-4" /> Upload New Photo
                      <input type="file" accept="image/*" onChange={handleRecipePhotoUpload} className="hidden" />
                    </label>
                    <input 
                      value={editingRecipe.image} 
                      onChange={e => setEditingRecipe({ ...editingRecipe, image: e.target.value })} 
                      placeholder="Or paste Image URL..." 
                      className="w-full p-2 border rounded-xl border-[#F5EDE3] text-[11px]" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#55624F]">Title</label>
                <input value={editingRecipe.title} onChange={e => setEditingRecipe({ ...editingRecipe, title: e.target.value })} className="w-full p-2.5 border rounded-xl border-[#F5EDE3] font-bold" />
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
                <label className="font-bold text-[#55624F]">Dietary Tags (Auto-Assigned & Manual)</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {generateAutoDietTags(editingRecipe).map(tag => (
                    <span key={tag} className="bg-[#7F8F6B] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {tag}
                    </span>
                  ))}
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* TAB 1: RECIPES VAULT */}
        {tab === 'recipes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2E2E2E]">My Recipe Vault</h2>
                <p className="text-stone-500 text-xs">Individual serving scaler & automatic dietary tagging</p>
              </div>
              
              {/* + ADD / DISCOVER BUTTON OPENS INLINE MODAL */}
              <button 
                onClick={() => setShowAddDiscoverModal(true)} 
                className="flex items-center justify-center gap-2 bg-[#55624F] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:bg-[#465241] transition"
              >
                <Plus className="w-4 h-4" /> Add / Discover
              </button>
            </div>

            {/* SEARCH & DIETARY SORT BUTTONS */}
            <div className="space-y-3 bg-white p-4 rounded-3xl border border-[#F5EDE3] shadow-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  placeholder="Search recipes or tags..." 
                  className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-bold border-[#F5EDE3] focus:outline-none focus:ring-1 focus:ring-[#55624F]" 
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[11px] font-extrabold text-[#7F8F6B] flex items-center gap-1 flex-shrink-0"><Filter className="w-3 h-3" /> Sort:</span>
                {['All', 'Favorites', 'High-Protein', 'Keto', 'Low-Carb', 'Gluten-Free', 'Comfort Food', 'Custom'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedSortTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition border ${selectedSortTag === tag ? 'bg-[#55624F] text-white border-[#55624F]' : 'bg-[#FCFAF7] text-stone-600 border-[#F5EDE3]'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* RECIPE CARDS GRID */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-3xl border border-[#F5EDE3] shadow-xs overflow-hidden flex flex-col">
                  {recipe.image && (
                    <div className="h-44 overflow-hidden relative">
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                      <button onClick={() => setEditingRecipe(recipe)} className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#55624F] p-2 rounded-full border border-[#F5EDE3] shadow-xs" title="Edit Recipe & Upload Photo">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-[#2E2E2E]">{recipe.title}</h3>
                      
                      {/* AUTO DIET TAGS */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {recipe.dietTags.map((dt, i) => (
                          <span key={i} className="text-[9px] bg-[#7F8F6B]/15 text-[#55624F] px-2 py-0.5 rounded-md font-extrabold">
                            {dt}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-[#7F8F6B] mt-2">
                        <span>{recipe.prepTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#C76F42]"><Flame className="w-3.5 h-3.5" /> {recipe.nutrition.calories} kcal</span>
                      </div>
                    </div>

                    {/* MULTIPLIER BUTTONS */}
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

        {/* TAB 2: MEAL PLANNER */}
        {tab === 'planner' && (
          <div className="space-y-6">
            
            {/* TOP MEAL TOGGLES */}
            <div className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-3">
              <h2 className="text-xl font-extrabold text-[#2E2E2E]">Weekly Meal Schedule</h2>
              <p className="text-xs text-stone-500">Enable active meal slots & set per-day action options:</p>

              <div className="flex gap-3 pt-1">
                {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setActiveMeals(prev => ({ ...prev, [m]: !prev[m] }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold capitalize border transition ${activeMeals[m] ? 'bg-[#55624F] text-white border-[#55624F]' : 'bg-[#FCFAF7] text-stone-400 border-[#F5EDE3]'}`}
                  >
                    {activeMeals[m] ? '✓ ' : '✕ '} {m}
                  </button>
                ))}
              </div>
            </div>

            {/* DAILY SCHEDULER CARDS */}
            <div className="space-y-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                const dayPlan = weeklyPlan[day] || DEFAULT_WEEKLY_PLAN[day];

                return (
                  <div key={day} className="bg-white p-4 md:p-5 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-3">
                    <div className="flex justify-between items-center border-b border-[#F5EDE3] pb-2">
                      <span className="font-extrabold text-[#55624F] text-lg">{day}</span>
                    </div>

                    <div className="space-y-2.5">
                      {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(meal => {
                        if (!activeMeals[meal]) return null;
                        const slot = dayPlan[meal];

                        return (
                          <div key={meal} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#FCFAF7] rounded-2xl border border-[#F5EDE3]">
                            <span className="text-xs font-extrabold uppercase text-[#7F8F6B] w-20">{meal}</span>

                            <div className="flex-1 flex flex-wrap items-center gap-2">
                              {/* ACTION SELECTOR */}
                              <select
                                value={slot.action}
                                onChange={e => {
                                  const act = e.target.value as DayAction;
                                  setWeeklyPlan(prev => ({
                                    ...prev,
                                    [day]: {
                                      ...prev[day],
                                      [meal]: { ...prev[day][meal], action: act }
                                    }
                                  }));
                                }}
                                className="p-1.5 bg-white border border-[#F5EDE3] rounded-xl text-xs font-bold text-[#2E2E2E]"
                              >
                                <option value="recipe">Planned Recipe</option>
                                <option value="eat_out">Eat Out (Skip List)</option>
                                <option value="diy">DIY / Freestyle (Skip List)</option>
                                <option value="leftovers">Eat Leftovers (Skip List)</option>
                              </select>

                              {/* RECIPE OR CUSTOM TEXT */}
                              {slot.action === 'recipe' ? (
                                <select
                                  value={slot.recipeId || recipes[0]?.id}
                                  onChange={e => {
                                    const rId = e.target.value;
                                    setWeeklyPlan(prev => ({
                                      ...prev,
                                      [day]: {
                                        ...prev[day],
                                        [meal]: { ...prev[day][meal], recipeId: rId }
                                      }
                                    }));
                                  }}
                                  className="flex-1 p-1.5 bg-white border border-[#F5EDE3] rounded-xl text-xs font-bold text-[#55624F]"
                                >
                                  {recipes.map(r => (
                                    <option key={r.id} value={r.id}>{r.title}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="text-xs font-extrabold text-[#C76F42] bg-[#C76F42]/10 px-2.5 py-1 rounded-xl">
                                  {slot.action === 'eat_out' && '🍔 Eat Out'}
                                  {slot.action === 'diy' && '🥗 Freestyle DIY'}
                                  {slot.action === 'leftovers' && '🍲 Leftovers'}
                                </span>
                              )}
                            </div>
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

        {/* TAB 3: GROCERY */}
        {tab === 'grocery' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Smart Grocery List</h2>
                  <p className="text-stone-500 text-xs">Priced and aisle-mapped specifically for your selected store</p>
                </div>

                {/* PRICING STORE SELECTOR (UPDATED WORDING FROM TARGET STORE) */}
                <div className="flex items-center gap-2 bg-[#F5EDE3]/60 p-2 rounded-2xl border border-[#F5EDE3]">
                  <Store className="w-4 h-4 text-[#55624F]" />
                  <span className="text-xs font-bold text-[#55624F]">Pricing Store:</span>
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

              {/* COMMUNITY POOL TOGGLE */}
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

            {/* LIST DATA DISPLAY */}
            <div className="bg-white rounded-3xl border border-[#F5EDE3] shadow-xs overflow-hidden">
              <div className="p-4 bg-[#F5EDE3]/40 border-b border-[#F5EDE3] flex justify-between items-center text-xs">
                <span className="font-extrabold text-[#55624F]">
                  Priced At: <span className="text-[#C76F42]">{profile.preferredStore}</span>
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
                        {/* UPDATED WORDING: "Added to Cart" FOR PANTRY STAPLES */}
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
                  <p className="text-xs text-stone-500 mt-1">Out-of-stock items auto-sync to grocery list with "Added to Cart" tag.</p>
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
                    {/* UPDATED WORDING: "Added to Cart" WHEN OUT OF STOCK */}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${item.inStock ? 'bg-[#7F8F6B]/20 text-[#55624F]' : 'bg-[#C76F42]/15 text-[#C76F42]'}`}>
                      {item.inStock ? 'In Stock' : 'Added to Cart'}
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
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-4">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Discover & AI Hub</h2>
              <p className="text-xs text-stone-500">Search community database or build custom meals with AI.</p>
              
              <button 
                onClick={() => setShowAddDiscoverModal(true)} 
                className="w-full py-3.5 bg-[#55624F] text-white rounded-xl text-xs font-extrabold shadow-md"
              >
                Launch AI Private Chef & Web Importer Modal
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: PREFERENCES (EXPANDED EDIT OPTIONS) */}
        {tab === 'prefs' && (
          <div className="space-y-6">
            
            {/* SECTION 1: PROFILE & AVATAR EDIT */}
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-4">
              <h3 className="text-lg font-extrabold text-[#2E2E2E]">User Profile & Photo</h3>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#55624F]">
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer transition">
                    <Camera className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5EDE3] text-[#55624F] font-extrabold rounded-xl text-xs cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Small Circle Photo
                    <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                  </label>
                  <input 
                    value={profile.name} 
                    onChange={e => setProfile({ ...profile, name: e.target.value })} 
                    className="w-full p-2 border rounded-xl text-xs font-bold border-[#F5EDE3]" 
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: SUBSCRIPTION TIER SELECTOR */}
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-3">
              <h3 className="text-lg font-extrabold text-[#2E2E2E] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C76F42]" /> Membership Plan Tier
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setProfile({ ...profile, tier: 'free' })}
                  className={`p-4 rounded-2xl border text-left transition ${profile.tier === 'free' ? 'border-[#55624F] bg-[#55624F]/10' : 'border-[#F5EDE3] bg-[#FCFAF7]'}`}
                >
                  <span className="text-xs font-extrabold text-[#2E2E2E] block">Free Version</span>
                  <span className="text-[10px] text-stone-500">Basic recipe vault & single store planning</span>
                </button>

                <button
                  onClick={() => setProfile({ ...profile, tier: 'premium' })}
                  className={`p-4 rounded-2xl border text-left transition ${profile.tier === 'premium' ? 'border-[#C76F42] bg-[#C76F42]/10' : 'border-[#F5EDE3] bg-[#FCFAF7]'}`}
                >
                  <span className="text-xs font-extrabold text-[#C76F42] block">AI Premium Tier</span>
                  <span className="text-[10px] text-stone-500">$6.99/mo • AI Private Chef & Multi-Store Pricing</span>
                </button>
              </div>
            </div>

            {/* SECTION 3: ZIP CODE FOR TRAVELING/VISITING */}
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-3">
              <h3 className="text-lg font-extrabold text-[#2E2E2E] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#55624F]" /> Location / Visiting Zip Code
              </h3>
              <p className="text-xs text-stone-500">Change your zip code when visiting somewhere to pull local store prices:</p>
              <input 
                value={profile.zipCode} 
                onChange={e => setProfile({ ...profile, zipCode: e.target.value })} 
                placeholder="75454" 
                className="w-full p-2.5 border rounded-xl text-xs font-bold border-[#F5EDE3]" 
              />
            </div>

            {/* SECTION 4: FOOD PREFERENCES & DIETS */}
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs space-y-4">
              <h3 className="text-lg font-extrabold text-[#2E2E2E]">Household Food Preferences</h3>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#55624F]">Loved Foods</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.lovedFoods.map(f => (
                    <span key={f} className="bg-[#7F8F6B] text-white px-3 py-1 rounded-full text-xs font-bold">{f}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#C76F42]">Skipped / Disliked Foods</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skippedFoods.map(f => (
                    <span key={f} className="bg-[#C76F42] text-white px-3 py-1 rounded-full text-xs font-bold">{f}</span>
                  ))}
                </div>
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
