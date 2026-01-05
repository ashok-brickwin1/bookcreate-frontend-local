import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { questions, categories, getTotalProgress } from "@/data/bookQuestions";
import { WritingStyle } from "@/data/writingStyles";
import { WritingStyleSelector } from "@/components/WritingStyleSelector";
import { saveAnswer,bulkSaveAnswers } from "@/api/answer";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Mic, 
  MicOff,
  Sparkles,
  Loader2,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GuidedInterviewStepProps {
  answers: Record<string, string>;
  onSaveAnswer: (questionId: string, answer: string) => void;
  onComplete: () => void;
  onBack: () => void;
  writingStyle: WritingStyle | null;
  onWritingStyleChange: (style: WritingStyle | null) => void;
}

export const GuidedInterviewStep = ({ 
  answers, 
  onSaveAnswer, 
  onComplete, 
  onBack,
  writingStyle,
  onWritingStyleChange
}: GuidedInterviewStepProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefining, setIsRefining] = useState(false);
  const [refinedAnswer, setRefinedAnswer] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));


  const currentQuestion = questions[currentIndex] ?? null;
  if (!currentQuestion) {
  return null
}
  // const category = categories.find(c => c.id === currentQuestion.category);
  const category = categories.find(
  c => c.id === currentQuestion.category
) ?? null;

  const progress = getTotalProgress(answers);
  const currentAnswer = answers[currentQuestion.id] || "";

  // const handleAnswerChange = async(value: string) => {
  //   onSaveAnswer(currentQuestion.id, value);
  //   setRefinedAnswer(null);
  //   setShowConfirmation(false);

  //   await saveAnswer({
  //   dummy_question_id: currentQuestion.id,

  //   category: currentQuestion.category,
  //   sub_section: currentQuestion.subSection,
  //   life_stage: currentQuestion.lifeStage,

  //   title: currentQuestion.title,
  //   prompt: currentQuestion.prompt,
  //   help_text: currentQuestion.helpText,
  //   context_prompt: currentQuestion.contextPrompt,

  //   answer_text: value,
  // });
  // };

  const handleAnswerChange = (value: string) => {
  onSaveAnswer(currentQuestion.id, value);
  setRefinedAnswer(null);
  setShowConfirmation(false);
};

 const handleComplete = async () => {
  await delay(200);

  const payload = questions
    .filter(q => q && q.category) // ✅ CRITICAL SAFETY
    .map(q => ({
      dummy_question_id: q.id,
      category: q.category,
      sub_section: q.subSection,
      life_stage: q.lifeStage,
      title: q.title,
      prompt: q.prompt,
      help_text: q.helpText,
      context_prompt: q.contextPrompt,
      answer_text: answers[q.id] || "",
    }));

  await bulkSaveAnswers(payload);
  onComplete();
};





  const handleRefineAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Write something first",
        description: "Share your thoughts, then I'll help refine them.",
      });
      return;
    }

    setIsRefining(true);
    try {
      const { data, error } = await supabase.functions.invoke('refine-answer', {
        body: {
          question: currentQuestion.prompt,
          answer: currentAnswer,
          category: currentQuestion.category,
          lifeStage: currentQuestion.lifeStage,
          customStyle: writingStyle ? {
            name: writingStyle.name,
            toneGuidance: writingStyle.toneGuidance,
            characteristics: writingStyle.characteristics
          } : null
        }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      setRefinedAnswer(data.refined);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Refine error:', error);
      toast({
        title: "Couldn't refine",
        description: "Let's keep your original answer — it's authentic!",
        variant: "destructive"
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleAcceptRefined = () => {
    if (refinedAnswer) {
      onSaveAnswer(currentQuestion.id, refinedAnswer);
      setRefinedAnswer(null);
      setShowConfirmation(false);
      toast({
        title: "Answer updated!",
        description: "Feel free to edit it further.",
      });
    }
  };

  const handleRejectRefined = () => {
    setRefinedAnswer(null);
    setShowConfirmation(false);
  };

  // const handleNext = () => {
  //   if (currentIndex < questions.length - 1) {
  //     setCurrentIndex(prev => prev + 1);
  //     setRefinedAnswer(null);
  //     setShowConfirmation(false);
  //   } else {
  //     onComplete();
  //   }
  // };
  const handleNext = async () => {
    await delay(200);
  const payload = {
    dummy_question_id: currentQuestion.id,
    category: currentQuestion.category,
    sub_section: currentQuestion.subSection,
    life_stage: currentQuestion.lifeStage,
    title: currentQuestion.title,
    prompt: currentQuestion.prompt,
    help_text: currentQuestion.helpText,
    context_prompt: currentQuestion.contextPrompt,
    answer_text: answers[currentQuestion.id] || "",
  };

  try {
    await saveAnswer(payload);
  } catch (err) {
    toast({
      title: "Save failed",
      description: "Your answer couldn't be saved. Please try again.",
      variant: "destructive",
    });
    return; // ⛔ don't move forward
  }

  if (currentIndex < questions.length - 1) {
    setCurrentIndex(prev => prev + 1);
    setRefinedAnswer(null);
    setShowConfirmation(false);
  } else {
    await handleComplete(); // last question
  }
};


  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setRefinedAnswer(null);
      setShowConfirmation(false);
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Exit</span>
            </button>

            <div className="flex items-center gap-4">
             
              <div className="h-2 w-24 md:w-32 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1}/{questions.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="animate-fade-in">
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">{category?.icon}</span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {category?.title}
            </span>
          </div>

          {/* Question */}
          <h1 className="text-3xl md:text-4xl font-display font-medium text-foreground leading-tight mb-4">
            {currentQuestion.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {currentQuestion.prompt}
          </p>

          {/* Answer Area */}
          <div className="space-y-4">
            <textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Share your story here... Take your time, there's no rush."
              className={cn(
                "w-full min-h-[200px] p-6 rounded-2xl",
                "bg-card border border-border",
                "text-foreground placeholder:text-muted-foreground/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
                "resize-none transition-all duration-300",
                "text-lg leading-relaxed"
              )}
            />

            {/* Word count & AI assist */}
            <div className="flex items-center justify-between">
              <Button
                variant="glass"
                size="sm"
                onClick={handleRefineAnswer}
                disabled={isRefining || !currentAnswer.trim()}
                className="group"
              >
                {isRefining ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isRefining ? "Refining..." : "Refine with AI"}
              </Button>

              <span className="text-sm text-muted-foreground">
                {currentAnswer.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmation && refinedAnswer && (
            <div className="mt-6 glass-card rounded-2xl p-6 animate-scale-in">
              <p className="text-sm text-primary font-medium mb-3">
                ✨ Is this what you meant?
              </p>
              <p className="text-foreground leading-relaxed mb-4 p-4 bg-secondary/50 rounded-xl">
                {refinedAnswer}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="hero"
                  size="sm"
                  onClick={handleAcceptRefined}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Yes, use this
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRejectRefined}
                >
                  Keep my original
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefineAnswer}
                  disabled={isRefining}
                >
                  <RefreshCw className={cn("h-4 w-4", isRefining && "animate-spin")} />
                </Button>
              </div>
            </div>
          )}

          {/* Help Text */}
          {currentQuestion.helpText && (
            <p className="text-sm text-muted-foreground/70 italic mt-6">
              💡 {currentQuestion.helpText}
            </p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={cn(currentIndex === 0 && "invisible")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <Button
              variant={isLastQuestion ? "warm" : "hero"}
              size="lg"
              onClick={handleNext}
            >
              {isLastQuestion ? (
                <>
                  Review My Story
                  <Check className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
