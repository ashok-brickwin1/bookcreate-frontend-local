import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "./ProgressRing";
import { UserMenu } from "./UserMenu";
import { DigitalTwinDialog } from "./DigitalTwinDialog";
import { PublishingOptions } from "./PublishingOptions";
import { categories, getTotalProgress, getCategoryProgress } from "@/data/bookQuestions";
import { generateBookPDF } from "@/lib/generatePDF";
import { generatePrintReadyPDF } from "@/lib/generatePrintReadyPDF";
import { useBook } from "@/hooks/useBook";
import { BookOpen, Download, ArrowLeft, Sparkles, Loader2, Check, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateBookFinal } from "@/api/bookSetup";

interface BookPreviewProps {
  answers: Record<string, string>;
  onBack: () => void;
  onStartOver: () => void;
}

export const BookPreview = ({ answers, onBack, onStartOver }: BookPreviewProps) => {
  const { currentBook } = useBook();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showTwinDialog, setShowTwinDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const progress = getTotalProgress(answers);

  const handleStartGeneration = () => {
    setShowTwinDialog(true);
  };


  //  const handleGenerateBook = async () => {
  //     CreateBookOutline();
  //   if (journeyMoments.length > 0) {
  //     const payload = journeyMoments.map(m => ({
  //       moment_type: m.type,
  //       life_stage: m.lifeStage,
  //       year: m.year ? Number(m.year) : undefined,
  //       what_happened: m.title,
  //       story: m.description,
  //       lesson_learned: m.lesson,
  //     }));
  
  //     try {
  //       await bulkSaveLifeMoments(payload);
  //     } catch (err) {
  //       console.error("Failed to save life moments", err);
  //       return; // ⛔ stop book generation if save fails
  //     }
  //   }
  
  //   // ✅ continue normal flow
  //   onComplete();
  // };



  // const handleGeneratePDF = async () => {
  //   setGenerating(true);
    
  //   try {
  //     const filename = generateBookPDF(answers, {
  //       title: currentBook?.title || "My Story",
  //       subtitle: currentBook?.subtitle || undefined,
  //       dedication: currentBook?.dedication || undefined,
  //       coverColor: currentBook?.cover_color || "#E86C5D",
  //       bookType: currentBook?.book_type || "autobiography",
  //     });

  //     setGenerated(true);
  //     toast({
  //       title: "Book generated!",
  //       description: `${filename} has been downloaded.`,
  //     });

  //     setTimeout(() => setGenerated(false), 3000);
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Generation failed",
  //       description: "There was an error generating your PDF. Please try again.",
  //     });
  //   } finally {
  //     setGenerating(false);
  //   }
  // };

   const handleGeneratePDF = async () => {
    console.log("handleGeneratePDF called")
    setGenerating(true);
    
    try {
      CreateBookFinal();
      

      setGenerated(true);
      toast({
        title: "Book generation in Progress",
        description: `Your book generation is in progress, once completed you will get mail with pdf attached`,
      });

      setTimeout(() => setGenerated(false), 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating your PDF. Please try again.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await handleGeneratePDF();
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportEPUB = async () => {
    setIsExporting(true);
    try {
      // For now, show a toast that EPUB is coming soon
      // In production, this would generate a proper EPUB file
      toast({
        title: "EPUB Export",
        description: "EPUB export is coming soon! For now, please use PDF and convert using Calibre or an online converter.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPrintReady = async () => {
    setIsExporting(true);
    try {
      const result = generatePrintReadyPDF(answers, {
        title: currentBook?.title || "My Story",
        subtitle: currentBook?.subtitle || undefined,
        dedication: currentBook?.dedication || undefined,
        coverColor: currentBook?.cover_color || "#E86C5D",
        bookType: currentBook?.book_type || "autobiography",
      });

      toast({
        title: "Print-Ready PDF Generated!",
        description: `${result.filename} downloaded. Specs: ${result.pageCount} pages, ${result.spineWidth.toFixed(1)}mm spine, ${result.trimWidth}×${result.trimHeight}mm trim with ${result.bleedMM}mm bleed.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating your print-ready PDF. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    // Export as JSON for backup
    const exportData = {
      book: currentBook,
      answers,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentBook?.title || "my-story"}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Backup exported",
      description: "Your story data has been saved as a JSON file.",
    });
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Continue Editing</span>
            </button>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleExport} className="hidden">
                <Download className="h-4 w-4 mr-2" />
                Backup
              </Button>
              {/* <PublishingOptions 
                bookTitle={currentBook?.title || "My Story"}
                onExportPDF={handleExportPDF}
                onExportEPUB={handleExportEPUB}
                onExportPrintReady={handleExportPrintReady}
                isExporting={isExporting}
              /> */}
              <Button 
                variant="warm" 
                size="sm" 
                onClick={handleStartGeneration}
                disabled={generating || progress.answered === 0}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : generated ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {generating ? "Generating..." : generated ? "Downloaded!" : "Generate Book"}
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-8">
            <ProgressRing progress={progress.percentage} size={160} strokeWidth={10} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4">
            Your Story is Taking Shape
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            You've answered {progress.answered} of {progress.total} questions. 
            {progress.percentage === 100 
              ? " Your book is ready to be generated!"
              : " Complete more questions to enrich your narrative."}
          </p>
        </div>
      </section>

      {/* Category Overview */}
      <section className="pb-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const catProgress = getCategoryProgress(category.id, answers);
              
              return (
                <div
                  key={category.id}
                  className="glass-card rounded-3xl p-6 shadow-soft"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h3 className="font-display text-xl font-medium text-foreground">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{category.subtitle}</p>
                      </div>
                    </div>
                    <ProgressRing 
                      progress={catProgress.percentage} 
                      size={56} 
                      strokeWidth={4}
                      showPercentage={false}
                    />
                  </div>
                  
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: `${catProgress.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {catProgress.answered} of {catProgress.total} questions answered
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Preview Content */}
      {Object.keys(answers).length > 0 && (
        <section className="pb-20">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-display font-medium text-foreground mb-8 text-center">
              Preview Your Story
            </h2>
            
            <div className="glass-card rounded-3xl p-8 md:p-12 shadow-elevated">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-sm uppercase tracking-wider text-muted-foreground">Chapter Preview</span>
              </div>
              
              <div className="prose prose-lg max-w-none">
                {categories.map((category) => {
                  const categoryAnswers = Object.entries(answers).filter(([key]) => 
                    key.startsWith(category.id.substring(0, 4))
                  );
                  
                  if (categoryAnswers.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="mb-12 last:mb-0">
                      <h3 className="text-xl font-display font-medium text-foreground mb-4 flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.title}
                      </h3>
                      {categoryAnswers.slice(0, 2).map(([key, value]) => (
                        <p key={key} className="text-muted-foreground leading-relaxed mb-4">
                          {value.substring(0, 300)}
                          {value.length > 300 && "..."}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pb-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Button 
            variant="warm" 
            size="xl" 
            className="shadow-glow"
            onClick={handleStartGeneration}
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5 mr-2" />
            )}
            {generating ? "Generating Your Book..." : "Generate Your Book"}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            {progress.answered === 0 
              ? "Answer some questions first to generate your book"
              : "Our AI will transform your answers into a beautifully crafted PDF"
            }
          </p>
        </div>
      </section>

      <DigitalTwinDialog
        open={showTwinDialog}
        onOpenChange={setShowTwinDialog}
        answers={answers}
        bookTitle={currentBook?.title || "My Story"}
        onGenerateBook={handleGeneratePDF}
      />
    </div>
  );
};
