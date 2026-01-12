import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { submitBookSetup } from "@/api/bookSetup";
import {fetchBookSetup} from "@/api/bookSetup";
import { 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Heart, 
  Briefcase, 
  Crown, 
  Wand2,
  FileText,
  Users,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookSetupData {
  genre: string;
  customGenre?: string;
  workingTitle: string;
  chapterCount: number;
  desiredLength: string;
  dedication: string;
  gdprConsent: boolean;
}

interface BookSetupStepProps {
  initialData?: BookSetupData;
  onComplete: (data: BookSetupData) => void;
  onBack: () => void;
}

const BOOK_GENRES = [
  {
    id: "autobiography",
    label: "Autobiography",
    description: "Your complete life story from beginning to now",
    icon: BookOpen,
  },
  {
    id: "memoir",
    label: "Memoir",
    description: "Focus on specific moments or themes in your life",
    icon: Heart,
  },
  {
    id: "professional",
    label: "Professional Journey",
    description: "Your career story, lessons learned, and expertise",
    icon: Briefcase,
  },
  {
    id: "legacy",
    label: "Legacy Book",
    description: "Wisdom and stories to pass down to future generations",
    icon: Crown,
  },
  {
    id: "fairy_tale",
    label: "Fairy Tale",
    description: "Your story told as a magical narrative",
    icon: Wand2,
  },
  {
    id: "love_story",
    label: "Love Story",
    description: "The story of your relationships and connections",
    icon: Sparkles,
  },
  {
    id: "custom",
    label: "Design Your Own",
    description: "Create a completely custom book structure",
    icon: FileText,
  },
];

const CHAPTER_OPTIONS = [5, 8, 10, 12, 15, 20];

const LENGTH_OPTIONS = [
  { id: "short", label: "Short", description: "50-100 pages", pages: "50-100" },
  { id: "medium", label: "Medium", description: "100-200 pages", pages: "100-200" },
  { id: "standard", label: "Standard", description: "200-300 pages", pages: "200-300" },
  { id: "comprehensive", label: "Comprehensive", description: "300+ pages", pages: "300+" },
];

export const BookSetupStep = ({ initialData, onComplete, onBack }: BookSetupStepProps) => {
  const [formData, setFormData] = useState<BookSetupData>(
    initialData || {
      genre: "",
      customGenre: "",
      workingTitle: "",
      chapterCount: 10,
      desiredLength: "medium",
      dedication: "",
      gdprConsent: false,
    }
  );

  const [loading, setLoading] = useState(true);

  



// const mapBookSetupFromApi = (apiData: any): BookSetupData => {
//   const b = apiData.book_setup;

//   return {
//     genre: b.genre,
//     customGenre: b.custom_genre ?? "",
//     workingTitle: b.working_title,
//     chapterCount: b.chapter_count,
//     desiredLength: b.desired_length,
//     dedication: b.dedication ?? "",
//     gdprConsent: b.gdpr_consent,
//   };
// };

const mapBookSetupFromApi = (apiData: any): BookSetupData => {
    const b = apiData.book_setup;

    return {
      genre: b.genre ?? "",
      customGenre: b.custom_genre ?? "",
      workingTitle: b.working_title ?? "",
      chapterCount: b.chapter_count ?? 10,
      desiredLength: b.desired_length ?? "medium",
      dedication: b.dedication ?? "",
      gdprConsent: b.gdpr_consent ?? false,
    };
  };
 useEffect(() => {
    const loadBookSetup = async () => {
      try {
        const res = await fetchBookSetup();

        if (res?.book_setup) {
          const mapped = mapBookSetupFromApi(res);
          const newjourney = localStorage.getItem("newjourney");
          // if(newjourney==="false"){
          //   console.log("Setting form data from API for existing journey");
          //   setFormData(formData);
          // }
          if(newjourney=="false")
          setFormData(mapped); // ✅ THIS was missing
        }
      } catch (err) {
        console.error("Failed to load book setup", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookSetup();
  }, []);


  const handleGenreSelect = (genreId: string) => {
    setFormData((prev) => ({ ...prev, genre: genreId }));
  };

  const handleChange = (field: keyof BookSetupData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = 
    formData.genre && 
    formData.workingTitle.trim() && 
    formData.gdprConsent &&
    (formData.genre !== "custom" || formData.customGenre?.trim());

  
    if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <BookOpen className="h-8 w-8 animate-pulse text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading book setup…
        </p>
      </div>
    </div>
  );
}

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
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4">
            Design Your Book
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Choose the style and structure that best fits your story. 
            This will guide how we craft your narrative.
          </p>
        </div>

        {/* Genre Selection */}
        <div className="mb-10 animate-slide-up">
          <h2 className="text-xl font-display font-medium text-foreground mb-4">
            What type of book do you want to create?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOOK_GENRES.map((genre) => {
              const Icon = genre.icon;
              const isSelected = formData.genre === genre.id;
              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id)}
                  className={cn(
                    "glass-card p-5 rounded-2xl text-left transition-all duration-300 group",
                    "hover:shadow-elevated hover:scale-[1.02]",
                    isSelected 
                      ? "ring-2 ring-primary bg-primary/5" 
                      : "hover:bg-background/50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{genre.label}</h3>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {genre.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Genre Input */}
          {formData.genre === "custom" && (
            <div className="mt-4 animate-fade-in">
              <Label htmlFor="customGenre">Describe your custom book type</Label>
              <Input
                id="customGenre"
                value={formData.customGenre}
                onChange={(e) => handleChange("customGenre", e.target.value)}
                placeholder="e.g., A cookbook intertwined with family stories..."
                className="h-12 rounded-xl mt-2"
              />
            </div>
          )}
        </div>

        {/* Book Details */}
        {formData.genre && (
          <div className="glass-card rounded-3xl p-8 shadow-elevated space-y-8 animate-slide-up">
            {/* Working Title */}
            <div className="space-y-2">
              <Label htmlFor="workingTitle" className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Working Title *
              </Label>
              <p className="text-sm text-muted-foreground">
                What do you think your book might be called? You can change this later.
              </p>
              <Input
                id="workingTitle"
                value={formData.workingTitle}
                onChange={(e) => handleChange("workingTitle", e.target.value)}
                placeholder="e.g., My Journey Through Life..."
                className="h-12 rounded-xl"
              />
            </div>

            {/* Chapter Count */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                How many chapters?
              </Label>
              <div className="flex flex-wrap gap-3">
                {CHAPTER_OPTIONS.map((count) => (
                  <button
                    key={count}
                    onClick={() => handleChange("chapterCount", count)}
                    className={cn(
                      "h-12 px-6 rounded-xl font-medium transition-all",
                      formData.chapterCount === count
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Desired Length */}
            <div className="space-y-3">
              <Label className="text-base">How long should your book be?</Label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {LENGTH_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChange("desiredLength", option.id)}
                    className={cn(
                      "p-4 rounded-xl text-left transition-all",
                      formData.desiredLength === option.id
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className={cn(
                      "text-sm",
                      formData.desiredLength === option.id 
                        ? "text-primary-foreground/80" 
                        : "text-muted-foreground"
                    )}>
                      {option.pages} pages
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dedication */}
            <div className="space-y-2">
              <Label htmlFor="dedication" className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-muted-foreground" />
                Dedication (optional)
              </Label>
              <p className="text-sm text-muted-foreground">
                Is there someone special you'd like to dedicate this book to?
              </p>
              <Textarea
                id="dedication"
                value={formData.dedication}
                onChange={(e) => handleChange("dedication", e.target.value)}
                placeholder="e.g., To my children and grandchildren, may this story inspire your own journeys..."
                className="min-h-[80px] rounded-xl resize-none"
              />
            </div>

            {/* GDPR Consent */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="gdprConsent"
                  checked={formData.gdprConsent}
                  onCheckedChange={(checked) => handleChange("gdprConsent", checked === true)}
                  className="mt-1"
                />
                <div>
                  <Label 
                    htmlFor="gdprConsent" 
                    className="text-sm font-medium cursor-pointer"
                  >
                    I consent to ECwriter using my data *
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I understand that ECwriter will use the information I provide solely for the purpose 
                    of generating a sample book for me. My book will not be published, shared, or 
                    distributed without my explicit written permission. I can request deletion of my 
                    data at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button
            variant="warm"
            size="xl"
            onClick={async () => {
              try {
                const res = await submitBookSetup(formData);

                localStorage.setItem("current_book_id", res.book_id);

                onComplete(formData);
              } catch (err) {
                console.error(err);
                alert("Failed to save book setup");
              }
            }}
            disabled={!isValid}
            className="shadow-glow"
          >
            Continue to Footprint Discovery
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};