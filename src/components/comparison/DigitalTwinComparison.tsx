import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ComparisonIntro } from "./ComparisonIntro";
import { EntitySelector } from "./EntitySelector";
import { ComparisonView } from "./ComparisonView";
import { MatchSummary } from "./MatchSummary";
import { AdjustmentGuidance } from "./AdjustmentGuidance";
import { ContextSwitcher } from "./ContextSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Step = "intro" | "select" | "comparing" | "results" | "summary" | "adjustments" | "context" | "refining";

interface Entity {
  id: string;
  name: string;
  description: string;
  type: "twin" | "human";
  source: string;
}

interface Adjustment {
  id: string;
  title: string;
  description: string;
  impact: string;
  icon: any;
}

interface DigitalTwinComparisonProps {
  twinProfile: string;
  bookTitle: string;
  bookId?: string;
  answers?: Record<string, string>;
  onClose: () => void;
  onProfileRefined?: (newProfile: string) => void;
}

export const DigitalTwinComparison = ({
  twinProfile,
  bookTitle,
  bookId,
  answers,
  onClose,
  onProfileRefined,
}: DigitalTwinComparisonProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("intro");
  const [entityA, setEntityA] = useState<Entity | null>(null);
  const [entityB, setEntityB] = useState<Entity | null>(null);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(twinProfile);
  const [refinementCount, setRefinementCount] = useState(0);

  const saveComparisonToDatabase = async (result: any, comparedModel: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user logged in, skipping save");
        return;
      }

      const { error } = await supabase.from("digital_twin_comparisons" as any).insert({
        user_id: user.id,
        book_id: bookId || null,
        digital_twin_profile: currentProfile,
        compared_model: comparedModel,
        overall_alignment: result.overallAlignment,
        voice_tone_data: result.voiceTone,
        values_intent_data: result.valuesIntent,
        knowledge_depth_data: result.knowledgeDepth,
        decision_posture_data: result.decisionPosture,
        relational_style_data: result.relationalStyle,
        match_summary: result.summaryNarrative,
        adjustments: result.adjustments || [],
        refinement_count: refinementCount,
      });

      if (error) {
        console.error("Error saving comparison:", error);
      } else {
        console.log("Comparison saved successfully");
      }
    } catch (error) {
      console.error("Error saving comparison to database:", error);
    }
  };

  const handleCompare = async (a: Entity, b: Entity) => {
    setEntityA(a);
    setEntityB(b);
    setStep("comparing");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("compare-digital-twins", {
        body: {
          twinProfile: currentProfile,
          bookTitle,
          comparisonModel: b.source,
        },
      });

      if (error) throw error;

      setComparisonResult(data);
      
      // Save comparison to database
      await saveComparisonToDatabase(data, b.source);
      
      setStep("results");
    } catch (error) {
      console.error("Comparison error:", error);
      toast({
        variant: "destructive",
        title: "Comparison failed",
        description: "There was an error comparing the digital twins. Please try again.",
      });
      setStep("select");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!comparisonResult?.adjustments && !comparisonResult) {
      toast({
        title: "No adjustments available",
        description: "Please complete a comparison first to get adjustment recommendations.",
      });
      return;
    }

    setStep("refining");
    setLoading(true);

    try {
      const adjustmentsToApply = comparisonResult.adjustments || [
        { id: "1", title: "Increase directive closure", description: "End responses with clearer next steps" },
        { id: "2", title: "Reduce internal reflection", description: "Lead with insight, then context" },
        { id: "3", title: "Add light humor", description: "Include warmth through relatable observations" },
      ];

      const { data, error } = await supabase.functions.invoke("refine-digital-twin", {
        body: {
          twinProfile: currentProfile,
          adjustments: adjustmentsToApply,
          answers: answers || {},
          bookTitle,
        },
      });

      if (error) throw error;

      setCurrentProfile(data.profile);
      setRefinementCount((prev) => prev + 1);
      
      if (onProfileRefined) {
        onProfileRefined(data.profile);
      }

      toast({
        title: "Digital Twin Refined!",
        description: `Applied ${data.appliedAdjustments} adjustments. Your twin is now more aligned with your authentic voice.`,
      });

      // Reset to allow re-comparison with the refined profile
      setComparisonResult(null);
      setStep("intro");
    } catch (error) {
      console.error("Refinement error:", error);
      toast({
        variant: "destructive",
        title: "Refinement failed",
        description: "There was an error refining your digital twin. Please try again.",
      });
      setStep("context");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <ComparisonIntro 
            onStart={() => setStep("select")} 
            refinementCount={refinementCount}
          />
        );
      
      case "select":
        return (
          <EntitySelector
            twinProfile={currentProfile}
            bookTitle={bookTitle}
            onCompare={handleCompare}
          />
        );
      
      case "comparing":
        return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Analyzing digital twin alignment...</p>
          </div>
        );
      
      case "results":
        return comparisonResult && (
          <ComparisonView
            entityAName={entityA?.name || "Your Twin"}
            entityBName={entityB?.name || "Comparison Model"}
            result={comparisonResult}
            onContinue={() => setStep("summary")}
          />
        );
      
      case "summary":
        return comparisonResult && (
          <MatchSummary
            overallAlignment={comparisonResult.overallAlignment}
            summaryNarrative={comparisonResult.summaryNarrative || "This Digital Twin accurately reflects values, intent, and relational orientation. Small adjustments to tone, decisiveness, and applied framing would significantly improve representation in professional contexts."}
            onContinue={() => setStep("adjustments")}
          />
        );
      
      case "adjustments":
        return (
          <AdjustmentGuidance
            adjustments={comparisonResult?.adjustments || []}
            onContinue={() => setStep("context")}
          />
        );
      
      case "context":
        return (
          <ContextSwitcher
            bookTitle={bookTitle}
            onRefine={handleRefine}
          />
        );

      case "refining":
        return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Applying adjustments to your digital twin...</p>
            <p className="text-xs text-muted-foreground mt-2">This may take a moment</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Book
          </Button>
          <div className="flex items-center gap-4">
            {refinementCount > 0 && (
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                Refined {refinementCount}x
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              Digital Twin Comparison
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {renderStep()}
    </div>
  );
};
