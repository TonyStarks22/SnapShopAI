import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, Award } from 'lucide-react';

// Mock data – iPhone item removed
const mockPurchases = [
  {
    id: 1,
    productName: "Nike Air Max 270",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format",
    vendor: "Nike Official",
    price: "$129.99",
    deliveryDays: "2-3 days",
    score: 98,
    badge: "Best Overall"
  },
  {
    id: 2,
    productName: "Sony WH-1000XM4",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&auto=format",
    vendor: "Sony Store",
    price: "$348.00",
    deliveryDays: "Free 1-day",
    score: 96,
    badge: "Best Value"
  },
  {
    id: 4,
    productName: "Apple AirPods Pro",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=200&auto=format",
    vendor: "Apple",
    price: "$249.00",
    deliveryDays: "2-day shipping",
    score: 99,
    badge: "Most Popular"
  }
];

// Fallback image (a simple gray placeholder)
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23333333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23ffffff'%3EImage not available%3C/text%3E%3C/svg%3E";

const ImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
};

const RecentPurchases: React.FC = () => {
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-black/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-[#C4C4C4] mb-8 flex items-center gap-3">
          <span className="bg-primary/20 p-2 rounded-lg">
            <Award className="w-6 h-6 text-primary" />
          </span>
          Recent Community Snaps
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockPurchases.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Badge */}
              {item.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-primary text-black">
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Score Circle */}
              <div className="absolute top-3 right-3 z-10">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#C4C4C4]/10"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${(item.score / 100) * 100.53} 100.53`}
                      className="text-primary transition-all duration-1000"
                      style={{ strokeLinecap: 'round' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#C4C4C4]">
                    {item.score}
                  </span>
                </div>
              </div>

              {/* Image with fallback */}
              <div className="aspect-square overflow-hidden bg-black/40">
                <ImageWithFallback src={item.image} alt={item.productName} />
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="font-display font-bold text-[#C4C4C4] mb-1 line-clamp-1">
                  {item.productName}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {item.vendor}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {item.price}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    {item.deliveryDays}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {item.score}/100
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPurchases;