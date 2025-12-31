import { categories, getCategoryProgress } from "@/data/bookQuestions";
import { cn } from "@/lib/utils";

interface CategoryNavigationProps {
  answers: Record<string, string>;
  currentCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryNavigation = ({
  answers,
  currentCategory,
  onCategoryChange,
}: CategoryNavigationProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const progress = getCategoryProgress(category.id, answers);
        const isActive = currentCategory === category.id;
        const isComplete = progress.percentage === 100;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap",
              isActive
                ? "bg-foreground text-background"
                : "bg-card border border-border hover:bg-secondary"
            )}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="text-sm font-medium">{category.title}</span>
            {isComplete && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                ✓
              </span>
            )}
            {!isComplete && progress.answered > 0 && (
              <span className="text-xs text-muted-foreground">
                {progress.answered}/{progress.total}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
