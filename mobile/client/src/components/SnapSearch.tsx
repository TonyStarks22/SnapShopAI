import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Loader2, Sparkles, ScanLine, ArrowRight, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface SnapSearchProps {
  onSearchComplete: (results: any[]) => void;
}

function SnapSearch({ onSearchComplete }: SnapSearchProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [textQuery, setTextQuery] = useState("");

  const performSearch = async (file: File, query?: string) => {
    setIsScanning(true);
    const formData = new FormData();
    formData.append('file', file);
    if (query) formData.append('query', query);

    try {
      const response = await fetch('/search', {
        method: 'POST',
        body: formData,
      });
      const results = await response.json();
      onSearchComplete(results);
      toast({ title: "Search complete!", description: `Found ${results.length} products.` });
      // Auto-open highest ranking product details
      const detailTrigger = document.getElementById('highest-rank-detail-trigger');
      detailTrigger?.click();
    } catch (error) {
      toast({ title: "Error", description: "Search failed.", variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        performSearch(file, textQuery);
      }
    };
    input.click();
  };

  const handleTextSubmit = () => {
    if (!textQuery.trim()) return;
    // For text-only search, create a dummy file (backend may ignore it)
    const dummyFile = new File(["dummy"], "dummy.jpg", { type: "image/jpeg" });
    performSearch(dummyFile, textQuery);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Animated silver glow background */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#e0e0e0]/40 via-[#f0f0f0]/40 to-[#ffffff]/40 rounded-3xl blur-3xl opacity-70 animate-pulse" />
      
      <Card className="relative overflow-hidden border border-white/20 bg-black/30 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl shadow-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e0e0e0]/10 via-transparent to-[#ffffff]/10 pointer-events-none" />
        
        <Tabs defaultValue="snap" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-white/10 p-1 rounded-2xl mb-6">
            <TabsTrigger 
              value="snap" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e0e0e0] data-[state=active]:to-[#ffffff] data-[state=active]:text-black font-bold transition-all duration-300 rounded-xl"
            >
              <Camera className="w-4 h-4 mr-2" /> Snap
            </TabsTrigger>
            <TabsTrigger 
              value="text" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e0e0e0] data-[state=active]:to-[#ffffff] data-[state=active]:text-black font-bold transition-all duration-300 rounded-xl"
            >
              <MessageSquareText className="w-4 h-4 mr-2" /> Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="snap">
            <div className="flex flex-col items-center justify-center text-center gap-6">
              <AnimatePresence mode="wait">
                {!preview ? (
                  <motion.div 
                    key="initial"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full space-y-6"
                  >
                    {/* Upload area with silver gradient ring */}
                    <div 
                      className="relative mx-auto w-32 h-32 flex items-center justify-center rounded-full border-2 border-dashed border-white/30 bg-white/5 group hover:border-[#ffffff]/70 transition-all duration-300 cursor-pointer"
                      onClick={handleUpload}
                    >
                      {/* Rotating silver gradient ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#e0e0e0] via-[#f0f0f0] to-[#ffffff] opacity-0 group-hover:opacity-50 blur-md animate-spin-slow" />
                      <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_8s_linear_infinite]" />
                      {/* Camera icon with silver glow */}
                      <Camera className="w-12 h-12 text-[#C4C4C4]/70 group-hover:text-[#ffffff] transition-colors z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
                      <div className="absolute bottom-2 right-2 bg-gradient-to-r from-[#e0e0e0] to-[#ffffff] text-black rounded-full p-1.5 shadow-lg shadow-white/50">
                        <Upload className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Snap & Find
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Upload a photo or take a picture to instantly find products online.
                      </p>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-[#e0e0e0] to-[#ffffff] text-black hover:from-[#d0d0d0] hover:to-[#f0f0f0] hover:scale-[1.02] transition-all font-bold h-12 rounded-xl shadow-lg shadow-white/30"
                      onClick={handleUpload}
                    >
                      Start Visual Search <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="scanning"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full relative"
                  >
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 border-2 border-transparent bg-gradient-to-r from-[#e0e0e0] via-[#f0f0f0] to-[#ffffff] p-[2px]">
                      <div className="absolute inset-0 bg-black rounded-2xl" />
                      <img src={preview} alt="Preview" className="absolute inset-[2px] w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-2xl" />
                      
                      {isScanning && (
                        <div className="absolute inset-0 bg-white/10 z-10 backdrop-blur-[1px]">
                          <motion.div 
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-[#e0e0e0] via-[#f0f0f0] to-[#ffffff] shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ScanLine className="w-16 h-16 text-[#C4C4C4]/80 animate-pulse" />
                          </div>
                        </div>
                      )}

                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        onClick={() => setPreview(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {isScanning ? (
                        <div className="flex items-center justify-center gap-3 text-[#C4C4C4]">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium animate-pulse">Analyzing image patterns...</span>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setPreview(null)}
                          variant="outline" 
                          className="w-full border-white/10 hover:bg-white/5 text-[#C4C4C4] bg-black/20 backdrop-blur-sm rounded-xl"
                        >
                          Scan Another
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="text">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Text to Shop
                </h3>
                <p className="text-muted-foreground text-sm">
                  Describe what you're looking for in your own words.
                </p>
              </div>

              <Textarea 
                placeholder="E.g. 'Blue suede sneakers with white soles, size 10'..." 
                className="bg-white/5 border-white/10 text-[#C4C4C4] min-h-[120px] rounded-xl focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black backdrop-blur-sm"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
              />

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-[#e0e0e0] to-[#ffffff] text-black hover:from-[#d0d0d0] hover:to-[#f0f0f0] hover:scale-[1.02] transition-all font-bold h-12 rounded-xl shadow-lg shadow-white/30"
                onClick={handleTextSubmit}
                disabled={isScanning || !textQuery.trim()}
              >
                {isScanning ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding matches...</>
                ) : (
                  <>Search Products <ArrowRight className="ml-2 w-4 h-4" /></>
                )}
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="absolute -top-12 -left-12 p-4 bg-black/50 backdrop-blur border border-white/10 rounded-2xl -rotate-12 animate-float hidden md:block">
        <Sparkles className="w-6 h-6 text-[#C4C4C4]" />
      </div>
      <div className="absolute -bottom-8 -right-8 p-3 bg-black/50 backdrop-blur border border-white/10 rounded-full animate-float-delayed hidden md:block">
        <div className="w-2 h-2 rounded-full bg-white animate-ping" />
      </div>
    </div>
  );
}

export default SnapSearch;