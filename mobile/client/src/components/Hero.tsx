import React, { lazy, Suspense } from 'react';
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";

// Lazy load SnapSearch (now a default export)
const SnapSearch = lazy(() => import('./SnapSearch'));

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-20">
      {/* Background with Gradient Mesh */}
      <div className="absolute inset-0 bg-background z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] opacity-40 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px] opacity-40 -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text */}
        <div className="space-y-8 text-center lg:text-left pt-10 lg:pt-0">
          <Badge variant="outline" className="border-primary/50 text-primary uppercase tracking-widest px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full">
            See It, Snap It, Get It - Powered by AI
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tighter text-[#C4C4C4]">
            Snap.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Find.</span><br/>
            Buy.
          </h1>
          
          <p className="text-lg md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium bg-gradient-to-r from-[#f0f0f0] via-[#ffffff] to-[#f0f0f0] bg-clip-text text-transparent" style={{ textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.5)' }}>
            Snap any item. Our AI instantly finds the best match across thousands of online shops – so you always get the right choice.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-black flex items-center justify-center text-xs font-bold text-[#C4C4C4]">
                  {i}
                </div>
              ))}
            </div>
            <p>Trusted by 10k+ shoppers</p>
          </div>
        </div>

        {/* Right Column: Interactive Demo (lazy loaded) */}
        <div className="relative">
          <Suspense fallback={<div className="text-[#C4C4C4] text-center py-20">Loading camera...</div>}>
            <SnapSearch />
          </Suspense>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
}