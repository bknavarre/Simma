import { useState } from 'react';
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
  Flame
} from 'lucide-react';

type PrimaryStore = 'HEB' | 'Kroger' | 'Cheapest';
type ActiveTab = 'recipes' | 'planner' | 'grocery' | 'explore' | 'prefs';

interface PantryItem {
  id: string;
  name: string;
  category: string;
  inStock: boolean;
  store: 'HEB' | 'Kroger';
  estimatedPrice: number;
}

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  aisle: string;
  quantity: string;
  estimatedPrice: number;
  store: 'HEB' | 'Kroger';
  checked: boolean;
  fromPantry?: boolean;
}

interface Recipe {
  id: string;
  title: string;
  category: string;
  prepTime: string;
  servings: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  imageUrl: string;
  tags: string[];
  ingredients: string[];
}

// Simma Logo Component
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

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('recipes');
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);

  // --- PANTRY / STAPLES STATE ---
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    { id: 'p1', name: 'Sandwich Zip Bags', category: 'Paper & Plastic', inStock: false, store: 'HEB', estimatedPrice: 3.48 },
    { id: 'p2', name: 'Gallon Zip Bags', category: 'Paper & Plastic', inStock: true, store: 'HEB', estimatedPrice: 4.28 },
    { id: 'p3', name: 'Paper Towels (12 PK)', category: 'Paper & Plastic', inStock: true, store: 'HEB', estimatedPrice: 18.98 },
    { id: 'p4', name: 'Trash Bags (13 Gal)', category: 'Paper & Plastic', inStock: false, store: 'Kroger', estimatedPrice: 9.99 },
    { id: 'p5', name: 'Dishwasher Pods', category: 'Cleaning', inStock: true, store: 'HEB', estimatedPrice: 14.49 },
    { id: 'p6', name: 'All-Purpose Spray', category: 'Cleaning', inStock: false, store: 'HEB', estimatedPrice: 3.78 },
  ]);

  // --- GROCERY STORE FILTER STATE ---
  const [selectedStoreMode, setSelectedStoreMode] = useState<PrimaryStore>('Cheapest');

  // --- RECIPE DATA ---
  const [recipes] = useState<Recipe[]>([
    {
      id: 'r1',
      title: 'H-E-B Copycat Poblano Chicken Lasagna',
      category: 'Dinner',
      prepTime: '45 mins',
      servings: 6,
      calories: 520,
      protein: '38g',
      carbs: '42g',
      fat: '22g',
      imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80',
      tags: ['Copycat', 'Comfort Food', 'High Protein'],
      ingredients: [
        '2 lbs Boneless Skinless Chicken Breasts',
        '4 Poblano Peppers (roasted & peeled)',
        '1 block Oaxaca Cheese (8oz)',
        '1 carton Heavy Whipping Cream (16oz)',
        '1 box Lasagna Noodles (16oz)'
      ]
    },
    {
      id: 'r2',
      title: 'Bacon-Wrapped Jalapeño Poppers',
      category: 'Appetizers',
      prepTime: '25 mins',
      servings: 4,
      calories: 310,
      protein: '14g',
      carbs: '6g',
      fat: '26g',
      imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80',
      tags: ['Keto', 'Grill Friendly', 'Low Carb'],
      ingredients: [
        '8 Fresh Jalapeños',
        '8 oz Cream Cheese (cold)',
        '1 pack Thin-Cut Bacon',
        '1 tsp Garlic Powder'
      ]
    }
  ]);

  // --- GROCERY LIST DATA ---
  const rawGroceryItems: GroceryItem[] = [
    { id: 'g1', name: 'Boneless Skinless Chicken Breasts', category: 'Meat', aisle: 'Aisle 2 - Poultry', quantity: `${2 * servingMultiplier} lbs`, estimatedPrice: 7.96 * servingMultiplier, store: 'HEB', checked: false },
    { id: 'g2', name: 'Poblano Peppers', category: 'Produce', aisle: 'Aisle 1 - Produce', quantity: `${4 * servingMultiplier} count`, estimatedPrice: 1.48 * servingMultiplier, store: 'HEB', checked: false },
    { id: 'g3', name: 'Oaxaca Cheese (8oz)', category: 'Dairy', aisle: 'Aisle 4 - Cheese', quantity: '1 block', estimatedPrice: 3.89, store: 'HEB', checked: false },
    { id: 'g4', name: 'Heavy Whipping Cream (16oz)', category: 'Dairy', aisle: 'Aisle 4 - Dairy', quantity: '1 carton', estimatedPrice: 2.99, store: 'Kroger', checked: false },
    { id: 'g5', name: 'Lasagna Noodles (16oz)', category: 'Pantry', aisle: 'Aisle 6 - Pasta', quantity: '1 box', estimatedPrice: 1.78, store: 'HEB', checked: false },
  ];

  // Sync Out-of-Stock Pantry Items into Grocery List
  const pantryGroceryItems: GroceryItem[] = pantryItems
    .filter(item => !item.inStock)
    .map(item => ({
      id: `pantry-sync-${item.id}`,
      name: item.name,
      category: item.category,
      aisle: item.store === 'HEB' ? 'Aisle 11 - Household' : 'Aisle 8 - Cleaning',
      quantity: '1 pk',
      estimatedPrice: item.estimatedPrice,
      store: item.store,
      checked: false,
      fromPantry: true
    }));

  const allGroceryItems = [...rawGroceryItems, ...pantryGroceryItems];

  const filteredGroceryItems = allGroceryItems.filter(item => {
    if (selectedStoreMode === 'HEB') return item.store === 'HEB';
    if (selectedStoreMode === 'Kroger') return item.store === 'Kroger';
    return true;
  });

  const togglePantryStock = (id: string) => {
    setPantryItems(prev => prev.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock } : item
    ));
  };

  const calculatedTotal = filteredGroceryItems.reduce((sum, item) => sum + item.estimatedPrice, 0);

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#2E2E2E] flex flex-col font-sans">
      
      {/* SIMMA BRAND HEADER */}
      <header className="bg-white border-b border-[#F5EDE3] sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <SimmaLogo className="h-9" />

          {/* SERVING MULTIPLIER SCALER */}
          <div className="flex items-center gap-2 bg-[#F5EDE3]/60 p-1 rounded-xl border border-[#F5EDE3]">
            <span className="text-xs font-bold text-[#55624F] px-2">Servings:</span>
            {[1, 2, 3].map((mult) => (
              <button
                key={mult}
                onClick={() => setServingMultiplier(mult)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${servingMultiplier === mult ? 'bg-[#55624F] text-white' : 'text-[#55624F] hover:bg-white'}`}
              >
                {mult}x
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-8">
        
        {/* TAB 1: RECIPES */}
        {activeTab === 'recipes' && (
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
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-3xl border border-[#F5EDE3] shadow-xs overflow-hidden hover:border-[#7F8F6B]/40 transition flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#55624F] font-bold text-xs px-3 py-1 rounded-full border border-[#F5EDE3]">
                      {recipe.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-[#2E2E2E]">{recipe.title}</h3>
                      <div className="flex items-center gap-4 text-xs font-semibold text-[#7F8F6B] mt-1">
                        <span>{recipe.prepTime}</span>
                        <span>•</span>
                        <span>{recipe.servings * servingMultiplier} Servings</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#C76F42]"><Flame className="w-3.5 h-3.5" /> {recipe.calories} kcal</span>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {recipe.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold bg-[#F5EDE3] text-[#C76F42] px-2.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#F5EDE3]">
                      <h4 className="text-xs font-bold uppercase text-[#55624F] tracking-wider mb-2">Scaled Ingredients ({servingMultiplier}x):</h4>
                      <ul className="text-xs text-stone-600 space-y-1">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7F8F6B]"></span>
                            {ing}
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
        {activeTab === 'planner' && (
          <div className="space-y-6">
            <div className="bg-[#55624F] text-white p-6 rounded-3xl shadow-sm flex justify-between items-center">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#7F8F6B] bg-white/10 px-3 py-1 rounded-full inline-block mb-2">Meal Schedule</span>
                <h2 className="text-2xl font-extrabold">Weekly Meal Planner</h2>
                <p className="text-sand/90 text-sm mt-1">Drag, swap, or duplicate planned meals for the week</p>
              </div>
              <button className="bg-[#C76F42] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xs hover:bg-[#B35E33] transition">
                + New Week
              </button>
            </div>

            <div className="grid gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                <div key={day} className="bg-white p-4 rounded-2xl border border-[#F5EDE3] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-sm text-[#55624F] w-24">{day}</span>
                    <span className="text-sm font-semibold text-[#2E2E2E]">
                      {i === 0 ? 'H-E-B Copycat Poblano Chicken Lasagna' : i === 3 ? 'Bacon-Wrapped Jalapeño Poppers' : 'Planned Meal Slot'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#7F8F6B] bg-[#F5EDE3] px-3 py-1 rounded-full">
                    {i === 0 || i === 3 ? 'Dinner' : 'Open'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GROCERY */}
        {activeTab === 'grocery' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#C76F42]">Shop Smart</span>
                <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Smart Grocery List</h2>
                <p className="text-stone-500 text-sm">Aisle Sorting & Multi-Store Price Comparison</p>
              </div>

              {/* STORE FILTER DROPDOWN */}
              <div className="flex items-center gap-3 bg-[#F5EDE3]/60 p-2 rounded-2xl border border-[#F5EDE3]">
                <Store className="w-5 h-5 text-[#55624F] ml-1" />
                <label htmlFor="store-select" className="text-xs font-bold uppercase tracking-wider text-[#55624F]">Store:</label>
                <select
                  id="store-select"
                  value={selectedStoreMode}
                  onChange={(e) => setSelectedStoreMode(e.target.value as PrimaryStore)}
                  className="bg-white border border-[#7F8F6B]/30 rounded-xl px-3 py-1.5 text-sm font-bold text-[#2E2E2E] focus:ring-2 focus:ring-[#55624F] focus:outline-none cursor-pointer"
                >
                  <option value="Cheapest">Best Mix (Cheapest Options)</option>
                  <option value="HEB">H-E-B Only (All Items)</option>
                  <option value="Kroger">Kroger Only (All Items)</option>
                </select>
              </div>
            </div>

            {/* GROCERY ITEMS BY STORE */}
            <div className="bg-white rounded-3xl border border-[#F5EDE3] shadow-xs overflow-hidden">
              <div className="p-4 bg-[#F5EDE3]/40 border-b border-[#F5EDE3] flex justify-between items-center">
                <span className="font-bold text-sm text-[#55624F]">
                  Showing Items for: <span className="text-[#C76F42] font-extrabold">{selectedStoreMode === 'Cheapest' ? 'Optimal Multi-Store Mix' : selectedStoreMode}</span>
                </span>
                <span className="text-sm font-semibold text-[#2E2E2E]">
                  Estimated Total: <span className="text-[#55624F] text-base font-extrabold ml-1">${calculatedTotal.toFixed(2)}</span>
                </span>
              </div>

              <div className="divide-y divide-[#F5EDE3]/60">
                {filteredGroceryItems.length === 0 ? (
                  <div className="p-8 text-center text-stone-500">No items available for this store selection.</div>
                ) : (
                  filteredGroceryItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#FCFAF7] transition">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={item.checked} 
                          readOnly
                          className="w-5 h-5 rounded border-[#7F8F6B] text-[#55624F] focus:ring-[#55624F]" 
                        />
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
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXPLORE */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs">
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

        {/* TAB 5: PREFS */}
        {activeTab === 'prefs' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs">
              <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Preferences & Pantry Staples</h2>
              <p className="text-stone-500 text-sm mt-1">Configure store preference order, dietary filters, and manage household staples</p>
            </div>

            {/* PANTRY STAPLES MANAGER INSIDE PREFS */}
            <div className="bg-white p-6 rounded-3xl border border-[#F5EDE3] shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#55624F]" />
                  <h3 className="font-extrabold text-lg text-[#2E2E2E]">Pantry & Household Staples</h3>
                </div>
              </div>

              <div className="grid gap-3">
                {pantryItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 bg-[#FCFAF7] border border-[#F5EDE3] rounded-2xl">
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
                        <span className="text-[11px] text-[#7F8F6B]">{item.category} • {item.store}</span>
                      </div>
                    </div>

                    <div>
                      {item.inStock ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#7F8F6B]/15 text-[#55624F]">
                          In Stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F5EDE3] text-[#C76F42] border border-[#C76F42]/30">
                          <Circle className="w-2.5 h-2.5 text-[#C76F42] fill-[#C76F42]" />
                          Added to Grocery List
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* RESTORED ORIGINAL BOTTOM NAVIGATION (Recipe / Plan / Grocery / Explore / Prefs) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5EDE3] z-40 shadow-lg md:relative md:border-t-0 md:bg-transparent">
        <div className="max-w-xl mx-auto px-6 py-2.5 flex justify-between items-center">
          
          {/* RECIPES */}
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'recipes' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Recipe</span>
          </button>

          {/* PLAN */}
          <button 
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'planner' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <Calendar className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Plan</span>
          </button>

          {/* GROCERY */}
          <button 
            onClick={() => setActiveTab('grocery')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'grocery' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Grocery</span>
          </button>

          {/* EXPLORE */}
          <button 
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'explore' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <Compass className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Explore</span>
          </button>

          {/* PREFS */}
          <button 
            onClick={() => setActiveTab('prefs')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'prefs' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <Settings className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Prefs</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
