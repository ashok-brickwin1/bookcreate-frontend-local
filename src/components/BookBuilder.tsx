import { useState } from "react";
import { questions, categories, getQuestionsByCategory, getTotalProgress } from "@/data/bookQuestions";
import { QuestionCard } from "./QuestionCard";
import { CategoryNavigation } from "./CategoryNavigation";
import { ProgressRing } from "./ProgressRing";
import { UserMenu } from "./UserMenu";
import { CollaboratorPanel } from "./CollaboratorPanel";
import { BookOpen, ArrowLeft, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookBuilderProps {
  onComplete: () => void;
  onBack: () => void;
  answers: Record<string, string>;
  onSaveAnswer: (questionId: string, answer: string) => void;
  bookId?: string;
}

export const BookBuilder = ({ onComplete, onBack, answers, onSaveAnswer, bookId }: BookBuilderProps) => {
  const [currentCategory, setCurrentCategory] = useState(categories[0].id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCollaborators, setShowCollaborators] = useState(false);

  const categoryQuestions = getQuestionsByCategory(currentCategory);
  const currentQuestion = categoryQuestions[currentQuestionIndex];
  const progress = getTotalProgress(answers);

  const handleAnswerChange = (answer: string) => {
    onSaveAnswer(currentQuestion.id, answer);
  };

  const handleNext = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Move to next category
      const currentCategoryIndex = categories.findIndex((c) => c.id === currentCategory);
      if (currentCategoryIndex < categories.length - 1) {
        setCurrentCategory(categories[currentCategoryIndex + 1].id);
        setCurrentQuestionIndex(0);
      } else {
        onComplete();
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      // Move to previous category
      const currentCategoryIndex = categories.findIndex((c) => c.id === currentCategory);
      if (currentCategoryIndex > 0) {
        const prevCategory = categories[currentCategoryIndex - 1];
        setCurrentCategory(prevCategory.id);
        setCurrentQuestionIndex(getQuestionsByCategory(prevCategory.id).length - 1);
      }
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setCurrentCategory(categoryId as any);
    setCurrentQuestionIndex(0);
  };

  // Calculate absolute question number
  let absoluteQuestionNumber = 0;
  for (const category of categories) {
    if (category.id === currentCategory) {
      absoluteQuestionNumber += currentQuestionIndex + 1;
      break;
    }
    absoluteQuestionNumber += getQuestionsByCategory(category.id).length;
  }

  const isFirstQuestion = categories.findIndex((c) => c.id === currentCategory) === 0 && currentQuestionIndex === 0;
  const isLastQuestion = 
    categories.findIndex((c) => c.id === currentCategory) === categories.length - 1 &&
    currentQuestionIndex === categoryQuestions.length - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>

            <div className="flex items-center gap-4">
              {bookId && (
                <button
                  onClick={() => setShowCollaborators(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground hidden sm:block">Invite</span>
                </button>
              )}
              <ProgressRing progress={progress.percentage} size={48} strokeWidth={4} showPercentage={false} />
              <span className="text-sm text-muted-foreground">
                {progress.answered}/{progress.total}
              </span>
              <UserMenu />
            </div>
          </div>

          {/* Category Navigation */}
          <div className="mt-4">
            <CategoryNavigation
              answers={answers}
              currentCategory={currentCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-12 md:py-20">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          answer={answers[currentQuestion.id] || ""}
          onAnswerChange={handleAnswerChange}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={isFirstQuestion}
          isLast={isLastQuestion}
          questionNumber={absoluteQuestionNumber}
          totalQuestions={questions.length}
        />
      </main>

      {bookId && (
        <CollaboratorPanel
          bookId={bookId}
          isOpen={showCollaborators}
          onClose={() => setShowCollaborators(false)}
        />
      )}
    </div>
  );
};
