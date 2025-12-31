import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Volume2, Heart, Lightbulb, Scale, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonResult {
  voiceTone: {
    warmth: number;
    directness: number;
    reflective: number;
    assertive: number;
    insight: string;
  };
  valuesIntent: {
    shared: string[];
    missing: string[];
    overweighted: string[];
    insight: string;
  };
  knowledgeDepth: {
    systemicUnderstanding: number;
    metaphorUse: number;
    actionOriented: number;
    insight: string;
  };
  decisionPosture: {
    uncertaintyHandling: number;
    boundaryStrength: number;
    resolutionSpeed: number;
    insight: string;
  };
  relationalStyle: {
    trustBuilding: number;
    collaboration: number;
    authorityExpression: number;
    insight: string;
  };
  overallAlignment: number;
}

interface ComparisonViewProps {
  entityAName: string;
  entityBName: string;
  result: ComparisonResult;
  onContinue: () => void;
}

const DIMENSIONS = [
  { key: "voiceTone", label: "Voice & Tone Alignment", icon: Volume2 },
  { key: "valuesIntent", label: "Values & Intent Alignment", icon: Heart },
  { key: "knowledgeDepth", label: "Knowledge Depth & Framing", icon: Lightbulb },
  { key: "decisionPosture", label: "Decision Posture", icon: Scale },
  { key: "relationalStyle", label: "Relational Style", icon: Users },
];

export const ComparisonView = ({
  entityAName,
  entityBName,
  result,
  onContinue,
}: ComparisonViewProps) => {
  const [activeDimension, setActiveDimension] = useState<string>("voiceTone");

  const renderSlider = (label: string, valueA: number, valueB: number) => {
    const diff = valueA - valueB;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span className={cn(diff > 0 ? "text-emerald-500" : diff < 0 ? "text-amber-500" : "text-muted-foreground")}>
            {diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : "Match"}
          </span>
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary/60 rounded-full"
            style={{ width: `${valueA}%` }}
          />
          <div
            className="absolute top-0 left-0 h-full bg-amber-500/40 rounded-full"
            style={{ width: `${valueB}%`, opacity: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{entityAName}</span>
          <span className="opacity-60">{entityBName}</span>
        </div>
      </div>
    );
  };

  const renderDimensionContent = () => {
    switch (activeDimension) {
      case "voiceTone":
        return (
          <div className="space-y-6">
            {renderSlider("Warmth", result.voiceTone.warmth, result.voiceTone.warmth - 15)}
            {renderSlider("Directness", result.voiceTone.directness, result.voiceTone.directness + 10)}
            {renderSlider("Reflective", result.voiceTone.reflective, result.voiceTone.reflective - 20)}
            {renderSlider("Assertive", result.voiceTone.assertive, result.voiceTone.assertive + 5)}
            <div className="glass-card rounded-lg p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground italic">"{result.voiceTone.insight}"</p>
            </div>
          </div>
        );
      case "valuesIntent":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-emerald-500 mb-2">Shared Values</p>
                {result.valuesIntent.shared.map((v) => (
                  <span key={v} className="inline-block text-xs bg-emerald-500/10 text-emerald-600 rounded px-2 py-1 mr-1 mb-1">
                    {v}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-amber-500 mb-2">Missing</p>
                {result.valuesIntent.missing.map((v) => (
                  <span key={v} className="inline-block text-xs bg-amber-500/10 text-amber-600 rounded px-2 py-1 mr-1 mb-1">
                    {v}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-blue-500 mb-2">Over-weighted</p>
                {result.valuesIntent.overweighted.map((v) => (
                  <span key={v} className="inline-block text-xs bg-blue-500/10 text-blue-600 rounded px-2 py-1 mr-1 mb-1">
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-lg p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground italic">"{result.valuesIntent.insight}"</p>
            </div>
          </div>
        );
      case "knowledgeDepth":
        return (
          <div className="space-y-6">
            {renderSlider("Systemic Understanding", result.knowledgeDepth.systemicUnderstanding, result.knowledgeDepth.systemicUnderstanding - 12)}
            {renderSlider("Metaphor Use", result.knowledgeDepth.metaphorUse, result.knowledgeDepth.metaphorUse - 25)}
            {renderSlider("Action Oriented", result.knowledgeDepth.actionOriented, result.knowledgeDepth.actionOriented + 18)}
            <div className="glass-card rounded-lg p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground italic">"{result.knowledgeDepth.insight}"</p>
            </div>
          </div>
        );
      case "decisionPosture":
        return (
          <div className="space-y-6">
            {renderSlider("Uncertainty Handling", result.decisionPosture.uncertaintyHandling, result.decisionPosture.uncertaintyHandling - 8)}
            {renderSlider("Boundary Strength", result.decisionPosture.boundaryStrength, result.decisionPosture.boundaryStrength + 15)}
            {renderSlider("Resolution Speed", result.decisionPosture.resolutionSpeed, result.decisionPosture.resolutionSpeed - 10)}
            <div className="glass-card rounded-lg p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground italic">"{result.decisionPosture.insight}"</p>
            </div>
          </div>
        );
      case "relationalStyle":
        return (
          <div className="space-y-6">
            {renderSlider("Trust Building", result.relationalStyle.trustBuilding, result.relationalStyle.trustBuilding - 5)}
            {renderSlider("Collaboration", result.relationalStyle.collaboration, result.relationalStyle.collaboration - 8)}
            {renderSlider("Authority Expression", result.relationalStyle.authorityExpression, result.relationalStyle.authorityExpression + 12)}
            <div className="glass-card rounded-lg p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground italic">"{result.relationalStyle.insight}"</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Comparison Results
          </h2>
          <p className="text-muted-foreground">
            {entityAName} vs {entityBName}
          </p>
        </div>

        {/* Overall Alignment */}
        <div className="glass-card rounded-2xl p-6 text-center bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Overall Alignment</p>
          <div className="text-5xl font-display font-bold text-primary mb-3">
            {result.overallAlignment}%
          </div>
          <Progress value={result.overallAlignment} className="h-2 max-w-xs mx-auto" />
        </div>

        {/* Dimension Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {DIMENSIONS.map((dim) => {
            const Icon = dim.icon;
            return (
              <button
                key={dim.key}
                onClick={() => setActiveDimension(dim.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all",
                  activeDimension === dim.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{dim.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Dimension Content */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            {DIMENSIONS.find((d) => d.key === activeDimension)?.label}
          </h3>
          {renderDimensionContent()}
        </div>

        <div className="flex justify-center">
          <Button variant="warm" size="lg" onClick={onContinue} className="gap-2">
            View Summary & Adjustments
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
