import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Loader2, Sparkles, ScanLine, ArrowRight, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function SnapSearch() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [textQuery, setTextQuery] = useState("");

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        simulateScan("Visual search successful!");
      }
    };
    input.click();
  };

  const simulateScan = (message: string) => {
    setIsScanning(true);
    setHasScanned(false);
    
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      toast({
        title: "Success!",
        description: message,
      });
      
      // Auto-open highest ranking product details
      const detailTrigger = document.getElementById('highest-rank-detail-trigger');
      detailTrigger?.click();
    }, 2500);
  };

  const handleTextSubmit = () => {
    if (!textQuery.trim()) return;
    simulateScan(`We found items matching: "${textQuery}"`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-2xl opacity-50 animate-pulse" />
      
      <Card className="relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl">
        <Tabs defaultValue="snap" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
            <TabsTrigger value="snap" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Camera className="w-4 h-4 mr-2" /> Snap
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-black">
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
                    <div className="relative mx-auto w-32 h-32 flex items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 group hover:border-primary/50 transition-colors cursor-pointer" onClick={handleUpload}>
                      <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
                      <Camera className="w-12 h-12 text-white/70 group-hover:text-primary transition-colors" />
                      <div className="absolute bottom-2 right-2 bg-primary text-black rounded-full p-1.5 shadow-lg shadow-primary/20">
                        <Upload className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-display font-bold text-white">Snap & Find</h3>
                      <p className="text-muted-foreground text-sm">
                        Upload a photo or take a picture to instantly find products online.
                      </p>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-primary text-black hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold h-12 rounded-xl"
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
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 border border-white/10 group">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      
                      {isScanning && (
                        <div className="absolute inset-0 bg-primary/10 z-10">
                          <motion.div 
                            className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ScanLine className="w-16 h-16 text-primary animate-pulse" />
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
                        <div className="flex items-center justify-center gap-3 text-primary">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium animate-pulse">Analyzing image patterns...</span>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setPreview(null)}
                          variant="outline" 
                          className="w-full border-white/10 hover:bg-white/5 text-white"
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
                <h3 className="text-2xl font-display font-bold text-white">Text to Shop</h3>
                <p className="text-muted-foreground text-sm">
                  Describe what you're looking for in your own words.
                </p>
              </div>

              <Textarea 
                placeholder="E.g. 'Blue suede sneakers with white soles, size 10'..." 
                className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-xl focus-visible:ring-primary"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
              />

              <Button 
                size="lg" 
                className="w-full bg-primary text-black hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold h-12 rounded-xl"
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
        <Sparkles className="w-6 h-6 text-secondary" />
      </div>
    </div>
  );
}
