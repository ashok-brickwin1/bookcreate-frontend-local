import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBook, Book } from "@/hooks/useBook";
import { categories, questions } from "@/data/bookQuestions";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Sparkles,
  Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "./ProgressRing";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBook?: (book: Book) => void;
}

const LLM_OPTIONS = [
  { 
    id: "gemini-pro", 
    name: "Gemini Pro", 
    provider: "Google", 
    description: "Deep reasoning & analysis",
    speed: 3,
    depth: 5,
    style: "Thoughtful & detailed",
    bestFor: "Complex decisions requiring deep analysis"
  },
  { 
    id: "gpt-5", 
    name: "GPT-5", 
    provider: "OpenAI", 
    description: "Powerful all-rounder",
    speed: 3,
    depth: 5,
    style: "Balanced & nuanced",
    bestFor: "Versatile responses with strong reasoning"
  },
  { 
    id: "gemini-flash", 
    name: "Gemini Flash", 
    provider: "Google", 
    description: "Fast & efficient",
    speed: 5,
    depth: 3,
    style: "Concise & direct",
    bestFor: "Quick answers and everyday questions"
  },
  { 
    id: "gpt-5-mini", 
    name: "GPT-5 Mini", 
    provider: "OpenAI", 
    description: "Quick responses",
    speed: 5,
    depth: 3,
    style: "Brief & actionable",
    bestFor: "Fast decisions and simple queries"
  },
];

interface BookWithProgress extends Book {
  totalQuestions: number;
  answeredQuestions: number;
  categoryProgress: {
    categoryId: string;
    categoryTitle: string;
    total: number;
    answered: number;
  }[];
}

export const SettingsDialog = ({ open, onOpenChange, onSelectBook }: SettingsDialogProps) => {
  const { books, setCurrentBook } = useBook();
  const [booksWithProgress, setBooksWithProgress] = useState<BookWithProgress[]>([]);
  const [selectedLLM, setSelectedLLM] = useState("gemini-pro");
  const [activeTab, setActiveTab] = useState<"books" | "llm">("books");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooksProgress = async () => {
      if (!open || books.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const booksProgress: BookWithProgress[] = [];

      for (const book of books) {
        // Fetch answers for this book
        const { data: answersData } = await supabase
          .from("book_answers")
          .select("question_id, answer")
          .eq("book_id", book.id);

        const answeredIds = new Set(
          (answersData || [])
            .filter(a => a.answer && a.answer.trim().length > 0)
            .map(a => a.question_id)
        );

        // Calculate progress by category
        const categoryProgress = categories.map(cat => {
          const categoryQuestions = questions.filter(q => q.category === cat.id);
          const answered = categoryQuestions.filter(q => answeredIds.has(q.id)).length;
          return {
            categoryId: cat.id,
            categoryTitle: cat.title,
            total: categoryQuestions.length,
            answered,
          };
        });

        const totalQuestions = questions.length;
        const answeredQuestions = answeredIds.size;

        booksProgress.push({
          ...book,
          totalQuestions,
          answeredQuestions,
          categoryProgress,
        });
      }

      setBooksWithProgress(booksProgress);
      setLoading(false);
    };

    fetchBooksProgress();
  }, [open, books]);

  const handleSelectBook = (book: BookWithProgress) => {
    setCurrentBook(book);
    onSelectBook?.(book);
    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500";
      case "in_progress": return "text-amber-500";
      case "published": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "in_progress": return "In Progress";
      case "published": return "Published";
      default: return "Draft";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Settings
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border pb-2">
          <button
            onClick={() => setActiveTab("books")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "books" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <BookOpen className="h-4 w-4" />
            My Books
          </button>
          <button
            onClick={() => setActiveTab("llm")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "llm" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Brain className="h-4 w-4" />
            Digital Twin LLM
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "books" && (
            <div className="space-y-4 py-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : booksWithProgress.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No books yet. Start your journey!</p>
                </div>
              ) : (
                booksWithProgress.map((book) => {
                  const overallProgress = Math.round((book.answeredQuestions / book.totalQuestions) * 100);
                  
                  return (
                    <div
                      key={book.id}
                      className="glass-card rounded-xl p-4 hover:shadow-elevated transition-all cursor-pointer group"
                      onClick={() => handleSelectBook(book)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Book cover preview */}
                        <div 
                          className="h-20 w-14 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: book.cover_color || "#8B5CF6" }}
                        >
                          <BookOpen className="h-6 w-6 text-white/80" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-foreground truncate">{book.title}</h3>
                              {book.subtitle && (
                                <p className="text-sm text-muted-foreground truncate">{book.subtitle}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <ProgressRing progress={overallProgress} size={40} strokeWidth={3} />
                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>

                          {/* Status badge */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={cn("text-xs font-medium flex items-center gap-1", getStatusColor(book.status))}>
                              {book.status === "completed" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              {getStatusLabel(book.status)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              • {book.answeredQuestions}/{book.totalQuestions} questions
                            </span>
                          </div>

                          {/* Category progress */}
                          <div className="grid grid-cols-4 gap-2 mt-3">
                            {book.categoryProgress.map((cat) => {
                              const catProgress = cat.total > 0 ? Math.round((cat.answered / cat.total) * 100) : 0;
                              return (
                                <div key={cat.categoryId} className="text-center">
                                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                                    <div 
                                      className="h-full bg-primary transition-all"
                                      style={{ width: `${catProgress}%` }}
                                    />
                                  </div>
                                  <p className="text-[10px] text-muted-foreground truncate">{cat.categoryTitle}</p>
                                  <p className="text-[10px] font-medium text-foreground">{catProgress}%</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "llm" && (
            <div className="space-y-4 py-4">
              <div className="glass-card rounded-xl p-4 bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">Your Digital Twin Model</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose which AI model powers your digital twin. Each model has different strengths for how it processes and responds based on your story.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="glass-card rounded-xl overflow-hidden border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-3 font-medium text-foreground">Model</th>
                        <th className="text-center p-3 font-medium text-foreground">Speed</th>
                        <th className="text-center p-3 font-medium text-foreground">Depth</th>
                        <th className="text-left p-3 font-medium text-foreground">Style</th>
                        <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LLM_OPTIONS.map((llm, idx) => (
                        <tr 
                          key={llm.id}
                          onClick={() => setSelectedLLM(llm.id)}
                          className={cn(
                            "border-b border-border last:border-0 cursor-pointer transition-colors",
                            selectedLLM === llm.id 
                              ? "bg-primary/10" 
                              : "hover:bg-muted/50"
                          )}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "h-3 w-3 rounded-full",
                                selectedLLM === llm.id ? "bg-primary" : "bg-muted-foreground/30"
                              )} />
                              <span className={cn(
                                "font-medium",
                                selectedLLM === llm.id ? "text-primary" : "text-foreground"
                              )}>
                                {llm.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {llm.provider}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    i <= llm.speed ? "bg-green-500" : "bg-muted"
                                  )}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    i <= llm.depth ? "bg-blue-500" : "bg-muted"
                                  )}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground">{llm.style}</td>
                          <td className="p-3 text-muted-foreground text-xs hidden md:table-cell">{llm.bestFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Legend */}
                <div className="flex items-center gap-6 p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="h-2 w-2 rounded-full bg-muted" />
                    </div>
                    <span>Speed (response time)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <div className="h-2 w-2 rounded-full bg-muted" />
                    </div>
                    <span>Depth (analysis quality)</span>
                  </div>
                </div>
              </div>

              {/* Selected Model Details */}
              {(() => {
                const selected = LLM_OPTIONS.find(l => l.id === selectedLLM);
                if (!selected) return null;
                return (
                  <div className="glass-card rounded-xl p-4 border border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <Brain className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{selected.name}</p>
                        <p className="text-xs text-muted-foreground">{selected.provider}</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{selected.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                        {selected.speed >= 4 ? "⚡ Fast" : selected.speed >= 3 ? "⏱️ Moderate" : "🐢 Slower"}
                      </span>
                      <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">
                        {selected.depth >= 4 ? "🧠 Deep" : selected.depth >= 3 ? "📊 Balanced" : "💡 Surface"}
                      </span>
                      <span className="text-xs bg-purple-500/10 text-purple-600 px-2 py-1 rounded-full">
                        {selected.style}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <Button variant="hero" className="w-full mt-4">
                Save LLM Preference
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
