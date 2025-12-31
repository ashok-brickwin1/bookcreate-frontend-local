import { Button } from "@/components/ui/button";
import { questions, categories } from "@/data/bookQuestions";
import { FootprintData } from "./DigitalFootprintStep";
import { LifeJourneyTimeline, JourneyMoment } from "./LifeJourneyTimeline";
import { ArrowRight, ArrowLeft, Edit3, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { bulkSaveLifeMoments } from "@/api/lifeMoment";



export type { JourneyMoment };

interface ReviewStepProps {
  answers: Record<string, string>;
  footprint: FootprintData | null;
  journeyMoments: JourneyMoment[];
  onAddMoment: (moment: Omit<JourneyMoment, "id">) => void;
  onRemoveMoment: (id: string) => void;
  onComplete: () => void;
  onBack: () => void;
  onEditAnswer: (questionId: string) => void;
}

export const ReviewStep = ({ 
  answers, 
  footprint,
  journeyMoments,
  onAddMoment,
  onRemoveMoment,
  onComplete, 
  onBack,
  onEditAnswer 
}: ReviewStepProps) => {
  const answeredQuestions = questions.filter(q => answers[q.id]?.trim());
  const groupedByCategory = categories.map(cat => ({
    ...cat,
    questions: answeredQuestions.filter(q => q.category === cat.id)
  })).filter(cat => cat.questions.length > 0);



  const handleGenerateBook = async () => {
  if (journeyMoments.length > 0) {
    const payload = journeyMoments.map(m => ({
      moment_type: m.type,
      life_stage: m.lifeStage,
      year: m.year ? Number(m.year) : undefined,
      what_happened: m.title,
      story: m.description,
      lesson_learned: m.lesson,
    }));

    try {
      await bulkSaveLifeMoments(payload);
    } catch (err) {
      console.error("Failed to save life moments", err);
      return; // ⛔ stop book generation if save fails
    }
  }

  // ✅ continue normal flow
  onComplete();
};



  

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to questions</span>
        </button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4">
            Review Your Story
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's a summary of everything you've shared. Make any final edits 
            before we generate your book.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-3xl font-display font-medium text-primary">
              {answeredQuestions.length}
            </p>
            <p className="text-sm text-muted-foreground">Questions Answered</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-3xl font-display font-medium text-primary">
              {Object.values(answers).join(' ').split(/\s+/).filter(Boolean).length}
            </p>
            <p className="text-sm text-muted-foreground">Total Words</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-3xl font-display font-medium text-primary">
              {groupedByCategory.length}
            </p>
            <p className="text-sm text-muted-foreground">Chapters</p>
          </div>
        </div>

        {/* Life Journey Timeline */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <LifeJourneyTimeline
            moments={journeyMoments}
            onAddMoment={onAddMoment}
            onRemoveMoment={onRemoveMoment}
          />
        </div>

        {/* Grouped Answers */}
        <div className="space-y-8">
          {groupedByCategory.map((category, catIndex) => (
            <div 
              key={category.id}
              className="glass-card rounded-3xl p-8 shadow-elevated animate-slide-up"
              style={{ animationDelay: `${catIndex * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h2 className="text-xl font-display font-medium text-foreground">
                    {category.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{category.subtitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                {category.questions.map((question, qIndex) => (
                  <div 
                    key={question.id}
                    className={cn(
                      "group relative p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors",
                      qIndex > 0 && "border-t border-border/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          {question.title}
                        </p>
                        <p className="text-foreground leading-relaxed line-clamp-4">
                          {answers[question.id]}
                        </p>
                      </div>
                      <button
                        onClick={() => onEditAnswer(question.id)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-card"
                      >
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Digital Footprint Summary */}
        {footprint && (
          <div className="glass-card rounded-3xl p-8 shadow-elevated mt-8 animate-slide-up">
            <h2 className="text-xl font-display font-medium text-foreground mb-4">
              Digital Footprint Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {footprint.insights}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-full max-w-[200px] bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${footprint.authenticityScore}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {footprint.authenticityScore}% verified
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Button
            variant="warm"
            size="xl"
            onClick={handleGenerateBook}
            className="shadow-glow"
          >
            Generate My Book
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
