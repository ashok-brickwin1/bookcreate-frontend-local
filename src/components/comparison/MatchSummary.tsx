import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

interface MatchSummaryProps {
  overallAlignment: number;
  summaryNarrative: string;
  onContinue: () => void;
}

export const MatchSummary = ({ overallAlignment, summaryNarrative, onContinue }: MatchSummaryProps) => {
  const getAlignmentColor = () => {
    if (overallAlignment >= 85) return "text-emerald-500";
    if (overallAlignment >= 70) return "text-amber-500";
    return "text-orange-500";
  };

  const getAlignmentIcon = () => {
    if (overallAlignment >= 85) return CheckCircle;
    return AlertCircle;
  };

  const Icon = getAlignmentIcon();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Match Summary
          </h2>
          <p className="text-muted-foreground">
            A clear, human-readable assessment
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 text-center space-y-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background">
            <Icon className={`w-8 h-8 ${getAlignmentColor()}`} />
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall Alignment</p>
            <div className={`text-6xl font-display font-bold ${getAlignmentColor()}`}>
              {overallAlignment}%
            </div>
          </div>

          <p className="text-foreground leading-relaxed">
            {summaryNarrative}
          </p>
        </div>

        <div className="glass-card rounded-xl p-5 bg-muted/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">What this means</p>
              <p>
                Your digital twin captures your authentic voice well. Small calibrations 
                to tone and decision framing will significantly improve how it represents 
                you in professional contexts.
              </p>
            </div>
          </div>
        </div>

        <Button variant="warm" size="lg" className="w-full gap-2" onClick={onContinue}>
          View Adjustment Recommendations
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
