import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
// import { supabase } from "@/integrations/supabase/client";
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
// import { useBookStatus } from "@/hooks/UseBookStatus";
import { CreateBookOutline } from "@/api/bookSetup";
import { checkBookStatus, fetchResearchData } from "@/api/bookSetup";
import { set } from "date-fns";

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
  const [isSearching, setIsSearching] = useState(false);
  const [footprint, setFootprint] = useState<FootprintData | null>(null);
  const [searchPhase, setSearchPhase] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [researchData, setResearchData] = useState<any>(null);
  const { toast } = useToast();
  const [status, setStatus] = useState<string | null>(null);

  const bookId = localStorage.getItem("current_book_id");

  // const { status, researchData } = useBookStatus(bookId);
  const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

//   const mapOutlineToChapters = (outlineJson: string): ChapterSummary[] => {
//   try {
//     const parsed = JSON.parse(outlineJson);

//     if (!parsed?.chapters || !Array.isArray(parsed.chapters)) return [];

//     return parsed.chapters.map((ch: any) => {
//       const summaryText = [
//         ch.core_focus,
//         ch.opening_story,
//         ch.big_idea,
//       ]
//         .filter(Boolean)
//         .join(" ");

//       let dataStrength: ChapterSummary["dataStrength"] = "weak";
//       if (summaryText.length > 300) dataStrength = "strong";
//       else if (summaryText.length > 150) dataStrength = "moderate";

//       return {
//         title: ch.chapter_title,
//         summary: summaryText,
//         dataStrength,
//       };
//     });
//   } catch (err) {
//     console.error("Failed to parse outline JSON", err);
//     return [];
//   }
// };
const mapOutlineToChapters = (outlineJson: string): ChapterSummary[] => {
  try {
    const parsed = JSON.parse(outlineJson);

    if (!parsed?.chapters || !Array.isArray(parsed.chapters)) return [];

    return parsed.chapters.map((ch: any) => {
      // Normalize big ideas
      const bigIdeasText = Array.isArray(ch.big_ideas)
        ? ch.big_ideas.join(" ")
        : ch.big_idea || "";

      // Normalize direct quotes
      const quotesText = Array.isArray(ch.direct_quotes)
        ? ch.direct_quotes.join(" ")
        : ch.direct_quote || "";

      const summaryText = [
        ch.core_focus,
        ch.opening_story,
        bigIdeasText,
        quotesText,
      ]
        .filter(Boolean)
        .join(" ");

      let dataStrength: ChapterSummary["dataStrength"] = "weak";
      if (summaryText.length > 300) dataStrength = "strong";
      else if (summaryText.length > 150) dataStrength = "moderate";

      return {
        title: ch.chapter_title,
        summary: summaryText,
        dataStrength,
      };
    });
  } catch (err) {
    console.error("Failed to parse outline JSON", err);
    return [];
  }
};

// useEffect(() => {
//   if (status === "failed") {
//     setIsSearching(false);

//     toast({
//       title: "Failed to generate book outline",
//       description:
//         "Something went wrong while generating your book. Please review your information and try again.",
//       variant: "destructive",
//     });

   
    

//     // Go back to previous step (pre-create-book UI)
//     onBack();
//   }
// }, [status]);



//   if (!status) {
//   console.log("Initializing your book…")
// }

// if (status !== "outline_ready") {
//   console.log("Research in progress…")
//   // return <p>Research in progress… ({status})</p>;
// }


// if (status === "outline_ready") {
//   console.log("digital summary outline generated",JSON.stringify(researchData, null, 2))
//   if (status === "outline_ready" && researchData) {
//     const chapters = mapOutlineToChapters(researchData);
//     console.log("mapped outlinetochapters",chapters)

//     setFootprint(prev =>
//       prev
//         ? { ...prev, chapters }
//         : {
//             biography: "",
//             career: "",
//             achievements: "",
//             publicStatements: "",
//             insights: "",
//             authenticityScore: 0,
//             chapters,
//           }
//     );

//     setIsSearching(false);
//   }
  
// }




// useEffect(() => {
//   console.log("use effect called for mapOutlineToChapters ")
//   if ((status === "outline_ready" || status === "created") && researchData) {
//     const chapters = mapOutlineToChapters(researchData);
//     console.log("mapped outlinetochapters",chapters)

//     setFootprint(prev =>
//       prev
//         ? { ...prev, chapters }
//         : {
//             biography: "",
//             career: "",
//             achievements: "",
//             publicStatements: "",
//             insights: "",
//             authenticityScore: 0,
//             chapters,
//           }
//     );

//     setIsSearching(false);
//   }
// }, [status, researchData]);

// const handleGenerateOutline = async () => {
//   console.log("handleGenerateOutline called")
//   setIsSearching(true);
//     CreateBookOutline();
//     useBookStatus(bookId);

// };


useEffect(() => {
  console.log("use effect called to fetch research data for bookId",bookId)
  const fetchAndSetResearchData = async () => {
    if (bookId) {
      try {

        const researchRes = await fetchResearchData(bookId);
        // setResearchData(researchRes.research_data);
        const chapters = mapOutlineToChapters(researchRes.research_data);
        console.log("mapped outlinetochapters", chapters);

        setFootprint(prev =>
          prev
            ? { ...prev, chapters }
            : {
                biography: "",
                career: "",
                achievements: "",
                publicStatements: "",
                insights: "",
                authenticityScore: 0,
                chapters,
              }
        );

        setIsSearching(false);
      } catch (err) {
        console.error("Failed to fetch research data", err);
      }
    }
  };
  fetchAndSetResearchData();
  
}, [bookId]);

// const PollAndGetData= async () => {
//   console.log("PollAndGetData called to fetch research data for bookId",bookId)
//   console.log("polling started")
  
//       intervalRef.current = setInterval(async () => {
//         try {
//           console.log("polling for status for bookId",bookId)
//           const res = await checkBookStatus(bookId);
//           setStatus(res.status);
          
  
//           if (res.status === "outline_ready" || res.status === "created") {
//             if (intervalRef.current) {
//               clearInterval(intervalRef.current);
//             }
  
//             const researchRes = await fetchResearchData(bookId);
//             // setResearchData(researchRes.research_data);
//             const chapters = mapOutlineToChapters(researchRes.research_data);
//         console.log("mapped outlinetochapters", chapters);

//         setFootprint(prev =>
//           prev
//             ? { ...prev, chapters }
//             : {
//                 biography: "",
//                 career: "",
//                 achievements: "",
//                 publicStatements: "",
//                 insights: "",
//                 authenticityScore: 0,
//                 chapters,
//               }
//         );
//           }
//         } catch (err) {
//           console.error("Status polling failed", err);
//         }
//       }, 2000);

//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//   }


const PollAndGetData = () => {
  if (!bookId) return;

  // clear any existing poll
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  intervalRef.current = setInterval(async () => {
    try {
      console.log("🔄 polling book status", bookId);

      const res = await checkBookStatus(bookId);
      setStatus(res.status);

      if (res.status === "outline_ready" || res.status === "created") {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        const researchRes = await fetchResearchData(bookId);
        const chapters = mapOutlineToChapters(researchRes.research_data);

        setFootprint({
          biography: "",
          career: "",
          achievements: "",
          publicStatements: "",
          insights: "",
          authenticityScore: 0,
          chapters,
        });

        setIsSearching(false);
      }

      if (res.status === "failed") {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        setIsSearching(false);

        toast({
          title: "Outline generation failed",
          description: "Please try again.",
          variant: "destructive",
        });

        onBack();
      }
    } catch (err) {
      console.error("Polling failed", err);
    }
  }, 2000);
};





// const handleGenerateOutline = async () => {
//   try {
//     console.log("handleGenerateOutline called")
//     setIsSearching(true);

//     await CreateBookOutline(); // triggers backend background task
//     delay(5000); // wait for 5 seconds to allow status to update
//     PollAndGetData(); // start polling for status and fetching research data
    

//     toast({
//       title: "Generating your book outline",
//       description: "This may take a few moments. Please don’t close this page.",
//     });
//   } catch (err) {
//     setIsSearching(false);
//     toast({
//       title: "Failed to start outline generation",
//       description: "Please try again.",
//       variant: "destructive",
//     });
//   }
//   finally {
//     setIsSearching(false);
//   }
// };


const handleGenerateOutline = async () => {
  try {
    setIsSearching(true);

    await CreateBookOutline();

    toast({
      title: "Generating your book outline",
      description: "This may take a few moments. Please don’t close this page.",
    });

    // give backend a moment to update status
    await delay(1500);

    PollAndGetData();
  } catch (err) {
    setIsSearching(false);
    toast({
      title: "Failed to start outline generation",
      description: "Please try again.",
      variant: "destructive",
    });
  }
};

useEffect(() => {
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, []);




  const searchPhases = [
    "Scanning public records...",
    "Analyzing professional history...",
    "Gathering achievements...",
    "Synthesizing insights...",
    "Building your story foundation..."
  ];

  // useEffect(() => {
  //   const fetchFootprint = async () => {
      
  //     const phaseInterval = setInterval(() => {
  //       setSearchPhase((prev) => (prev < searchPhases.length - 1 ? prev + 1 : prev));
  //     }, 1500);

  //     try {
  //       const { data, error } = await supabase.functions.invoke('research-footprint', {
  //         body: { basicInfo }
  //       });

  //       if (error) throw new Error(error.message);
  //       if (data.error) throw new Error(data.error);

  //       setFootprint(data);
  //     } catch (error) {
  //       console.error('Footprint research error:', error);
  //       toast({
  //         title: "Research Complete",
  //         description: "We've gathered what we could find. Let's build your story together!",
  //       });
  //       // Create fallback footprint
  //       setFootprint({
  //         biography: `${basicInfo.fullName} is ${basicInfo.role || 'an individual'} with a unique story to tell.`,
  //         career: basicInfo.role ? `Currently serving as ${basicInfo.role}.` : "Career journey to be explored through your narrative.",
  //         achievements: "Your achievements will be revealed through the questions ahead.",
  //         publicStatements: "Your voice and perspectives will shape this section.",
  //         insights: "A story waiting to be told, full of potential and meaning.",
  //         authenticityScore: 50,
  //         chapters: [
  //           { title: "Origins", summary: "Where your story begins", dataStrength: "weak" as const },
  //           { title: "Professional Journey", summary: "Your career path and growth", dataStrength: "moderate" as const },
  //           { title: "Growth & Discovery", summary: "What drives and inspires you", dataStrength: "weak" as const },
  //           { title: "Legacy", summary: "The impact you want to leave", dataStrength: "weak" as const },
  //         ]
  //       });
  //     } finally {
  //       clearInterval(phaseInterval);
  //       setIsSearching(false);
  //     }
  //   };

  //   fetchFootprint();
  // }, [basicInfo]);

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

  const hasOutline = footprint?.chapters?.length > 0;


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
        {/* Generate Outline CTA */}
<div className="glass-card rounded-3xl p-8 mb-8 text-center animate-slide-up">
  <h3 className="text-xl font-display font-medium text-foreground mb-3">
    Ready to Generate Your Book Outline?
  </h3>

  <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
    We’ll analyze your information and create a structured chapter outline
    that you can review before writing your story.
  </p>

  <Button
    variant="warm"
    size="xl"
    onClick={handleGenerateOutline}
    disabled={isSearching}
    className="shadow-glow"
  >
    {isSearching ? (
      <>
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        Generating Outline…
      </>
    ) : (
      <>
        Generate My Book Outline
        <Sparkles className="h-5 w-5 ml-2" />
      </>
    )}
  </Button>
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
  onClick={() => {
    if (!hasOutline) {
      toast({
        title: "Generate your outline first",
        description:
          "Please generate your book outline before continuing to add your story.",
        variant: "destructive",
      });
      return;
    }

    onComplete(footprint);
  }}
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
