import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, RefreshCw } from "lucide-react";

interface ComparisonIntroProps {
  onStart: () => void;
  refinementCount?: number;
}

export const ComparisonIntro = ({ onStart, refinementCount = 0 }: ComparisonIntroProps) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center space-y-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>

        {refinementCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary">
            <RefreshCw className="w-4 h-4" />
            Your twin has been refined {refinementCount} time{refinementCount > 1 ? "s" : ""}
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
          {refinementCount > 0 
            ? "Let's see how your refined Digital Twin compares now"
            : "How closely does this Digital Twin actually represent you?"}
        </h1>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          AI systems speak <em>for</em> people every day — in emails, decisions, content, coaching, and automation.
          When they miss the mark, it's rarely about intelligence.
          It's about <strong className="text-foreground">context, tone, and values</strong>.
        </p>
        
        <div className="glass-card rounded-2xl p-6 text-left space-y-3 bg-muted/20">
          <p className="text-sm text-muted-foreground">This tool lets you compare digital twins to see:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>What matches your authentic voice</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>What's missing or misaligned</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>What adjustments help the AI respond <em>as you would</em></span>
            </li>
          </ul>
        </div>
        
        <Button variant="warm" size="lg" onClick={onStart} className="gap-2">
          {refinementCount > 0 ? "Compare Again" : "Start Comparison"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
