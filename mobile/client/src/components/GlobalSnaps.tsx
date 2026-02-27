import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface Snap {
  id: number;
  x: number;
  y: number;
}

interface City {
  lat: number;
  lng: number;
}

export const GlobalSnaps = () => {
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    // Full city list (land only)
    const landCities: City[] = [
      // North America
      { lat: 40.7128, lng: -74.0060 }, // New York
      { lat: 34.0522, lng: -118.2437 }, // Los Angeles
      { lat: 41.8781, lng: -87.6298 }, // Chicago
      { lat: 29.7604, lng: -95.3698 }, // Houston
      { lat: 39.9526, lng: -75.1652 }, // Philadelphia
      { lat: 33.4484, lng: -112.0740 }, // Phoenix
      { lat: 32.7157, lng: -117.1611 }, // San Diego
      { lat: 32.7767, lng: -96.7970 }, // Dallas
      { lat: 37.3382, lng: -121.8863 }, // San Jose
      { lat: 30.2672, lng: -97.7431 }, // Austin
      { lat: 39.7392, lng: -104.9903 }, // Denver
      { lat: 38.6270, lng: -90.1994 }, // St. Louis
      { lat: 38.9072, lng: -77.0369 }, // Washington D.C.
      { lat: 42.3601, lng: -71.0589 }, // Boston
      { lat: 33.7490, lng: -84.3880 }, // Atlanta
      { lat: 25.7617, lng: -80.1918 }, // Miami
      { lat: 27.9506, lng: -82.4572 }, // Tampa
      { lat: 28.5383, lng: -81.3792 }, // Orlando
      { lat: 37.7749, lng: -122.4194 }, // San Francisco
      { lat: 47.6062, lng: -122.3321 }, // Seattle
      { lat: 49.2827, lng: -123.1207 }, // Vancouver
      { lat: 53.5461, lng: -113.4938 }, // Edmonton
      { lat: 51.0447, lng: -114.0719 }, // Calgary
      { lat: 45.4215, lng: -75.6972 }, // Ottawa
      { lat: 43.6510, lng: -79.3470 }, // Toronto
      { lat: 45.5017, lng: -73.5673 }, // Montreal
      // South America
      { lat: -23.5505, lng: -46.6333 }, // Sao Paulo
      { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
      { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
      { lat: -33.4489, lng: -70.6693 }, // Santiago
      { lat: 4.7110, lng: -74.0721 }, // Bogota
      { lat: 10.4806, lng: -66.9036 }, // Caracas
      { lat: 19.4326, lng: -99.1332 }, // Mexico City
      // Europe
      { lat: 51.5074, lng: -0.1278 }, // London
      { lat: 48.8566, lng: 2.3522 }, // Paris
      { lat: 41.9028, lng: 12.4964 }, // Rome
      { lat: 40.4168, lng: -3.7038 }, // Madrid
      { lat: 52.5200, lng: 13.4050 }, // Berlin
      { lat: 50.1109, lng: 8.6821 }, // Frankfurt
      { lat: 48.1351, lng: 11.5820 }, // Munich
      { lat: 52.3740, lng: 4.8897 }, // Amsterdam
      { lat: 50.8503, lng: 4.3517 }, // Brussels
      { lat: 55.7558, lng: 37.6173 }, // Moscow
      { lat: 59.9343, lng: 30.3351 }, // St. Petersburg
      { lat: 50.0647, lng: 19.9450 }, // Krakow
      { lat: 52.2297, lng: 21.0122 }, // Warsaw
      { lat: 47.4979, lng: 19.0402 }, // Budapest
      { lat: 44.4268, lng: 26.1025 }, // Bucharest
      { lat: 42.6977, lng: 23.3219 }, // Sofia
      { lat: 41.0082, lng: 28.9784 }, // Istanbul
      { lat: 37.9838, lng: 23.7275 }, // Athens
      // Africa
      { lat: 30.0444, lng: 31.2357 }, // Cairo
      { lat: 33.5731, lng: -7.5898 }, // Casablanca
      { lat: 34.0209, lng: -6.8416 }, // Rabat
      { lat: 36.7538, lng: 3.0588 }, // Algiers
      { lat: 9.0245, lng: 38.7469 }, // Addis Ababa
      { lat: 6.5244, lng: 3.3792 }, // Lagos
      { lat: 5.6037, lng: -0.1870 }, // Accra
      { lat: 14.6928, lng: -17.4467 }, // Dakar
      // Asia
      { lat: 35.6895, lng: 139.6917 }, // Tokyo
      { lat: 34.6937, lng: 135.5023 }, // Osaka
      { lat: 37.5665, lng: 126.9780 }, // Seoul
      { lat: 22.5431, lng: 114.0579 }, // Hong Kong
      { lat: 31.2304, lng: 121.4737 }, // Shanghai
      { lat: 39.9042, lng: 116.4074 }, // Beijing
      { lat: 28.6139, lng: 77.2090 }, // Delhi
      { lat: 19.0760, lng: 72.8777 }, // Mumbai
      { lat: 12.9716, lng: 77.5946 }, // Bangalore
      { lat: 13.0827, lng: 80.2707 }, // Chennai
      { lat: 17.3850, lng: 78.4867 }, // Hyderabad
      { lat: 22.5726, lng: 88.3639 }, // Kolkata
      { lat: 23.8103, lng: 90.4125 }, // Dhaka
      { lat: 27.7172, lng: 85.3240 }, // Kathmandu
      { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur
      { lat: 1.3521, lng: 103.8198 }, // Singapore
      { lat: 13.7272, lng: 100.5231 }, // Bangkok
      { lat: 10.8231, lng: 106.6297 }, // Ho Chi Minh City
      { lat: 21.0245, lng: 105.8412 }, // Hanoi
      { lat: 11.5564, lng: 104.9282 }, // Phnom Penh
      { lat: 6.9271, lng: 79.8612 }, // Colombo
      { lat: 24.7136, lng: 46.6753 }, // Riyadh
      { lat: 25.2048, lng: 55.2708 }, // Dubai
      { lat: 24.2992, lng: 54.6973 }, // Abu Dhabi
      { lat: 23.5880, lng: 58.3829 }, // Muscat
      { lat: 32.8872, lng: 13.1913 }, // Tripoli
      { lat: 31.9497, lng: 35.9328 }, // Amman
      { lat: 33.8938, lng: 35.5018 }, // Beirut
      // Australia & Oceania
      { lat: -33.8688, lng: 151.2093 }, // Sydney
      { lat: -37.8136, lng: 144.9631 }, // Melbourne
      { lat: -27.4698, lng: 153.0251 }, // Brisbane
      { lat: -31.9505, lng: 115.8605 }, // Perth
      { lat: -34.9285, lng: 138.6007 }, // Adelaide
      { lat: -35.2809, lng: 149.1300 }, // Canberra
      { lat: -42.8821, lng: 147.3272 }, // Hobart
      { lat: -36.8485, lng: 174.7633 }, // Auckland
      { lat: -41.2865, lng: 174.7762 }, // Wellington
      { lat: -9.4438, lng: 147.1803 }, // Port Moresby
      { lat: -6.2088, lng: 106.8456 }, // Jakarta
    ];
    setCities(landCities);
    console.log('Cities loaded:', landCities.length);
  }, []);

  useEffect(() => {
    if (cities.length === 0) {
      console.log('No cities yet, waiting...');
      return;
    }

    const scheduleNextSnap = () => {
      const batchSize = Math.floor(Math.random() * 3) + 1; // 1–3 snaps per batch
      const newSnaps: Snap[] = [];

      for (let i = 0; i < batchSize; i++) {
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const x = ((randomCity.lng + 180) / 360) * 100;
        const y = ((90 - randomCity.lat) / 180) * 100;

        newSnaps.push({
          id: idRef.current++,
          x,
          y,
        });
      }

      setSnaps((prev) => [...prev, ...newSnaps]);
      console.log(`Added ${batchSize} snaps. Total snaps: ${snaps.length + batchSize}`);

      newSnaps.forEach((snap) => {
        setTimeout(() => {
          setSnaps((prev) => prev.filter((s) => s.id !== snap.id));
        }, 3000);
      });

      const nextDelay = Math.random() * 400 + 300; // 300–700ms
      setTimeout(scheduleNextSnap, nextDelay);
    };

    const timer = setTimeout(scheduleNextSnap, 500);
    return () => clearTimeout(timer);
  }, [cities]);

  return (
    <section className="relative py-24 bg-black/50 border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-[#C4C4C4] mb-4 text-center">
          Global <span className="text-primary">Snaps</span>
        </h2>
        <p
          className="text-base md:text-lg text-center max-w-2xl mx-auto font-medium bg-gradient-to-r from-[#f0f0f0] via-[#ffffff] to-[#f0f0f0] bg-clip-text text-transparent"
          style={{
            textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)',
          }}
        >
          Every second, dozens of shoppers snap products around the world. Watch live as our AI connects them to the best deals.
        </p>
      </div>

      {/* Map container with silver glow */}
      <div
        className="relative w-full max-w-5xl mx-auto aspect-[2/1] bg-black/40 rounded-2xl border border-white/20 overflow-hidden"
        style={{
          boxShadow: `
            0 0 30px rgba(255,255,255,0.5),
            0 0 60px rgba(200,200,200,0.4),
            0 0 90px rgba(255,255,255,0.3)
          `,
        }}
      >
        <picture>
  <source
    srcSet="/images/world-map-800.webp 800w, /images/world-map-1500.webp 1500w"
    sizes="(max-width: 1200px) 90vw, 1200px"
    type="image/webp"
  />
  <img
    src="/images/world-map.png"
    alt="World map"
    width={1024}
    height={509}
    loading="lazy"
    className="w-full h-full object-cover"
    style={{ filter: 'invert(1) hue-rotate(180deg) brightness(0.8)', opacity: 0.8 }}
  />
</picture>
        <AnimatePresence>
          {snaps.map((snap) => (
            <motion.div
              key={snap.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="absolute"
              style={{
                left: `${snap.x}%`,
                top: `${snap.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Star
                className="w-3 h-3 text-primary fill-primary"
                style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.8))' }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center mt-8 text-muted-foreground text-sm">
        <span className="text-[#C4C4C4] font-bold">{Math.floor(Math.random() * 80 + 100)}+</span> snaps in the last minute
      </div>
    </section>
  );
};