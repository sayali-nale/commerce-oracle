import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Cpu, 
  Bell, 
  TrendingDown, 
  Warehouse, 
  Megaphone, 
  ShoppingBag, 
  Package, 
  Target, 
  ShoppingCart, 
  Star,
  ChevronRight,
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PriceTrajectoryChart, 
  PlatformComparisonChart, 
  ConfidenceGauge 
} from './components/Charts';
import { cn } from './lib/utils';
import { fetchProductData, ProductData } from './services/geminiService';

const INITIAL_DATA: ProductData = {
  name: "iPhone 15",
  description: "128GB Midnight",
  rating: 4,
  priceHistory: [
    { month: 'Oct', price: 28500 },
    { month: 'Nov', price: 27200 },
    { month: 'Dec', price: 29800 },
    { month: 'Jan', price: 25400 },
    { month: 'Feb', price: 24100 },
    { month: 'Mar', price: 23499 },
  ],
  platformPrices: [
    { name: 'Amazon', price: 24999, color: '#FF9900' },
    { name: 'Flipkart', price: 23499, color: '#2874F0' },
    { name: 'Croma', price: 24200, color: '#00E9BF' },
    { name: 'Reliance', price: 23999, color: '#E41E26' },
  ],
  confidenceScore: 82,
  priceForecast: {
    dropAmount: 1500,
    days: 10,
    sparkline: [40, 35, 45, 30, 25, 20, 15]
  },
  inventoryRisk: 'Medium',
  macroSignals: [
    { title: 'Flipkart Big Billion Days', subtitle: 'Starting in 14 days', iconType: 'sale' },
    { title: 'Inventory Surplus', subtitle: 'Detected at Croma', iconType: 'surplus' },
    { title: 'New Model Launch', subtitle: 'Expected Q3 2026', iconType: 'launch' }
  ],
  bestDeal: { store: 'Flipkart', price: 23499 },
  savings: 2001,
  avgPrice: 25500,
  imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=200&h=200&auto=format&fit=crop"
};

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productData, setProductData] = useState<ProductData>(INITIAL_DATA);
  const [targetPrice, setTargetPrice] = useState(22000);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsProcessing(true);
    try {
      const data = await fetchProductData(searchQuery);
      setProductData(data);
      setTargetPrice(Math.floor(data.bestDeal.price * 0.9)); // Set default target to 90% of best price
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 p-4 md:p-6 lg:p-8 font-sans">
      {/* Top Tagline */}
      <div className="mb-6 flex items-center justify-center px-1">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-500 text-center whitespace-nowrap">
          AI-powered price intelligence for smarter online shopping
        </p>
      </div>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Commerce Oracle</h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">AI Oracle Online</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter product name, SKU, or URL"
            className="w-full bg-card/50 border border-white/[0.05] rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-500"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isProcessing ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/[0.05] bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                <span className="text-xs">↵</span>
              </kbd>
            )}
          </div>
        </form>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-medium text-primary">Oracle Processing...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button className="p-2.5 rounded-xl bg-card border border-white/[0.05] hover:bg-slate-800 transition-colors relative">
            <Bell className="w-5 h-5 text-slate-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-card"></span>
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 p-[1px]">
            <div className="w-full h-full rounded-[11px] bg-card flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=Aria" alt="Profile" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Product Deal Summary */}
        <section className="lg:col-span-3 space-y-6">
          <div className="glass-card p-5 space-y-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src={productData.imageUrl} 
                  alt={productData.name} 
                  className="object-contain w-full h-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white leading-tight">{productData.name}</h3>
                <p className="text-xs text-slate-400">{productData.description}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-3 h-3",
                        i < Math.floor(productData.rating) ? "fill-accent text-accent" : "text-slate-600"
                      )} 
                    />
                  ))}
                </div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">In Stock</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">🏆 Best Current Deal</span>
              <div className="bg-secondary/20 text-secondary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Lowest</div>
            </div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 font-medium">{productData.bestDeal.store}</p>
                <p className="text-3xl font-bold text-white font-mono">₹{productData.bestDeal.price.toLocaleString()}</p>
              </div>
              <p className="text-[10px] text-slate-500 text-right mb-1">Incl. GST + Shipping</p>
            </div>
            <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all group shadow-lg shadow-primary/20">
              <ShoppingCart className="w-4 h-4" />
              Buy Now
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Target Price Alert</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white font-mono">₹{targetPrice.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Set Target</span>
              </div>
              <input 
                type="range" 
                min={Math.floor(productData.bestDeal.price * 0.7)} 
                max={productData.bestDeal.price} 
                step="100"
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-white/[0.05]">
                <Bell className="w-4 h-4" />
                Activate Price Sniffer
              </button>
            </div>
          </div>

          <div className="glass-card p-5 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-12 h-12 text-secondary" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Arbitrage Opportunity</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Top Platforms</p>
                <p className="text-sm font-bold text-secondary">+₹{productData.savings.toLocaleString()} Savings</p>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (productData.savings / productData.avgPrice) * 100)}%` }}
                  className="h-full bg-secondary rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-500">{Math.round((productData.savings / productData.avgPrice) * 100)}% cheaper than market average</p>
            </div>
          </div>
        </section>

        {/* Main Panel - Visual Analytics */}
        <section className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-white">Price Trajectory</h2>
              </div>
              <div className="flex gap-2">
                {['1M', '3M', '6M', '1Y'].map(t => (
                  <button key={t} className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-lg transition-colors",
                    t === '6M' ? "bg-primary text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  )}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <PriceTrajectoryChart data={productData.priceHistory} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-white">Platform Comparison</h2>
              </div>
              <PlatformComparisonChart data={productData.platformPrices} />
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-secondary" />
                <h2 className="text-lg font-bold text-white">Buy Confidence</h2>
              </div>
              <ConfidenceGauge score={productData.confidenceScore} />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-white">Savings Meter</h2>
              </div>
              <p className="text-sm font-mono text-secondary font-bold">₹{productData.savings.toLocaleString()} Saved</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Avg: ₹{productData.avgPrice.toLocaleString()}</span>
                <span>Current: ₹{productData.bestDeal.price.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (productData.savings / productData.avgPrice) * 100)}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel - AI Market Predictions */}
        <section className="lg:col-span-3 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">AI Market Predictions</h2>
          
          <div className="glass-card p-5 space-y-4 hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price Forecast</p>
                <p className="text-sm font-bold text-white">Expected Drop</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary font-mono">₹{productData.priceForecast.dropAmount.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Within the next {productData.priceForecast.days} days</p>
            </div>
            <div className="h-10 w-full flex items-end gap-1">
              {productData.priceForecast.sparkline.map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-1 bg-primary/20 rounded-t-sm"
                />
              ))}
            </div>
          </div>

          <div className="glass-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Warehouse className="w-5 h-5 text-accent" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inventory Risk</p>
                <p className="text-sm font-bold text-white">{productData.inventoryRisk} Risk</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>Low</span>
                <span>High</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: productData.inventoryRisk === 'High' ? '90%' : productData.inventoryRisk === 'Medium' ? '45%' : '15%' }}
                  className={cn(
                    "h-full rounded-full",
                    productData.inventoryRisk === 'High' ? "bg-danger" : productData.inventoryRisk === 'Medium' ? "bg-accent" : "bg-secondary"
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Macro Market Signals</p>
            
            {productData.macroSignals.map((signal, idx) => (
              <div key={idx} className="glass-card p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="p-2 bg-slate-800 rounded-lg">
                  {signal.iconType === 'sale' && <Megaphone className="w-4 h-4 text-primary" />}
                  {signal.iconType === 'surplus' && <Package className="w-4 h-4 text-secondary" />}
                  {signal.iconType === 'launch' && <Zap className="w-4 h-4 text-accent" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">{signal.title}</p>
                  <p className="text-[10px] text-slate-500">{signal.subtitle}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-600" />
              </div>
            ))}
          </div>

          <div className="glass-card p-5 bg-gradient-to-br from-slate-800 to-slate-900 border-white/[0.05]">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-3 h-3 rounded-full animate-pulse",
                productData.confidenceScore > 70 ? "bg-secondary" : productData.confidenceScore > 40 ? "bg-accent" : "bg-danger"
              )} />
              <p className="text-xs font-bold text-white">Best Time Indicator</p>
            </div>
            <div className="flex gap-2 mb-4">
              <div className={cn(
                "flex-1 h-12 border border-white/[0.05] rounded-lg flex items-center justify-center transition-all",
                productData.confidenceScore <= 40 
                  ? "bg-danger/20 border-danger/40 shadow-lg shadow-danger/10" 
                  : "bg-danger/10 border-danger/20 opacity-30"
              )}>
                <span className={cn("text-[10px] font-bold", productData.confidenceScore <= 40 ? "text-danger" : "text-danger/50")}>WAIT</span>
              </div>
              <div className={cn(
                "flex-1 h-12 border border-white/[0.05] rounded-lg flex items-center justify-center transition-all",
                productData.confidenceScore > 40 && productData.confidenceScore <= 70
                  ? "bg-accent/20 border-accent/40 shadow-lg shadow-accent/10" 
                  : "bg-accent/10 border-accent/20 opacity-30"
              )}>
                <span className={cn("text-[10px] font-bold", productData.confidenceScore > 40 && productData.confidenceScore <= 70 ? "text-accent" : "text-accent/50")}>NEUTRAL</span>
              </div>
              <div className={cn(
                "flex-1 h-12 border border-white/[0.05] rounded-lg flex items-center justify-center transition-all",
                productData.confidenceScore > 70
                  ? "bg-secondary/20 border-secondary/40 shadow-lg shadow-secondary/10" 
                  : "bg-secondary/10 border-secondary/20 opacity-30"
              )}>
                <span className={cn("text-[10px] font-bold", productData.confidenceScore > 70 ? "text-secondary" : "text-secondary/50")}>BUY NOW</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 text-center italic">
              {productData.confidenceScore > 70 
                ? "\"Market conditions are currently optimal for this SKU.\""
                : productData.confidenceScore > 40
                ? "\"Market is stable. Consider buying if urgent.\""
                : "\"AI predicts a significant price drop soon. Recommend waiting.\""}
            </p>
          </div>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="mt-8 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>Real-time market scan active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Normalizing cross-platform data</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Commerce Oracle v2.4.0</span>
          <span className="text-slate-700">|</span>
          <span>© 2026 AI Market Intelligence</span>
        </div>
      </footer>
    </div>
  );
}
