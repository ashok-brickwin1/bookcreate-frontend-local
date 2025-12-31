import { Book, Brain, Sparkles } from "lucide-react";

const ThinkingPatternsAnimation = () => {
  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      {/* Book Icon */}
      <div className="relative z-10 h-14 w-14 rounded-2xl bg-coral-glow flex items-center justify-center">
        <Book className="h-7 w-7 text-primary" />
      </div>

      {/* Animated flowing particles/patterns */}
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-24 h-8 flex items-center justify-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{
              left: `${i * 20}%`,
              animationDelay: `${i * 0.15}s`,
              opacity: 0.4 + i * 0.15,
            }}
          />
        ))}
        
        {/* Flowing line */}
        <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 100 20">
          <path
            d="M0,10 Q25,0 50,10 T100,10"
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-pulse"
            style={{ animationDuration: '2s' }}
          />
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated sparkles along the path */}
        {[0, 1, 2].map((i) => (
          <Sparkles
            key={`sparkle-${i}`}
            className="absolute h-3 w-3 text-primary/60 animate-bounce"
            style={{
              left: `${20 + i * 30}%`,
              top: i % 2 === 0 ? '-2px' : '12px',
              animationDelay: `${i * 0.3}s`,
              animationDuration: '1.5s',
            }}
          />
        ))}
      </div>

      {/* Brain/Digital Twin Icon */}
      <div className="relative z-10 h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center ml-24 animate-pulse" style={{ animationDuration: '3s' }}>
        <Brain className="h-7 w-7 text-primary" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
      </div>

      {/* Thinking pattern labels */}
      <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-2 text-[10px] text-muted-foreground">
        <span>Your Story</span>
        <span>Thinking Patterns</span>
        <span>Digital Twin</span>
      </div>
    </div>
  );
};

export default ThinkingPatternsAnimation;
