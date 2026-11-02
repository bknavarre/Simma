import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// ==================== TYPES & INTERFACES ====================
type PrimaryStore = 'HEB' | 'Walmart' | 'Kroger';
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
  imgScan?: number;
}

interface PantryItem {
  id: string;
  name: string;
  category: string;
  inStock: boolean;
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

const defaultAisles: Record<string, number> = {
  "Produce": 1, "Meat & Seafood": 5, "Dairy & Eggs": 8, "Bakery": 10,
  "Frozen": 12, "Pantry / Canned": 14, "Spices & Baking": 16,
  "Beverages": 18, "Snacks": 20, "Other": 99
};

const sampleRecipes: Recipe[] = [
  { id: "r1", title: "Lemon Garlic Chicken & Broccoli", category: "Dinner", dietTags: ["High-Protein", "Low-Carb", "Heart-Healthy"], image: null, url: null, rating: 4.5, favorite: true, baseServings: 4, nutrition: { calories: 420, protein: 42, carbs: 12, fat: 22, fiber: 5 }, ingredients: [ { name: "Chicken breast", amount: 1.5, unit: "lb", aisle: "Meat & Seafood" }, { name: "Broccoli florets", amount: 4, unit: "cups", aisle: "Produce" }, { name: "Garlic", amount: 4, unit: "cloves", aisle: "Produce" }, { name: "Lemon", amount: 2, unit: "", aisle: "Produce" }, { name: "Olive oil", amount: 2, unit: "tbsp", aisle: "Pantry / Canned" } ], instructions: "1. Season chicken with salt, pepper, garlic.\n2. Sear in olive oil 5-6 min per side.\n3. Add broccoli and lemon juice, cover 4 min.\n4. Serve hot.", timesUsed: 3 },
  { id: "r2", title: "H-E-B Copycat Poblano Chicken Lasagna", category: "Dinner", dietTags: ["High-Protein", "Comfort Food"], image: null, url: null, rating: 4.8, favorite: true, baseServings: 6, nutrition: { calories: 520, protein: 38, carbs: 42, fat: 22, fiber: 4 }, ingredients: [ { name: "Chicken breast", amount: 2, unit: "lb", aisle: "Meat & Seafood" }, { name: "Poblano peppers", amount: 4, unit: "count", aisle: "Produce" }, { name: "Oaxaca cheese", amount: 1, unit: "block", aisle: "Dairy & Eggs" }, { name: "Heavy cream", amount: 1, unit: "carton", aisle: "Dairy & Eggs" }, { name: "Lasagna noodles", amount: 1, unit: "box", aisle: "Pantry / Canned" } ], instructions: "1. Roast poblanos and blend with heavy cream.\n2. Layer cooked shredded chicken, sauce, noodles, and Oaxaca cheese.\n3. Bake at 375°F for 30 minutes until bubbly.", timesUsed: 5 }
];

const emptySlot = (): DaySlot => ({ type: "cook", recipeId: null, note: "" });
const emptyWeek = (): Record<string, DayPlan> => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const w: Record<string, DayPlan> = {};
  days.forEach(d => { w[d] = { breakfast: emptySlot(), lunch: emptySlot(), dinner: emptySlot() }; });
  return w;
};

// ==================== COOKING MODE COMPONENT ====================
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
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [servingMult, setServingMult] = useState<number>(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
  const [plannerMeal, setPlannerMeal] = useState<string>('dinner');
  
  // PANTRY STATE
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    { id: "p1", name: "Sandwich Zip Bags", category: "Paper & Plastic", inStock: false },
    { id: "p2", name: "Gallon Zip Bags", category: "Paper & Plastic", inStock: true },
    { id: "p3", name: "Paper Towels (12 PK)", category: "Paper & Plastic", inStock: true },
    { id: "p4", name: "Trash Bags (13 Gal)", category: "Cleaning & Soap", inStock: false },
    { id: "p5", name: "Dishwasher Pods", category: "Cleaning & Soap", inStock: true }
  ]);
  const [newPantryName, setNewPantryName] = useState('');
  const [newPantryCat, setNewPantryCat] = useState('Paper & Plastic');

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
  const [newDislike, setNewDislike] = useState('');

  // PLANNER WEEKS STATE
  const [weeks, setWeeks] = useState<Record<string, Record<string, DayPlan>>>({
    "current": emptyWeek()
  });

  const togglePantryStock = (id: string) => {
    setPantryItems(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  const addPantryItem = () => {
    if (!newPantryName.trim()) return;
    setPantryItems(prev => [...prev, { id: `p_${Date.now()}`, name: newPantryName.trim(), category: newPantryCat, inStock: true }]);
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
      <header className="bg-white border-b border-[#F5EDE3] sticky top-0 z-30 shadow-xs px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="h-8 w-auto">
            <path d="M 38 22 C 24 36 30 56 48 52 C 48 36 40 22 38 22 Z" fill="#7F8F6B"/>
            <path d="M 62 22 C 76 36 70 56 52 52 C 52 36 60 22 62 22 Z" fill="#C76F42"/>
            <text x="50" y="88" fontFamily="sans-serif" fontSize="44" fontWeight="800" fill="#2E2E2E" textAnchor="middle">S</text>
          </svg>
          <div>
            <span className="font-extrabold text-xl tracking-tight leading-none block">Simma</span>
            <span className="text-[9px] font-bold text-[#7F8F6B] uppercase tracking-wider">{prefs.familyName} Family Kitchen</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F5EDE3]/60 p-1 rounded-xl">
          <span className="text-xs font-bold text-[#55624F] px-1.5">Servings:</span>
          {[1, 2, 3].map(mult => (
            <button key={mult} onClick={() => setServingMult(mult)} className={`px-2 py-0.5 text-xs font-bold rounded-lg ${servingMult === mult ? 'bg-[#55624F] text-white' : 'text-[#55624F]'}`}>
              {mult}x
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 space-y-6">

        {/* TAB 1: RECIPES */}
        {tab === 'recipes' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-[#2E2E2E]">My Recipe Vault</h2>
            <div className="grid gap-4">
              {recipes.map(r => (
                <div key={r.id} onClick={() => setSelectedRecipe(r)} className="bg-white rounded-3xl border border-[#F5EDE3] p-4 shadow-xs cursor-pointer hover:border-[#7F8F6B]/40 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-[#2E2E2E]">{r.title}</h3>
                      <span className="text-xs text-[#7F8F6B] font-semibold">{r.category} • {r.nutrition.calories * servingMult} kcal</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-[#F5EDE3] text-[#C76F42] rounded-full">{r.baseServings * servingMult} Servings</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PLANNER */}
        {tab === 'planner' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#55624F] text-white p-5 rounded-3xl">
              <div>
                <h2 className="text-xl font-extrabold">Weekly Planner</h2>
                <p className="text-xs text-[#F5EDE3]/90 mt-0.5">Meal scheduling & smart autofill</p>
              </div>
              <button onClick={autoFillWeek} className="bg-[#C76F42] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs">✨ Auto Fill</button>
            </div>

            <div className="grid gap-2.5">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                const slot = weeks.current[day]?.dinner;
                const recipe = recipes.find(r => r.id === slot?.recipeId);
                return (
                  <div key={day} className="bg-white p-4 rounded-2xl border border-[#F5EDE3] flex justify-between items-center">
                    <span className="font-extrabold text-sm text-[#55624F] w-12">{day}</span>
                    <span className="text-sm font-semibold flex-1 px-2">{recipe ? recipe.title : 'Open Slot'}</span>
                    <span className="text-xs font-bold text-[#7F8F6B] bg-[#F5EDE3] px-2.5 py-1 rounded-full">{recipe ? 'Cook' : 'Empty'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: GROCERY */}
        {tab === 'grocery' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-[#F5EDE3] shadow-xs">
              <span className="text-xs font-bold text-[#C76F42] uppercase tracking-wider">Multi-Store Grocery List</span>
              <h2 className="text-xl font-extrabold text-[#2E2E2E] mt-0.5">Smart Shopping List</h2>
            </div>

            <div className="bg-white rounded-3xl border border-[#F5EDE3] p-4 space-y-3">
              <h3 className="font-extrabold text-sm text-[#55624F]">Out-of-Stock Household Items</h3>
              {pantryItems.filter(p => !p.inStock).map(p => (
                <div key={p.id} className="flex justify-between items-center p-2.5 bg-[#FCFAF7] rounded-xl border border-[#F5EDE3]">
                  <span className="text-sm font-bold text-[#2E2E2E]">{p.name}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-[#F5EDE3] text-[#C76F42] rounded-full">Need Reorder</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PANTRY */}
        {tab === 'pantry' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Pantry & Household Staples</h2>
              <p className="text-xs text-stone-500 mt-1">Out-of-stock items automatically sync to your Grocery list.</p>
              
              <div className="flex gap-2 mt-4">
                <input value={newPantryName} onChange={e => setNewPantryName(e.target.value)} placeholder="Add staple item..." className="flex-1 px-3.5 py-2 border rounded-xl text-sm" />
                <button onClick={addPantryItem} className="bg-[#55624F] text-white px-4 py-2 rounded-xl text-xs font-bold">+ Add</button>
              </div>
            </div>

            <div className="grid gap-2.5">
              {pantryItems.map(p => (
                <div key={p.id} className="bg-white p-3.5 rounded-2xl border border-[#F5EDE3] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button onClick={() => togglePantryStock(p.id)} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${p.inStock ? 'bg-[#7F8F6B] text-white' : 'border-2 border-[#C76F42]'}`}>
                      {p.inStock ? '✓' : ''}
                    </button>
                    <span className="font-bold text-sm text-[#2E2E2E]">{p.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.inStock ? 'bg-[#7F8F6B]/15 text-[#55624F]' : 'bg-[#F5EDE3] text-[#C76F42]'}`}>
                    {p.inStock ? 'In Stock' : 'Reorder Needed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DISCOVER */}
        {tab === 'discover' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Discover & AI Builder</h2>
              <p className="text-xs text-stone-500 mt-1">Generate custom recipes using Gemini AI</p>
            </div>
          </div>
        )}

        {/* TAB 6: PREFS */}
        {tab === 'prefs' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Preferences & Profile</h2>
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-bold text-[#55624F]">Family Name
                  <input value={prefs.familyName} onChange={e => setPrefs({ ...prefs, familyName: e.target.value })} className="w-full mt-1 p-2 border rounded-xl text-sm" />
                </label>
                <label className="block text-xs font-bold text-[#55624F]">Weekly Budget ($)
                  <input value={prefs.weeklyBudget} onChange={e => setPrefs({ ...prefs, weeklyBudget: e.target.value })} className="w-full mt-1 p-2 border rounded-xl text-sm" />
                </label>
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
              <button onClick={() => setSelectedRecipe(null)} className="font-bold text-stone-400">✕</button>
            </div>
            <p className="text-sm text-stone-600">{selectedRecipe.instructions}</p>
            <button onClick={() => { setCookingRecipe(selectedRecipe); setSelectedRecipe(null); }} className="w-full py-3 bg-[#55624F] text-white font-bold rounded-xl">👩‍🍳 Enter Cooking Mode</button>
          </div>
        </div>
      )}

      {/* COOKING MODE OVERLAY */}
      {cookingRecipe && <CookingMode recipe={cookingRecipe} onClose={() => setCookingRecipe(null)} />}

      {/* BOTTOM NAVIGATION (Recipes / Planner / Grocery / Pantry / Discover / Prefs) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-[#F5EDE3] flex justify-around py-2.5 z-40 shadow-lg">
        {[
          { id: 'recipes', label: 'Recipes' },
          { id: 'planner', label: 'Planner' },
          { id: 'grocery', label: 'Grocery' },
          { id: 'pantry', label: 'Pantry' },
          { id: 'discover', label: 'Discover' },
          { id: 'prefs', label: 'Prefs' }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as ActiveTab)} className={`flex flex-col items-center text-[11px] font-bold ${tab === t.id ? 'text-[#55624F]' : 'text-stone-400'}`}>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
