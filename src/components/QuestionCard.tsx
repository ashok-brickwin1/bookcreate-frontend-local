import { useState } from "react";
import { Question, categories, lifeStages } from "@/data/bookQuestions";
import { AIAssistant } from "./AIAssistant";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Calendar, Sparkles, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuestionCardProps {
  question: Question;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard = ({
  question,
  answer,
  onAnswerChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) => {
  const category = categories.find((c) => c.id === question.category);
  const lifeStage = lifeStages.find((s) => s.id === question.lifeStage);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showEraDialog, setShowEraDialog] = useState(false);
  const [eraYear, setEraYear] = useState("");
  const [eraContext, setEraContext] = useState("");
  const [eraResult, setEraResult] = useState<string | null>(null);
  const [isLoadingEra, setIsLoadingEra] = useState(false);

  const handleSuggestion = (suggestion: string) => {
    if (!answer) {
      onAnswerChange(suggestion);
    } else {
      onAnswerChange(answer + "\n\n" + suggestion);
    }
    setShowSuggestion(false);
  };

  const fetchEraContext = async () => {
    if (!eraYear) {
      toast.error("Please enter a year");
      return;
    }

    setIsLoadingEra(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-era-context", {
        body: { year: eraYear, context: eraContext || undefined },
      });

      if (error) throw error;
      
      setEraResult(data.eraContext);
    } catch (error) {
      console.error("Error fetching era context:", error);
      if (error instanceof Error && error.message.includes("429")) {
        toast.error("Rate limit exceeded. Please try again in a moment.");
      } else if (error instanceof Error && error.message.includes("402")) {
        toast.error("AI credits exhausted. Please add credits to continue.");
      } else {
        toast.error("Failed to fetch era context");
      }
    } finally {
      setIsLoadingEra(false);
    }
  };

  const addEraToAnswer = () => {
    if (eraResult) {
      const contextNote = `\n\n--- Context from ${eraYear} ---\n${eraResult}`;
      onAnswerChange(answer + contextNote);
      setShowEraDialog(false);
      setEraResult(null);
      setEraYear("");
      setEraContext("");
      toast.success("Era context added to your answer");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      {/* Progress indicator with life stage */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category?.icon}</span>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{category?.title}</p>
            <p className="text-xs text-muted-foreground/70">{question.subSection}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-muted-foreground">
            {questionNumber} of {totalQuestions}
          </span>
          {lifeStage && (
            <p className="text-xs text-primary/70 flex items-center justify-end gap-1 mt-1">
              <Clock className="h-3 w-3" />
              {lifeStage.title}
            </p>
          )}
        </div>
      </div>

      {/* Life Stage Badge */}
      {lifeStage && (
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs">
            <Clock className="h-3 w-3" />
            <span>{lifeStage.title}</span>
            <span className="text-primary/60">·</span>
            <span className="text-primary/70">{lifeStage.description}</span>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground leading-tight">
          {question.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {question.prompt}
        </p>
        {question.helpText && (
          <p className="text-sm text-muted-foreground/70 italic">
            {question.helpText}
          </p>
        )}
      </div>

      {/* Context Prompt - helps user think about the era */}
      {question.contextPrompt && (
        <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/10">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Think about the context</p>
              <p className="text-sm text-muted-foreground">{question.contextPrompt}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEraDialog(true)}
                className="mt-3 gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Get Era Context
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Answer textarea */}
      <div className="mt-8">
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Share your thoughts... Include when this happened and what was going on in your life at the time."
          className={cn(
            "w-full min-h-[200px] p-6 rounded-2xl",
            "bg-card border border-border",
            "text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
            "resize-none transition-all duration-300",
            "text-lg leading-relaxed"
          )}
        />
        
        <div className="flex items-center justify-between mt-4">
          <AIAssistant
            question={question.prompt}
            currentAnswer={answer}
            onSuggestion={handleSuggestion}
          />
          
          <p className="text-sm text-muted-foreground">
            {answer.length > 0 && `${answer.split(/\s+/).filter(Boolean).length} words`}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12">
        <Button
          variant="ghost"
          onClick={onPrev}
          disabled={isFirst}
          className={cn(isFirst && "invisible")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <Button
          variant={isLast ? "warm" : "hero"}
          onClick={onNext}
          size="lg"
        >
          {isLast ? (
            <>
              Complete
              <Check className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Era Context Dialog */}
      <Dialog open={showEraDialog} onOpenChange={setShowEraDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Explore the Era
            </DialogTitle>
            <DialogDescription>
              Enter the year when this happened to get context about what life was like then—the news, culture, technology, and events that shaped that time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="eraYear">What year was this?</Label>
              <Input
                id="eraYear"
                type="number"
                value={eraYear}
                onChange={(e) => setEraYear(e.target.value)}
                placeholder="e.g., 1995"
                min="1900"
                max={new Date().getFullYear()}
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eraContext">What was happening in your life? (optional)</Label>
              <Textarea
                id="eraContext"
                value={eraContext}
                onChange={(e) => setEraContext(e.target.value)}
                placeholder="e.g., Starting my first job, getting married, moving to a new city..."
                className="min-h-[80px] resize-none"
              />
            </div>

            {!eraResult && (
              <Button
                onClick={fetchEraContext}
                disabled={!eraYear || isLoadingEra}
                className="w-full gap-2"
              >
                {isLoadingEra ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Researching {eraYear}...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Get Context for {eraYear || "Year"}
                  </>
                )}
              </Button>
            )}

            {eraResult && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50 border border-border max-h-[300px] overflow-y-auto">
                  <h4 className="font-medium text-foreground mb-2">Life in {eraYear}</h4>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {eraResult}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEraResult(null);
                      setEraYear("");
                      setEraContext("");
                    }}
                    className="flex-1"
                  >
                    Try Different Year
                  </Button>
                  <Button
                    onClick={addEraToAnswer}
                    className="flex-1 gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Add to Answer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
