import React, { useState } from 'react';
import { 
  Bookmark, 
  ShoppingCart, 
  Calendar, 
  ChefHat, 
  Heart, 
  Store, 
  Circle, 
  Check, 
  Sparkles, 
  SlidersHorizontal,
  Package
} from 'lucide-react';

type PrimaryStore = 'HEB' | 'Kroger' | 'Cheapest';

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

// Simma Logo Component
const SimmaLogo = ({ className = "h-8" }: { className?: string }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg viewBox="0 0 100 100" className="h-full w-auto aspect-square">
      <!-- Left Leaf (Olive) -->
      <path d="M 38 22 C 24 36 30 56 48 52 C 48 36 40 22 38 22 Z" fill="#7F8F6B"/>
      <!-- Right Leaf (Terracotta) -->
      <path d="M 62 22 C 76 36 70 56 52 52 C 52 36 60 22 62 22 Z" fill="#C76F42"/>
      <!-- Letter S -->
      <text x="50" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="44" font-weight="800" fill="#2E2E2E" text-anchor="middle">S</text>
    </svg>
    <div className="flex flex-col">
      <span className="font-extrabold text-2xl tracking-tight text-[#2E2E2E] leading-none">Simma</span>
      <span className="text-[9px] font-bold tracking-widest text-[#7F8F6B] uppercase mt-0.5">Good Food Comes Together</span>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'pantry' | 'grocery' | 'recipes' | 'planner'>('grocery');
  
  // --- PANTRY STATE ---
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

  // Multi-store database mock
  const rawGroceryItems: GroceryItem[] = [
    { id: 'g1', name: 'Boneless Skinless Chicken Breasts', category: 'Meat', aisle: 'Aisle 2 - Poultry', quantity: '2 lbs', estimatedPrice: 7.96, store: 'HEB', checked: false },
    { id: 'g2', name: 'Poblano Peppers', category: 'Produce', aisle: 'Aisle 1 - Produce', quantity: '4 count', estimatedPrice: 1.48, store: 'HEB', checked: false },
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

          {/* SIMMA BRAND ACTION TAGLINE */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-semibold text-[#7F8F6B]">
            <span>Save it.</span>
            <span>•</span>
            <span>Plan it.</span>
            <span>•</span>
            <span>Shop it.</span>
            <span>•</span>
            <span>Make it.</span>
            <span>•</span>
            <span>Enjoy it.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F5EDE3] text-[#C76F42] border border-[#C76F42]/20">
              Your Kitchen in One Place
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-8">
        
        {/* PANTRY TAB */}
        {activeTab === 'pantry' && (
          <div className="space-y-6">
            <div className="bg-[#55624F] text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#7F8F6B] bg-white/10 px-3 py-1 rounded-full inline-block mb-2">Pantry & Staples</span>
                <h2 className="text-2xl font-extrabold tracking-tight">Household Essentials</h2>
                <p className="text-sand/90 text-sm mt-1 max-w-lg">
                  Same good food. Less hassle. Items marked out-of-stock automatically add to your shopping list.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {pantryItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 bg-white border border-[#F5EDE3] rounded-2xl shadow-xs hover:border-[#7F8F6B]/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => togglePantryStock(item.id)}
                      className="focus:outline-none"
                    >
                      {item.inStock ? (
                        <div className="w-6 h-6 rounded-full bg-[#7F8F6B] flex items-center justify-center text-white shadow-xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-[#C76F42] stroke-[2.2]" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-bold text-[#2E2E2E]">{item.name}</h3>
                      <span className="text-xs font-medium text-[#7F8F6B]">{item.category} • Preferred Store: {item.store}</span>
                    </div>
                  </div>

                  {/* Neutral Warm Terracotta/Sand Badge for Reorder Status */}
                  <div>
                    {item.inStock ? (
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#7F8F6B]/15 text-[#55624F]">
                        In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#F5EDE3] text-[#C76F42] border border-[#C76F42]/30 shadow-2xs">
                        <Circle className="w-3 h-3 text-[#C76F42] fill-[#C76F42]" />
                        Added to Grocery List
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GROCERY TAB */}
        {activeTab === 'grocery' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-[#F5EDE3] shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#C76F42]">Shop It</span>
                <h2 className="text-2xl font-extrabold text-[#2E2E2E]">Smart Grocery List</h2>
                <p className="text-stone-500 text-sm">Community Pricing & Store Aisle Routing</p>
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

      </div>

      {/* BRAND NAVIGATION BAR (Matching Photo Elements: Save / Shop / Plan / Cook / Enjoy) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5EDE3] z-40 shadow-lg md:relative md:border-t-0 md:bg-transparent">
        <div className="max-w-xl mx-auto px-6 py-2.5 flex justify-between items-center">
          
          {/* SAVE */}
          <button 
            onClick={() => setActiveTab('pantry')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'pantry' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <Bookmark className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Save</span>
          </button>

          {/* SHOP */}
          <button 
            onClick={() => setActiveTab('grocery')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'grocery' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Shop</span>
          </button>

          {/* PLAN */}
          <button 
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'planner' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <Calendar className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Plan</span>
          </button>

          {/* COOK */}
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'recipes' ? 'text-[#55624F]' : 'text-stone-400 hover:text-[#55624F]'}`}
          >
            <ChefHat className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Cook</span>
          </button>

          {/* ENJOY */}
          <button 
            onClick={() => alert('Simma Favorites & Meal Notes')}
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-[#C76F42] transition"
          >
            <Heart className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-bold">Enjoy</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
