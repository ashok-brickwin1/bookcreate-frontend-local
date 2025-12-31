import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, User, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIChoice {
  label: string;
  preview: string;
  full: string;
}

interface AIResponse {
  choice1: AIChoice;
  choice2: AIChoice;
  encouragement: string;
}

interface AIAssistantProps {
  question: string;
  currentAnswer: string;
  onSuggestion: (suggestion: string) => void;
  className?: string;
}

type AIMode = "generic" | "twin" | null;

export const AIAssistant = ({ question, currentAnswer, onSuggestion, className }: AIAssistantProps) => {
  const [mode, setMode] = useState<AIMode>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<1 | 2 | null>(null);
  const { toast } = useToast();

  const generateSuggestions = async (selectedMode: AIMode) => {
    if (!selectedMode) return;
    
    setIsGenerating(true);
    setAiResponse(null);
    setSelectedChoice(null);

    try {
      const { data, error } = await supabase.functions.invoke('enhance-answer', {
        body: {
          question,
          userAnswer: currentAnswer,
          mode: selectedMode
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAiResponse(data);
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "AI Assistant",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (!mode) {
      setShowModeSelector(true);
      return;
    }
    generateSuggestions(mode);
  };

  const selectMode = (selectedMode: AIMode) => {
    setMode(selectedMode);
    setShowModeSelector(false);
    generateSuggestions(selectedMode);
  };

  const handleChoiceSelect = (choice: 1 | 2) => {
    setSelectedChoice(choice);
    const selected = choice === 1 ? aiResponse?.choice1 : aiResponse?.choice2;
    if (selected) {
      onSuggestion(selected.full);
      toast({
        title: "✨ Answer Updated",
        description: "Your answer has been enhanced! Feel free to edit it further.",
      });
    }
  };

  const handleRegenerate = () => {
    generateSuggestions(mode);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode Selector */}
      {showModeSelector && (
        <div className="glass-card rounded-2xl p-6 animate-scale-in">
          <p className="text-sm text-muted-foreground mb-4">Choose your AI assistant:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => selectMode("generic")}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary hover:border-primary/20 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-sky-light flex items-center justify-center">
                <Bot className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Generic AI</p>
                <p className="text-xs text-muted-foreground">Universal assistance</p>
              </div>
            </button>
            
            <button
              onClick={() => selectMode("twin")}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary hover:border-primary/20 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-coral-light flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Digital Twin</p>
                <p className="text-xs text-muted-foreground">Your personalized AI</p>
              </div>
            </button>
          </div>
          
          <button
            onClick={() => setShowModeSelector(false)}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
          >
            Cancel
          </button>
        </div>
      )}

      {/* AI Response with Choices */}
      {aiResponse && !showModeSelector && (
        <div className="glass-card rounded-2xl p-6 animate-scale-in space-y-4">
          {/* Encouragement */}
          <p className="text-sm text-primary font-medium text-center">
            {aiResponse.encouragement}
          </p>
          
          {/* Choice Cards */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose an enhancement:</p>
            
            {/* Choice 1 */}
            <button
              onClick={() => handleChoiceSelect(1)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-300",
                selectedChoice === 1 
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20" 
                  : "border-border bg-card hover:bg-secondary hover:border-primary/20"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  selectedChoice === 1 ? "bg-primary text-primary-foreground" : "bg-accent/20"
                )}>
                  {selectedChoice === 1 ? <Check className="h-4 w-4" /> : <span className="text-xs font-medium">1</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{aiResponse.choice1.label}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{aiResponse.choice1.full}</p>
                </div>
              </div>
            </button>

            {/* Choice 2 */}
            <button
              onClick={() => handleChoiceSelect(2)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-300",
                selectedChoice === 2 
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20" 
                  : "border-border bg-card hover:bg-secondary hover:border-primary/20"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  selectedChoice === 2 ? "bg-primary text-primary-foreground" : "bg-accent/20"
                )}>
                  {selectedChoice === 2 ? <Check className="h-4 w-4" /> : <span className="text-xs font-medium">2</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{aiResponse.choice2.label}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{aiResponse.choice2.full}</p>
                </div>
              </div>
            </button>
          </div>

          {/* Regenerate Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
              Try different suggestions
            </button>
            <button
              onClick={() => setAiResponse(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Button - Only show when no response */}
      {!showModeSelector && !aiResponse && (
        <Button
          variant="glass"
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="group"
        >
          <Sparkles className={cn(
            "h-4 w-4 transition-all",
            isGenerating && "animate-spin"
          )} />
          {isGenerating ? "Thinking..." : "AI Assist"}
        </Button>
      )}
      
      {/* Mode indicator */}
      {mode && !showModeSelector && !aiResponse && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className={cn(
            "h-2 w-2 rounded-full",
            mode === "generic" ? "bg-accent" : "bg-primary"
          )} />
          Using {mode === "generic" ? "Generic AI" : "Digital Twin"}
          <button
            onClick={() => setShowModeSelector(true)}
            className="text-primary hover:underline ml-1"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
};
