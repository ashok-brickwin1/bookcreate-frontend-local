import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Brain, BookOpen, GitCompare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DigitalTwinComparison } from "./comparison/DigitalTwinComparison";

interface DigitalTwinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answers: Record<string, string>;
  bookTitle: string;
  onGenerateBook: () => void;
}

const LLM_MODELS = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Fast & balanced" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Most capable" },
  { id: "openai/gpt-5", name: "GPT-5", description: "Excellent reasoning" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini", description: "Cost-efficient" },
];

export const DigitalTwinDialog = ({
  open,
  onOpenChange,
  answers,
  bookTitle,
  onGenerateBook,
}: DigitalTwinDialogProps) => {
  const { toast } = useToast();
  const [wantsTwin, setWantsTwin] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("google/gemini-2.5-flash");
  const [generating, setGenerating] = useState(false);
  const [twinProfile, setTwinProfile] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleGenerateTwin = async () => {
    setGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-digital-twin", {
        body: { 
          answers, 
          bookTitle,
          model: selectedModel 
        },
      });

      if (error) throw error;

      setTwinProfile(data.profile);
      toast({
        title: "Digital Twin Created!",
        description: "Your digital twin profile has been generated.",
      });
    } catch (error) {
      console.error("Error generating digital twin:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error creating your digital twin. Please try again.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleProceed = () => {
    onGenerateBook();
    onOpenChange(false);
    // Reset state for next time
    setWantsTwin(null);
    setTwinProfile(null);
  };

  const handleDownloadTwin = () => {
    if (!twinProfile) return;
    
    const blob = new Blob([twinProfile], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bookTitle.toLowerCase().replace(/\s+/g, "-")}-digital-twin.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Your digital twin profile has been saved.",
    });
  };

  const handleProfileRefined = (newProfile: string) => {
    setTwinProfile(newProfile);
    toast({
      title: "Profile Updated",
      description: "Your refined digital twin profile is now active.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-5 w-5 text-primary" />
            Digital Twin Generation
          </DialogTitle>
          <DialogDescription>
            Your book captures your story. Would you like to also create a digital twin that can make trusted decisions on your behalf?
          </DialogDescription>
        </DialogHeader>

        {wantsTwin === null && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              A digital twin is an AI-powered representation of you that understands your values, experiences, and thinking patterns. It can help answer questions and make decisions the way you would.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setWantsTwin(false);
                  handleProceed();
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Just the Book
              </Button>
              <Button
                variant="warm"
                className="flex-1"
                onClick={() => setWantsTwin(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create Twin Too
              </Button>
            </div>
          </div>
        )}

        {wantsTwin === true && !twinProfile && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Your AI Model</label>
              <p className="text-xs text-muted-foreground">
                Select which language model will power your digital twin
              </p>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {LLM_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="glass-card rounded-xl p-4 bg-muted/30">
              <h4 className="font-medium text-sm mb-2">What your twin will know:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Your life story, values, and experiences</li>
                <li>• How you think and make decisions</li>
                <li>• Your goals, dreams, and what matters to you</li>
                <li>• Context from all your answers (~2000 words)</li>
              </ul>
            </div>

            <Button
              variant="warm"
              className="w-full"
              onClick={handleGenerateTwin}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Your Digital Twin...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Digital Twin
                </>
              )}
            </Button>
          </div>
        )}

        {twinProfile && !showComparison && (
          <div className="space-y-4 py-4">
            <div className="glass-card rounded-xl p-4 bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Digital Twin Profile Created</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Your digital twin has been generated with {twinProfile.split(/\s+/).length} words of context about your life, values, and how you think.
              </p>
              <div className="max-h-32 overflow-y-auto text-xs text-muted-foreground bg-background/50 rounded-lg p-3">
                {twinProfile.substring(0, 500)}...
              </div>
            </div>

            {/* Compare Digital Twin Button */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowComparison(true)}
            >
              <GitCompare className="h-4 w-4" />
              Compare Against Other AI Models
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDownloadTwin}
              >
                Download Profile
              </Button>
              <Button
                variant="warm"
                className="flex-1"
                onClick={handleProceed}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Book
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Full-screen comparison experience */}
      {showComparison && twinProfile && (
        <div className="fixed inset-0 z-[100] bg-background">
          <DigitalTwinComparison
            twinProfile={twinProfile}
            bookTitle={bookTitle}
            answers={answers}
            onClose={() => setShowComparison(false)}
            onProfileRefined={handleProfileRefined}
          />
        </div>
      )}
    </Dialog>
  );
};
