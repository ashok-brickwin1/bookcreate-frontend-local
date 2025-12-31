import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BasicInfo } from "./BasicInfoStep";
import { 
  ArrowRight, 
  Loader2, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  User,
  Briefcase,
  Award,
  Quote,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookStatus } from "@/hooks/UseBookStatus";

export interface FootprintData {
  biography: string;
  career: string;
  achievements: string;
  publicStatements: string;
  insights: string;
  authenticityScore: number;
  chapters: ChapterSummary[];
}

export interface ChapterSummary {
  title: string;
  summary: string;
  dataStrength: "strong" | "moderate" | "weak";
}

interface DigitalFootprintStepProps {
  basicInfo: BasicInfo;
  onComplete: (footprint: FootprintData) => void;
  onBack: () => void;
}

export const DigitalFootprintStep = ({ basicInfo, onComplete, onBack }: DigitalFootprintStepProps) => {
  const [isSearching, setIsSearching] = useState(true);
  const [footprint, setFootprint] = useState<FootprintData | null>(null);
  const [searchPhase, setSearchPhase] = useState(0);
  const { toast } = useToast();

  const bookId = localStorage.getItem("current_book_id");

  const { status, researchData } = useBookStatus(bookId);

  if (!status) {
  console.log("Initializing your book…")
}

if (status !== "outline_ready") {
  console.log("Research in progress…")
  // return <p>Research in progress… ({status})</p>;
}
if (status === "failed") {
  console.log("failed to generate")
  return ;
  // return <p>Research in progress… ({status})</p>;
}

if (status === "outline_ready") {
  console.log("digital summary outline generated",JSON.stringify(researchData, null, 2))
  
}



  const searchPhases = [
    "Scanning public records...",
    "Analyzing professional history...",
    "Gathering achievements...",
    "Synthesizing insights...",
    "Building your story foundation..."
  ];

  useEffect(() => {
    const fetchFootprint = async () => {
      // Animate through phases
      const phaseInterval = setInterval(() => {
        setSearchPhase((prev) => (prev < searchPhases.length - 1 ? prev + 1 : prev));
      }, 1500);

      try {
        const { data, error } = await supabase.functions.invoke('research-footprint', {
          body: { basicInfo }
        });

        if (error) throw new Error(error.message);
        if (data.error) throw new Error(data.error);

        setFootprint(data);
      } catch (error) {
        console.error('Footprint research error:', error);
        toast({
          title: "Research Complete",
          description: "We've gathered what we could find. Let's build your story together!",
        });
        // Create fallback footprint
        setFootprint({
          biography: `${basicInfo.fullName} is ${basicInfo.role || 'an individual'} with a unique story to tell.`,
          career: basicInfo.role ? `Currently serving as ${basicInfo.role}.` : "Career journey to be explored through your narrative.",
          achievements: "Your achievements will be revealed through the questions ahead.",
          publicStatements: "Your voice and perspectives will shape this section.",
          insights: "A story waiting to be told, full of potential and meaning.",
          authenticityScore: 50,
          chapters: [
            { title: "Origins", summary: "Where your story begins", dataStrength: "weak" as const },
            { title: "Professional Journey", summary: "Your career path and growth", dataStrength: "moderate" as const },
            { title: "Growth & Discovery", summary: "What drives and inspires you", dataStrength: "weak" as const },
            { title: "Legacy", summary: "The impact you want to leave", dataStrength: "weak" as const },
          ]
        });
      } finally {
        clearInterval(phaseInterval);
        setIsSearching(false);
      }
    };

    fetchFootprint();
  }, [basicInfo]);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong": return "text-green-500 bg-green-500/10";
      case "moderate": return "text-amber-500 bg-amber-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStrengthLabel = (strength: string) => {
    switch (strength) {
      case "strong": return "Rich data";
      case "moderate": return "Some data";
      default: return "Needs your input";
    }
  };

  if (isSearching) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
          <div className="relative mb-8">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Search className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
          </div>
          
          <h2 className="text-2xl font-display font-medium text-foreground mb-4">
            Discovering Your Digital Footprint
          </h2>
          
          <div className="space-y-3">
            {searchPhases.map((phase, index) => (
              <div
                key={phase}
                className={cn(
                  "flex items-center gap-3 transition-all duration-500",
                  index === searchPhase 
                    ? "text-foreground" 
                    : index < searchPhase 
                    ? "text-muted-foreground" 
                    : "text-muted-foreground/30"
                )}
              >
                {index < searchPhase ? (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                ) : index === searchPhase ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-current shrink-0" />
                )}
                <span className="text-sm">{phase}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!footprint) return null;

  const sections = [
    { icon: User, title: "Biography", content: footprint.biography },
    { icon: Briefcase, title: "Career", content: footprint.career },
    { icon: Award, title: "Achievements", content: footprint.achievements },
    { icon: Quote, title: "Public Voice", content: footprint.publicStatements },
    { icon: TrendingUp, title: "Key Insights", content: footprint.insights },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <span className="text-sm">← Back</span>
        </button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4">
            Your Digital Footprint
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's what we discovered about you. Review and approve, then we'll add 
            the personal layers that only you can share.
          </p>
        </div>

        {/* Authenticity Score */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Authenticity Score</p>
              <p className="text-lg font-medium text-foreground">
                {footprint.authenticityScore}% verified from public sources
              </p>
            </div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-display font-medium text-primary">
                {footprint.authenticityScore}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            Lower scores mean more of your story needs to come from you — that's where the magic happens!
          </p>
        </div>

        {/* Content Sections */}
        <div className="grid md:grid-cols-2 gap-4 mb-8 hidden">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="glass-card rounded-2xl p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground">{section.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Chapter Overview */}
        <div className="glass-card rounded-3xl p-8 shadow-elevated mb-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-xl font-display font-medium text-foreground mb-6">
            Your Book Chapters
          </h3>
          <div className="space-y-4">
            {footprint.chapters.map((chapter, index) => (
              <div
                key={chapter.title}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
              >
                <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-lg font-display">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{chapter.title}</h4>
                  <p className="text-sm text-muted-foreground">{chapter.summary}</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  getStrengthColor(chapter.dataStrength)
                )}>
                  {getStrengthLabel(chapter.dataStrength)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="hero-outline"
            size="lg"
            onClick={onBack}
          >
            Edit My Info
          </Button>
          <Button
            variant="warm"
            size="xl"
            onClick={() => onComplete(footprint)}
            className="shadow-glow"
          >
            Looks Good — Let's Add My Story
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
