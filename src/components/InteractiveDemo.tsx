import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MessageSquare, 
  Printer, 
  Brain, 
  ChevronLeft, 
  ChevronRight,
  User,
  Globe,
  Linkedin,
  BookOpen,
  Mic,
  CheckCircle2,
  FileText,
  Sparkles,
  Shield,
  Play,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveDemoProps {
  onStart?: () => void;
}

const stages = [
  {
    id: 1,
    title: "Digital Footprint",
    subtitle: "We research your public presence",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: 2,
    title: "Personal Narrative",
    subtitle: "You share your deeper story",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    id: 3,
    title: "Publish Everywhere",
    subtitle: "Your book goes live",
    icon: Printer,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    id: 4,
    title: "Your Digital Twin",
    subtitle: "AI that thinks like you",
    icon: Brain,
    color: "from-primary to-accent",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
];

const LLM_MODELS = [
  { 
    id: "gemini-pro", 
    name: "Gemini Pro", 
    provider: "Google",
    response: "Based on your values of integrity and family first, I would recommend choosing the path that prioritizes long-term relationships over short-term gains. Your story shows a consistent pattern of valuing trust and authenticity..."
  },
  { 
    id: "gpt-5", 
    name: "GPT-5", 
    provider: "OpenAI",
    response: "Looking at your decision-making history, you've consistently chosen paths aligned with your core principles. I'd suggest the option that honors your commitment to family—it mirrors the choices that brought you success and fulfillment before..."
  },
  { 
    id: "gemini-flash", 
    name: "Gemini Flash", 
    provider: "Google",
    response: "Quick analysis: Your values prioritize family and integrity. The first option aligns better with your documented preferences. Go with it—it matches your proven decision patterns..."
  },
  { 
    id: "gpt-5-mini", 
    name: "GPT-5 Mini", 
    provider: "OpenAI",
    response: "Based on your profile: Choose Option A. It aligns with your family-first values and mirrors successful past decisions you've made in similar situations..."
  },
];

const SOURCES_TO_SCAN = [
  { name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
  { name: "Twitter/X", icon: Twitter, color: "text-sky-500" },
  { name: "Facebook", icon: Facebook, color: "text-blue-500" },
  { name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { name: "YouTube", icon: Youtube, color: "text-red-500" },
  { name: "Articles", icon: FileText, color: "text-amber-500" },
  { name: "Career", icon: Briefcase, color: "text-emerald-500" },
  { name: "Education", icon: GraduationCap, color: "text-purple-500" },
  { name: "Email History", icon: Mail, color: "text-orange-500" },
  { name: "Web Presence", icon: Globe, color: "text-cyan-500" },
];

export const InteractiveDemo = ({ onStart }: InteractiveDemoProps) => {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [scannedSources, setScannedSources] = useState<number[]>([]);
  const [selectedModelId, setSelectedModelId] = useState("gemini-pro");
  const [hasCompletedInitialScan, setHasCompletedInitialScan] = useState(false);

  const selectedModel = LLM_MODELS.find(m => m.id === selectedModelId) || LLM_MODELS[0];

  // Handle model selection - restart typing with new response
  const handleModelSelect = useCallback((modelId: string) => {
    if (modelId === selectedModelId) return;
    
    setSelectedModelId(modelId);
    const model = LLM_MODELS.find(m => m.id === modelId);
    if (!model || !hasCompletedInitialScan) return;

    // Restart typing animation with new model's response
    setTypedText("");
    setIsTyping(true);
    
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < model.response.length) {
        setTypedText(model.response.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 25);
  }, [selectedModelId, hasCompletedInitialScan]);

  // Thinking + Typing animation effect for stage 4
  useEffect(() => {
    if (activeStage === 3) {
      setTypedText("");
      setIsTyping(false);
      setIsThinking(true);
      setCurrentSourceIndex(0);
      setScannedSources([]);
      setHasCompletedInitialScan(false);
      setSelectedModelId("gemini-pro");
      
      // Scan through sources one by one
      let sourceIndex = 0;
      const scanInterval = setInterval(() => {
        if (sourceIndex < SOURCES_TO_SCAN.length) {
          setCurrentSourceIndex(sourceIndex);
          setScannedSources(prev => [...prev, sourceIndex]);
          sourceIndex++;
        } else {
          clearInterval(scanInterval);
          setIsThinking(false);
          setHasCompletedInitialScan(true);
          
          // Start typing after thinking completes
          setIsTyping(true);
          let charIndex = 0;
          const response = LLM_MODELS[0].response;
          const typingInterval = setInterval(() => {
            if (charIndex < response.length) {
              setTypedText(response.slice(0, charIndex + 1));
              charIndex++;
            } else {
              clearInterval(typingInterval);
              setIsTyping(false);
            }
          }, 25);
        }
      }, 300);

      return () => clearInterval(scanInterval);
    } else {
      setHasCompletedInitialScan(false);
    }
  }, [activeStage]);

  const handleNext = () => {
    if (activeStage < stages.length - 1) {
      setActiveStage(activeStage + 1);
    }
  };

  const handlePrev = () => {
    if (activeStage > 0) {
      setActiveStage(activeStage - 1);
    }
  };

  const handleAutoPlay = () => {
    setIsPlaying(true);
    setActiveStage(0);
    
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= stages.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setActiveStage(current);
      }
    }, 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 shadow-elevated overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-2">
          See the Complete Journey
        </h3>
        <p className="text-muted-foreground">
          Click through each stage to understand how your story becomes a digital twin
        </p>
      </div>

      {/* Stage Navigation Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {stages.map((stage, index) => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(index)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
              activeStage === index
                ? "bg-primary text-primary-foreground shadow-glow"
                : "bg-card hover:bg-muted border border-border"
            )}
          >
            <stage.icon className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{stage.title}</span>
            <span className="text-sm font-medium sm:hidden">{stage.id}</span>
          </button>
        ))}
      </div>

      {/* Stage Content */}
      <div className="relative min-h-[400px] md:min-h-[450px]">
        {/* Stage 1: Digital Footprint */}
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          activeStage === 0 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        )}>
          <div className="grid md:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-medium text-foreground">Digital Footprint</h4>
                  <p className="text-sm text-muted-foreground">Automated research gathers your public presence</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "LinkedIn profile & career history",
                  "Published articles & interviews",
                  "Social media presence",
                  "Professional achievements"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-xs">
                {/* Animated search visualization */}
                <div className="glass-card rounded-2xl p-6 border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <User className="h-10 w-10 text-blue-500 p-2 bg-blue-500/10 rounded-xl" />
                    <div>
                      <div className="h-3 w-24 bg-foreground/20 rounded animate-pulse" />
                      <div className="h-2 w-16 bg-muted-foreground/20 rounded mt-2" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[Globe, Linkedin, FileText].map((Icon, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 animate-fade-in"
                        style={{ animationDelay: `${0.5 + i * 0.2}s` }}
                      >
                        <Icon className="h-4 w-4 text-blue-500" />
                        <div className="h-2 bg-foreground/10 rounded flex-1" />
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20 blur-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Stage 2: Personal Narrative */}
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          activeStage === 1 ? "opacity-100 translate-x-0" : activeStage < 1 ? "opacity-0 -translate-x-full pointer-events-none" : "opacity-0 translate-x-full pointer-events-none"
        )}>
          <div className="grid md:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-medium text-foreground">Personal Narrative</h4>
                  <p className="text-sm text-muted-foreground">Guided interviews capture your deeper story</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Voice-first conversational interviews",
                  "Four life quadrants explored",
                  "AI validates your meaning",
                  "Era-aware historical context"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <CheckCircle2 className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-xs">
                {/* Interview visualization */}
                <div className="glass-card rounded-2xl p-6 border border-purple-500/30">
                  <div className="text-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 animate-pulse">
                      <Mic className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground">Listening...</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 bg-purple-500/5 border border-purple-500/20">
                    <p className="text-sm text-foreground italic">"What moment changed everything for you?"</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 justify-center">
                    <div className="h-1 w-8 bg-purple-500 rounded animate-pulse" />
                    <div className="h-1 w-4 bg-purple-400 rounded animate-pulse" style={{ animationDelay: "0.1s" }} />
                    <div className="h-1 w-6 bg-purple-500 rounded animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="h-1 w-3 bg-purple-400 rounded animate-pulse" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Stage 3: Publish Everywhere */}
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          activeStage === 2 ? "opacity-100 translate-x-0" : activeStage < 2 ? "opacity-0 -translate-x-full pointer-events-none" : "opacity-0 translate-x-full pointer-events-none"
        )}>
          <div className="grid md:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Printer className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-medium text-foreground">Publish Everywhere</h4>
                  <p className="text-sm text-muted-foreground">Your book reaches any platform</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "PDF & EPUB formats",
                  "Print-on-demand ready",
                  "Major bookstore distribution",
                  "Custom cover design"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Book visualization */}
                <div className="relative">
                  <div className="w-32 h-44 rounded-r-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-elevated transform perspective-500 rotate-y-[-5deg]">
                    <div className="absolute inset-2 bg-card/90 rounded-r flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-amber-500" />
                    </div>
                  </div>
                  {/* Flying formats */}
                  {["PDF", "EPUB", "Print"].map((format, i) => (
                    <div
                      key={format}
                      className="absolute glass-card px-3 py-1 rounded-full text-xs font-medium border border-amber-500/30 animate-float"
                      style={{
                        top: `${20 + i * 30}%`,
                        right: `-${60 + i * 20}px`,
                        animationDelay: `${i * 0.3}s`,
                      }}
                    >
                      {format}
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 opacity-20 blur-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Stage 4: Digital Twin */}
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          activeStage === 3 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
        )}>
          <div className="grid md:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-medium text-foreground">Your Digital Twin</h4>
                  <p className="text-sm text-muted-foreground">AI that truly thinks like you</p>
                </div>
              </div>
              <ul className="space-y-3 mb-4">
                {[
                  "Captures your thinking patterns",
                  "Makes decisions aligned with your values",
                  "Answers questions as you would",
                  "Keeps your AI safe & authentic"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              
              {/* LLM Selection */}
              <div className="glass-card rounded-xl p-4 border border-primary/20 bg-primary/5">
                <p className="text-xs text-muted-foreground mb-2">Choose your AI model: <span className="text-primary">(click to switch)</span></p>
                <div className="grid grid-cols-2 gap-2">
                  {LLM_MODELS.map((model) => {
                    const isSelected = model.id === selectedModelId;
                    return (
                      <div
                        key={model.id}
                        onClick={() => handleModelSelect(model.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer",
                          isSelected 
                            ? "bg-primary text-primary-foreground shadow-glow" 
                            : "bg-card border border-border hover:border-primary/50 hover:bg-muted/50",
                          !hasCompletedInitialScan && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className={cn(
                          "h-2 w-2 rounded-full transition-all",
                          isSelected ? "bg-white" : "bg-muted-foreground/30"
                        )} />
                        <div>
                          <p className={cn("font-medium", isSelected ? "text-primary-foreground" : "text-foreground")}>{model.name}</p>
                          <p className={cn("text-[10px]", isSelected ? "text-primary-foreground/70" : "text-muted-foreground")}>{model.provider}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Twin visualization */}
                <div className="glass-card rounded-2xl p-6 border border-primary/30 max-w-xs">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                      <Brain className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Your Digital Twin</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3 text-green-500" />
                        Powered by {selectedModel.name}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="glass-card rounded-lg p-3 bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Question:</p>
                      <p className="text-sm text-foreground">"What would I decide here?"</p>
                    </div>
                    <div className="glass-card rounded-lg p-3 bg-primary/5 border border-primary/20 min-h-[80px]">
                      <p className="text-xs text-primary mb-2 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Response:
                      </p>
                      
                      {isThinking ? (
                        <div className="space-y-2">
                          {/* Scanning sources animation */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Search className="h-3 w-3 animate-pulse" />
                            <span>Scanning your story...</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {SOURCES_TO_SCAN.map((source, idx) => {
                              const SourceIcon = source.icon;
                              const isScanned = scannedSources.includes(idx);
                              const isCurrent = currentSourceIndex === idx;
                              return (
                                <div
                                  key={source.name}
                                  className={cn(
                                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-300",
                                    isScanned 
                                      ? "bg-green-500/10 border border-green-500/30" 
                                      : isCurrent 
                                        ? "bg-primary/20 border border-primary/40 animate-pulse"
                                        : "bg-muted/30 border border-border/50 opacity-40"
                                  )}
                                >
                                  <SourceIcon className={cn("h-3 w-3", isScanned ? "text-green-500" : source.color)} />
                                  <span className={isScanned ? "text-green-600" : "text-muted-foreground"}>
                                    {source.name}
                                  </span>
                                  {isScanned && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                </div>
                              );
                            })}
                          </div>
                          {/* Pulsing dots */}
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs text-muted-foreground">Thinking</span>
                            <span className="flex gap-0.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground">
                          "{typedText}
                          {isTyping && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent opacity-30 blur-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={activeStage === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoPlay}
            disabled={isPlaying}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isPlaying ? "Playing..." : "Auto-play"}
          </Button>

          {activeStage === stages.length - 1 && onStart && (
            <Button variant="hero" size="sm" onClick={onStart} className="gap-2">
              Start Your Journey
              <Sparkles className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={activeStage === stages.length - 1}
          className="gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-4">
        {stages.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveStage(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              activeStage === index ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveDemo;
