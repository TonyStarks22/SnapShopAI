import React, { lazy, Suspense, useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Info, Truck, ShieldCheck, UserCheck, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import snapshopDemo from '@assets/snapshop_demo1.webp';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Lazy load below‑the‑fold components
const RecentPurchases = lazy(() => import('../components/RecentPurchases'));
const GlobalSnaps = lazy(() => import('../components/GlobalSnaps').then(module => ({ default: module.GlobalSnaps })));

// Mock Data for Results with weighting factors (kept for other sections)
const MOCK_PRODUCTS = [
  { 
    id: 1, 
    name: "Urban Tech Runner", 
    price: 145.00, 
    shipping: 0,    
    reviews: 4.8, 
    reliability: 0.98,
    vendor: "Amazon",
    match: "99%", 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60" 
  },
  { 
    id: 2, 
    name: "Cyber Street Sneaker", 
    price: 129.50, 
    shipping: 10, 
    reviews: 4.5, 
    reliability: 0.95,
    vendor: "Amazon",
    match: "94%", 
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=60" 
  },
  { 
    id: 3, 
    name: "Neon Future Low", 
    price: 180.00, 
    shipping: 0, 
    reviews: 4.9, 
    reliability: 0.99,
    vendor: "Amazon",
    match: "88%", 
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&auto=format&fit=crop&q=60" 
  },
];

const calculateScore = (p: any) => {
  const priceScore = (1 / p.price) * 1000;
  const shippingScore = p.shipping === 0 ? 20 : 0;
  const reviewScore = p.reviews * 10;
  const reliabilityScore = p.reliability * 50;
  return (priceScore + shippingScore + reviewScore + reliabilityScore).toFixed(1);
};

export default function Home() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const sortedProducts = [...MOCK_PRODUCTS].sort((a, b) => Number(calculateScore(b)) - Number(calculateScore(a)));
  const highestRanked = sortedProducts[0];

  const handleSearchComplete = (results: any[]) => {
    setSearchResults(results);
  };

  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary selection:text-black overflow-x-hidden">
      {/* Dark base background */}
      <div className="absolute inset-0 bg-background -z-10" />
      
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero section with its own radial glow */}
        <section className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#e0e0e0]/15 via-transparent to-transparent pointer-events-none" />
          <Hero onSearchComplete={handleSearchComplete} />
        </section>

        {/* Hidden Trigger for Highest Ranked Detail */}
        <Dialog>
          <DialogTrigger id="highest-rank-detail-trigger" className="hidden" />
          <DialogContent className="bg-card border-white/10 text-[#C4C4C4] max-w-3xl rounded-[2.5rem] p-0 overflow-hidden shadow-2xl shadow-primary/20">
            {searchResults.length > 0 ? (
              <div className="flex flex-col md:flex-row h-full">
                {/* Use the top result */}
                {(() => {
                  const product = searchResults[0];
                  const imageId = product.main_image_id || product.item_id;
                  const imageUrl = imageId ? `https://m.media-amazon.com/images/I/${imageId}.jpg` : product.image;
                  return (
                    <>
                      <div className="md:w-1/2 aspect-square md:aspect-auto">
                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="md:w-1/2 p-10 flex flex-col justify-between bg-black/60 backdrop-blur-md">
                        <DialogHeader className="mb-6">
                          <div className="flex justify-between items-start mb-4">
                            <Badge className="bg-primary text-black font-black uppercase tracking-tighter px-3">Top Match</Badge>
                            <Badge variant="outline" className="text-primary border-primary/50 font-mono">Score {product.score?.toFixed(2)}</Badge>
                          </div>
                          <DialogTitle className="text-4xl font-display font-bold text-[#C4C4C4] leading-none mb-2">{product.title}</DialogTitle>
                          <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-primary" /> {product.brand || 'Unknown'}
                          </p>
                        </DialogHeader>
                        <div className="space-y-4 mb-8">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors">
                              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Category</p>
                              <p className="text-xl font-bold">{product.category || 'General'}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors">
                              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Source</p>
                              <p className="text-xl font-bold">{product.source || 'ABO'}</p>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full bg-primary text-black hover:bg-primary/90 font-black h-16 rounded-2xl text-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] group active:scale-95">
                          View Details
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="p-10 text-center text-[#C4C4C4]">No results yet. Try a search!</div>
            )}
          </DialogContent>
        </Dialog>

        {/* Feature Section */}
        <section className="relative py-24 bg-white/2 border-y border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffffff]/10 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
              Snap any item. Instantly find it across thousands of <span className="text-secondary">stores.</span>
            </h2>
            <p
              className="text-xl leading-relaxed mb-12 font-medium bg-gradient-to-r from-blue-400 via-cyan-300 to-green-400 bg-clip-text text-transparent"
              style={{
                textShadow: '0 0 20px rgba(0,255,200,0.7), 0 0 40px rgba(0,100,255,0.5)',
              }}
            >
              Our advanced computer vision technology breaks down thousands of visual data points to find the exact match for color, texture, shape, and style.
            </p>
            <picture>
              <source srcSet="/snapshop_demo.webp" type="image/webp" />
              <img
                src={snapshopDemo}
                alt="SnapShop app interface demonstration"
                width={1376}
                height={768}
                loading="lazy"
                className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg my-8"
              />
            </picture>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Instant", desc: "Results in under 2 seconds" },
                { title: "Accurate", desc: "98.5% visual match rate" },
                { title: "Global", desc: "Search across 500+ stores" },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-4xl font-display font-bold text-primary mb-2">{stat.title}</div>
                  <div className="text-muted-foreground">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lazy loaded sections */}
        <section className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#e0e0e0]/10 via-transparent to-transparent pointer-events-none" />
          <Suspense fallback={<div className="h-64 text-center text-[#C4C4C4]">Loading community...</div>}>
            <RecentPurchases />
            <GlobalSnaps />
          </Suspense>
        </section>

        {/* Footer with subtle glow */}
        <footer className="relative py-12 border-t border-white/10 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#ffffff]/5 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-display font-bold">
              Snap<span className="text-primary">Shop</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2026 SnapShop Powered By SnapShop AI Inc, California USA. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}