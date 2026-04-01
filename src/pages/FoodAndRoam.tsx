import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, UtensilsCrossed, MapPin, Car, ShoppingCart,
  Plus, Minus, Trash2, CreditCard, Clock, CheckCircle2,
  Navigation, Building, TreePine, Dumbbell, ChevronLeft,
  Waves, ZoomIn, ZoomOut, RotateCcw,
} from "lucide-react";
import PaymentGateway from "@/components/PaymentGateway";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

interface CartItem extends FoodItem {
  qty: number;
}

const foodCourts = [
  {
    name: "Main Canteen",
    items: [
      { id: 1, name: "Masala Dosa", price: 50, category: "South Indian", emoji: "🥞" },
      { id: 2, name: "Paneer Butter Masala", price: 120, category: "North Indian", emoji: "🍛" },
      { id: 3, name: "Fried Rice", price: 80, category: "Chinese", emoji: "🍚" },
      { id: 4, name: "Veg Biryani", price: 100, category: "Biryani", emoji: "🍲" },
      { id: 5, name: "Cold Coffee", price: 40, category: "Beverages", emoji: "☕" },
    ],
  },
  {
    name: "Juice Corner",
    items: [
      { id: 6, name: "Mango Shake", price: 60, category: "Shakes", emoji: "🥭" },
      { id: 7, name: "Watermelon Juice", price: 40, category: "Juices", emoji: "🍉" },
      { id: 8, name: "Oreo Shake", price: 80, category: "Shakes", emoji: "🍪" },
    ],
  },
  {
    name: "Quick Bites",
    items: [
      { id: 9, name: "Samosa (2 pcs)", price: 20, category: "Snacks", emoji: "🔺" },
      { id: 10, name: "Vada Pav", price: 30, category: "Snacks", emoji: "🍔" },
      { id: 11, name: "Maggi", price: 40, category: "Snacks", emoji: "🍜" },
      { id: 12, name: "Sandwich", price: 50, category: "Snacks", emoji: "🥪" },
    ],
  },
];

const campusLocations = [
  { name: "Main Building", icon: <Building className="w-5 h-5" />, desc: "Admin, Auditorium", distance: "0.2 km" },
  { name: "Tech Park", icon: <Building className="w-5 h-5" />, desc: "CSE, IT, AIDS Labs", distance: "0.5 km" },
  { name: "Science Block", icon: <Building className="w-5 h-5" />, desc: "Physics, Chemistry Labs", distance: "0.8 km" },
  { name: "Library", icon: <Building className="w-5 h-5" />, desc: "24/7 Reading Hall", distance: "0.3 km" },
  { name: "Sports Complex", icon: <Dumbbell className="w-5 h-5" />, desc: "Gym, Indoor Stadium", distance: "1.2 km" },
  { name: "Cricket Ground", icon: <TreePine className="w-5 h-5" />, desc: "Main Sports Ground", distance: "1.5 km" },
  { name: "Hostel Zone", icon: <Building className="w-5 h-5" />, desc: "Blocks A-H", distance: "0.6 km" },
  { name: "Food Court Area", icon: <UtensilsCrossed className="w-5 h-5" />, desc: "All Canteens", distance: "0.4 km" },
];

type FoodRoamTab = "food" | "map" | "transport";
type FlowState = "browse" | "payment" | "success";

const FoodAndRoam: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FoodRoamTab>("food");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [foodFlow, setFoodFlow] = useState<FlowState>("browse");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [rideFlow, setRideFlow] = useState<FlowState>("browse");
  const [mapZoom, setMapZoom] = useState(1);
  const [mapRotate, setMapRotate] = useState(0);

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((c) => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter((c) => c.qty > 0)
    );
  };

  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

  const rideDistance = selectedFrom && selectedTo && selectedFrom !== selectedTo
    ? (Math.random() * 2 + 0.3).toFixed(1) : null;
  const rideFare = rideDistance ? Math.round(parseFloat(rideDistance) * 15 + 10) : null;
  const rideTime = rideDistance ? Math.round(parseFloat(rideDistance) * 3 + 2) : null;

  const tabs: { id: FoodRoamTab; label: string; icon: React.ReactNode }[] = [
    { id: "food", label: "Food", icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: "map", label: "Campus Map", icon: <MapPin className="w-4 h-4" /> },
    { id: "transport", label: "Transport", icon: <Car className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background dark">
      <header className="glass border-b border-border sticky top-0 z-20">
        <div className="container flex items-center gap-4 py-4">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-success-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">Food & Roam</h1>
          </div>
          {cart.length > 0 && activeTab === "food" && foodFlow === "browse" && (
            <div className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-medium">
              <ShoppingCart className="w-4 h-4" />
              {cart.reduce((a, c) => a + c.qty, 0)}
            </div>
          )}
        </div>
      </header>

      <div className="container py-6">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-success text-success-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Food */}
        {activeTab === "food" && (
          <div className="animate-fade-in">
            {foodFlow === "payment" ? (
              <div className="max-w-lg mx-auto glass rounded-xl p-6">
                <div className="mb-4 pb-4 border-b border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Order Summary</h4>
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
                      <span className="text-foreground">{item.name} × {item.qty}</span>
                      <span className="text-foreground">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <PaymentGateway
                  amount={total}
                  title="Pay for your order"
                  onSuccess={() => { setFoodFlow("browse"); setCart([]); }}
                  onBack={() => setFoodFlow("browse")}
                  cashLabel="Pay at Counter"
                  cashSuccessMessage="Order Placed!"
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {foodCourts.map((court) => (
                    <div key={court.name} className="glass rounded-xl p-6">
                      <h3 className="font-display font-semibold text-foreground mb-4">{court.name}</h3>
                      <div className="space-y-2">
                        {court.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.emoji}</span>
                              <div>
                                <span className="font-medium text-foreground">{item.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">{item.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-foreground">₹{item.price}</span>
                              <button onClick={() => addToCart(item)} className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass rounded-xl p-6 h-fit sticky top-24">
                  <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" /> Cart
                  </h3>
                  {cart.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex-1">
                              <span className="text-sm text-foreground">{item.name}</span>
                              <span className="text-xs text-muted-foreground ml-1">₹{item.price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded bg-secondary hover:bg-secondary/80"><Minus className="w-3 h-3 text-foreground" /></button>
                              <span className="text-sm font-medium text-foreground w-5 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded bg-secondary hover:bg-secondary/80"><Plus className="w-3 h-3 text-foreground" /></button>
                              <button onClick={() => updateQty(item.id, -item.qty)} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3 h-3 text-destructive" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border pt-3 mb-4">
                        <div className="flex justify-between font-semibold text-foreground"><span>Total</span><span>₹{total}</span></div>
                      </div>
                      <button onClick={() => setFoodFlow("payment")} className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4" /> Proceed to Pay • ₹{total}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Campus Map — 3D Satellite Style */}
        {activeTab === "map" && (
          <div className="animate-fade-in">
            <div className="glass rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-foreground">3D Campus Map</h3>
                  <p className="text-sm text-muted-foreground">Interactive satellite view — 250 acres</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setMapZoom(z => Math.min(z + 0.2, 2))} className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground"><ZoomIn className="w-4 h-4" /></button>
                  <button onClick={() => setMapZoom(z => Math.max(z - 0.2, 0.6))} className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground"><ZoomOut className="w-4 h-4" /></button>
                  <button onClick={() => { setMapZoom(1); setMapRotate(0); }} className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground"><RotateCcw className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-border/50" style={{ aspectRatio: '16/10', perspective: '1200px' }}>
                <div style={{ transform: `scale(${mapZoom}) rotateX(${15 + mapRotate}deg)`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }} className="w-full h-full">
                  {/* Base terrain with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(140,35%,20%)] via-[hsl(135,30%,18%)] to-[hsl(145,32%,16%)]" />

                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <linearGradient id="road-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(0,0%,25%)" />
                        <stop offset="50%" stopColor="hsl(0,0%,32%)" />
                        <stop offset="100%" stopColor="hsl(0,0%,25%)" />
                      </linearGradient>
                      <filter id="shadow-3d">
                        <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                      </filter>
                      <radialGradient id="water-grad" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="hsl(200,75%,55%)" />
                        <stop offset="100%" stopColor="hsl(200,65%,40%)" />
                      </radialGradient>
                    </defs>

                    {/* Main Roads */}
                    <rect x="0" y="140" width="800" height="14" fill="url(#road-grad)" rx="2" />
                    <rect x="0" y="320" width="800" height="14" fill="url(#road-grad)" rx="2" />
                    <rect x="200" y="0" width="14" height="500" fill="url(#road-grad)" rx="2" />
                    <rect x="500" y="0" width="14" height="500" fill="url(#road-grad)" rx="2" />
                    <rect x="350" y="50" width="8" height="400" fill="hsl(0,0%,28%)" rx="1" />
                    <rect x="650" y="50" width="8" height="400" fill="hsl(0,0%,28%)" rx="1" />
                    <rect x="100" y="60" width="600" height="8" fill="hsl(0,0%,28%)" rx="1" />
                    <rect x="100" y="240" width="600" height="8" fill="hsl(0,0%,28%)" rx="1" />
                    <rect x="100" y="420" width="600" height="8" fill="hsl(0,0%,28%)" rx="1" />

                    {/* Lane markings */}
                    <line x1="0" y1="147" x2="800" y2="147" stroke="hsl(50,80%,55%)" strokeWidth="1.5" strokeDasharray="12,8" />
                    <line x1="0" y1="327" x2="800" y2="327" stroke="hsl(50,80%,55%)" strokeWidth="1.5" strokeDasharray="12,8" />
                    <line x1="207" y1="0" x2="207" y2="500" stroke="hsl(50,80%,55%)" strokeWidth="1.5" strokeDasharray="12,8" />
                    <line x1="507" y1="0" x2="507" y2="500" stroke="hsl(50,80%,55%)" strokeWidth="1.5" strokeDasharray="12,8" />

                    {/* 3D Buildings */}
                    {/* Main Building */}
                    <rect x="50" y="30" width="120" height="80" rx="4" fill="hsl(220,20%,35%)" filter="url(#shadow-3d)" />
                    <rect x="50" y="25" width="120" height="80" rx="4" fill="hsl(220,25%,45%)" />
                    <rect x="55" y="30" width="25" height="18" rx="2" fill="hsl(200,50%,70%)" opacity="0.5" />
                    <rect x="85" y="30" width="25" height="18" rx="2" fill="hsl(200,50%,70%)" opacity="0.5" />
                    <rect x="115" y="30" width="25" height="18" rx="2" fill="hsl(200,50%,70%)" opacity="0.5" />

                    {/* Tech Park */}
                    <rect x="230" y="25" width="100" height="95" rx="6" fill="hsl(210,25%,30%)" filter="url(#shadow-3d)" />
                    <rect x="230" y="20" width="100" height="95" rx="6" fill="hsl(210,30%,40%)" />
                    <rect x="235" y="28" width="18" height="14" rx="1" fill="hsl(180,60%,60%)" opacity="0.6" />
                    <rect x="258" y="28" width="18" height="14" rx="1" fill="hsl(180,60%,60%)" opacity="0.6" />
                    <rect x="281" y="28" width="18" height="14" rx="1" fill="hsl(180,60%,60%)" opacity="0.6" />
                    <rect x="305" y="28" width="18" height="14" rx="1" fill="hsl(180,60%,60%)" opacity="0.6" />

                    {/* Science Block */}
                    <rect x="520" y="170" width="90" height="60" rx="4" fill="hsl(30,15%,30%)" filter="url(#shadow-3d)" />
                    <rect x="520" y="165" width="90" height="60" rx="4" fill="hsl(30,20%,42%)" />

                    {/* Library */}
                    <rect x="230" y="260" width="90" height="55" rx="8" fill="hsl(0,0%,28%)" filter="url(#shadow-3d)" />
                    <rect x="230" y="255" width="90" height="55" rx="8" fill="hsl(25,30%,38%)" />

                    {/* Hostel Blocks */}
                    {[0, 1, 2, 3].map(i => (
                      <g key={`hostel-${i}`}>
                        <rect x={660} y={30 + i * 55} width={80} height={40} rx="3" fill="hsl(260,15%,28%)" filter="url(#shadow-3d)" />
                        <rect x={660} y={25 + i * 55} width={80} height={40} rx="3" fill={`hsl(${260 + i * 10},20%,${38 + i * 3}%)`} />
                      </g>
                    ))}

                    {/* Swimming Pool */}
                    <rect x="555" y="360" width="70" height="35" rx="12" fill="url(#water-grad)" />
                    <rect x="562" y="367" width="56" height="21" rx="8" fill="hsl(200,80%,60%)" opacity="0.6" />

                    {/* Sports Grounds */}
                    <ellipse cx="120" cy="400" rx="80" ry="60" fill="hsl(130,45%,30%)" />
                    <ellipse cx="120" cy="400" rx="60" ry="42" fill="hsl(130,50%,35%)" />
                    <line x1="60" y1="400" x2="180" y2="400" stroke="white" strokeWidth="1" opacity="0.3" />

                    <ellipse cx="680" cy="440" rx="55" ry="40" fill="hsl(130,45%,30%)" />

                    {/* Auditorium */}
                    <rect x="370" y="360" width="100" height="70" rx="12" fill="hsl(280,20%,28%)" filter="url(#shadow-3d)" />
                    <rect x="370" y="355" width="100" height="70" rx="12" fill="hsl(280,25%,38%)" />

                    {/* Food Court */}
                    <rect x="50" y="180" width="110" height="50" rx="6" fill="hsl(15,30%,28%)" filter="url(#shadow-3d)" />
                    <rect x="50" y="175" width="110" height="50" rx="6" fill="hsl(15,35%,40%)" />

                    {/* Health Center */}
                    <rect x="230" y="370" width="70" height="45" rx="4" fill="hsl(0,30%,30%)" filter="url(#shadow-3d)" />
                    <rect x="230" y="365" width="70" height="45" rx="4" fill="hsl(0,40%,42%)" />

                    {/* Parking */}
                    <rect x="30" y="260" width="55" height="35" fill="hsl(0,0%,30%)" rx="3" />
                    <rect x="720" y="300" width="55" height="35" fill="hsl(0,0%,30%)" rx="3" />

                    {/* Walking paths */}
                    <path d="M230 120 Q300 100 360 120" stroke="hsl(35,40%,50%)" strokeWidth="3" fill="none" strokeDasharray="6,4" />
                    <path d="M520 250 Q580 230 660 250" stroke="hsl(35,40%,50%)" strokeWidth="3" fill="none" strokeDasharray="6,4" />

                    {/* Trees */}
                    {[
                      [60,130],[160,40],[280,180],[420,100],[580,440],[700,200],[340,340],[140,290],[750,420],[450,300],
                      [90,350],[520,50],[620,280],[380,460],[240,400],[680,380],[310,30],[570,130],[470,250],[160,450],
                      [45,70],[400,200],[530,400],[195,370],[270,140],[650,120],[710,350],[380,80],[100,240],[460,430],
                    ].map(([cx,cy], i) => (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r={4 + (i % 4) * 2} fill={`hsl(${125 + (i % 6) * 5},${40 + (i % 3) * 5}%,${22 + (i % 5) * 3}%)`} />
                        <circle cx={cx} cy={cy - 2} r={3 + (i % 3)} fill={`hsl(${130 + (i % 4) * 4},${45 + (i % 3) * 5}%,${28 + (i % 4) * 3}%)`} opacity="0.8" />
                      </g>
                    ))}
                  </svg>

                  {/* Building labels */}
                  {[
                    { name: "🏛️ Main Building", sub: "Admin & Auditorium", x: "5%", y: "3%" },
                    { name: "🖥️ Tech Park", sub: "CSE / IT / AI Labs", x: "27%", y: "2%" },
                    { name: "🔬 Science Block", sub: "Physics & Chemistry", x: "63%", y: "30%" },
                    { name: "📚 Library", sub: "24/7 Study Hall", x: "27%", y: "48%" },
                    { name: "🏊 Swimming Pool", sub: "Olympic Size", x: "67%", y: "68%" },
                    { name: "🏏 Cricket Ground", sub: "Main Ground", x: "5%", y: "72%" },
                    { name: "🏠 Hostel A-D", sub: "Boys Hostel", x: "80%", y: "2%" },
                    { name: "🏠 Hostel E-H", sub: "Girls Hostel", x: "80%", y: "28%" },
                    { name: "🍔 Food Court", sub: "All Canteens", x: "5%", y: "32%" },
                    { name: "🏟️ Auditorium", sub: "Events & Fests", x: "44%", y: "68%" },
                    { name: "🏥 Health Center", sub: "24/7 Medical", x: "27%", y: "70%" },
                    { name: "🅿️ Parking A", sub: "", x: "2%", y: "50%" },
                    { name: "🅿️ Parking B", sub: "", x: "88%", y: "58%" },
                    { name: "⚽ Sports Ground", sub: "Football & Hockey", x: "80%", y: "82%" },
                  ].map((loc) => (
                    <div
                      key={loc.name}
                      className="absolute group cursor-pointer"
                      style={{ left: loc.x, top: loc.y }}
                    >
                      <div className="bg-card/95 backdrop-blur-md border border-border/60 rounded-lg px-2.5 py-1.5 text-center shadow-xl hover:scale-110 hover:z-10 transition-all duration-200 hover:bg-primary/20">
                        <div className="text-[10px] md:text-xs font-semibold text-foreground leading-tight whitespace-nowrap">{loc.name}</div>
                        {loc.sub && <div className="text-[8px] md:text-[10px] text-muted-foreground leading-tight">{loc.sub}</div>}
                      </div>
                    </div>
                  ))}

                  {/* Compass */}
                  <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-card/90 border-2 border-border flex flex-col items-center justify-center shadow-xl">
                    <span className="text-[8px] text-destructive font-bold">N</span>
                    <span className="text-xs font-bold text-foreground">↑</span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-card/90 border border-border rounded px-2 py-1">
                    <div className="w-12 h-0.5 bg-foreground" />
                    <span className="text-[9px] text-foreground font-medium">200m</span>
                  </div>

                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-card/90 border border-border text-[9px] text-muted-foreground">
                    🛰️ Satellite View
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {campusLocations.map((loc) => (
                <div key={loc.name} className="glass rounded-xl p-4 flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">{loc.icon}</div>
                  <span className="text-xs font-medium text-foreground">{loc.name}</span>
                  <span className="text-[10px] text-muted-foreground">{loc.desc}</span>
                  <span className="text-[10px] text-primary mt-1">{loc.distance}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transport with Payment */}
        {activeTab === "transport" && (
          <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
            {rideFlow === "payment" ? (
              <div className="glass rounded-xl p-6">
                <div className="mb-4 p-4 rounded-xl bg-secondary/30 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Route</span><span className="text-foreground">{selectedFrom} → {selectedTo}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Distance</span><span className="text-foreground">{rideDistance} km</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Est. Time</span><span className="text-foreground">{rideTime} min</span></div>
                </div>
                <PaymentGateway
                  amount={rideFare || 0}
                  title="Pay for your ride"
                  onSuccess={() => { setRideFlow("browse"); setSelectedFrom(""); setSelectedTo(""); }}
                  onBack={() => setRideFlow("browse")}
                  cashLabel="Pay Driver in Cash"
                  successMessage="Ride Booked!"
                  cashSuccessMessage="Ride Booked! Pay driver on arrival."
                />
              </div>
            ) : (
              <div className="glass rounded-xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" /> Book a Campus Ride
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-2 block">Pickup</label>
                    <select value={selectedFrom} onChange={(e) => setSelectedFrom(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="">Select location</option>
                      {campusLocations.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-2 block">Drop-off</label>
                    <select value={selectedTo} onChange={(e) => setSelectedTo(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="">Select location</option>
                      {campusLocations.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
                    </select>
                  </div>
                  {rideDistance && (
                    <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Distance</span><span className="font-medium text-foreground">{rideDistance} km</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Est. Time</span><span className="font-medium text-foreground">{rideTime} min</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fare</span><span className="font-bold text-foreground">₹{rideFare}</span></div>
                    </div>
                  )}
                  <button onClick={() => { if (rideDistance) setRideFlow("payment"); }} disabled={!rideDistance} className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <Navigation className="w-4 h-4" /> Book Hatchback • ₹{rideFare || "—"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodAndRoam;
