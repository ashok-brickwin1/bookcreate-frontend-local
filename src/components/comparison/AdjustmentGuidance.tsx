import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, TrendingUp, MessageSquare, Zap, Target } from "lucide-react";

interface Adjustment {
  id: string;
  title: string;
  description: string;
  impact: string;
  icon: typeof Wrench;
}

interface AdjustmentGuidanceProps {
  adjustments: Adjustment[];
  onContinue: () => void;
}

const DEFAULT_ADJUSTMENTS: Adjustment[] = [
  {
    id: "1",
    title: "Increase directive closure by 10–15%",
    description: "End responses with clearer next steps or recommendations rather than open-ended reflections.",
    impact: "Improves perceived decisiveness in professional contexts",
    icon: Target,
  },
  {
    id: "2",
    title: "Reduce internal reflection in first response pass",
    description: "Lead with insight or action, then provide supporting context rather than thinking out loud.",
    impact: "Creates more immediate value and clarity",
    icon: Zap,
  },
  {
    id: "3",
    title: "Introduce light humor or human asides",
    description: "Add occasional warmth through relatable observations that mirror your natural speaking style.",
    impact: "Increases authenticity and approachability",
    icon: MessageSquare,
  },
  {
    id: "4",
    title: "Translate insight into explicit next steps",
    description: "When sharing wisdom or observations, follow with actionable guidance the recipient can use.",
    impact: "Improves utility and applicability of responses",
    icon: TrendingUp,
  },
  {
    id: "5",
    title: "Shift tone earlier from contemplative to catalytic",
    description: "Begin responses with energy and direction, reserving deeper reflection for later in the conversation.",
    impact: "Better matches your natural leadership presence",
    icon: Wrench,
  },
];

export const AdjustmentGuidance = ({ adjustments = DEFAULT_ADJUSTMENTS, onContinue }: AdjustmentGuidanceProps) => {
  return (
    <div className="min-h-[80vh] px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Adjustment Recommendations
          </h2>
          <p className="text-muted-foreground">
            Specific, actionable changes to align your digital twin with your authentic voice
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg text-foreground font-medium italic">
            "What should I change so the AI answers like me?"
          </p>
        </div>

        <div className="space-y-4">
          {adjustments.map((adjustment, index) => {
            const Icon = adjustment.icon;
            return (
              <div
                key={adjustment.id}
                className="glass-card rounded-xl p-5 transition-all hover:border-primary/30"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-foreground">
                        {index + 1}. {adjustment.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {adjustment.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-full px-3 py-1">
                      <TrendingUp className="w-3 h-3" />
                      {adjustment.impact}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="warm" size="lg" className="w-full gap-2" onClick={onContinue}>
          Preview Context Switching
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
