import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, ArrowRight, Sparkles, Heart, Briefcase, Star, Feather, Crown, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookType } from "@/hooks/useBook";

interface BookSetupProps {
  onComplete: (title: string, subtitle: string, bookType: BookType, dedication: string, coverColor: string) => void;
  onBack: () => void;
}

const bookTypes: { id: BookType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: "autobiography",
    label: "Autobiography",
    description: "The complete story of your life",
    icon: BookOpen,
  },
  {
    id: "memoir",
    label: "Memoir",
    description: "Focus on specific themes or periods",
    icon: Feather,
  },
  {
    id: "professional",
    label: "Professional",
    description: "Your career journey and wisdom",
    icon: Briefcase,
  },
  {
    id: "legacy",
    label: "Legacy",
    description: "Wisdom for future generations",
    icon: Crown,
  },
  {
    id: "love_story",
    label: "Love Story",
    description: "Your romantic journey",
    icon: Heart,
  },
  {
    id: "fairy_tale",
    label: "Fairy Tale",
    description: "A magical retelling of your life",
    icon: Wand2,
  },
  {
    id: "fiction",
    label: "Inspired Fiction",
    description: "A story inspired by your experiences",
    icon: Sparkles,
  },
];

const coverColors = [
  { id: "coral", color: "#E86C5D", label: "Coral" },
  { id: "sky", color: "#5CB5E8", label: "Sky" },
  { id: "lavender", color: "#A78BFA", label: "Lavender" },
  { id: "forest", color: "#10B981", label: "Forest" },
  { id: "gold", color: "#F59E0B", label: "Gold" },
  { id: "midnight", color: "#1E293B", label: "Midnight" },
];

export const BookSetup = ({ onComplete, onBack }: BookSetupProps) => {
  const [step, setStep] = useState<"type" | "details">("type");
  const [bookType, setBookType] = useState<BookType>("autobiography");
  const [title, setTitle] = useState("My Story");
  const [subtitle, setSubtitle] = useState("");
  const [dedication, setDedication] = useState("");
  const [coverColor, setCoverColor] = useState(coverColors[0].color);

  const handleContinue = () => {
    if (step === "type") {
      setStep("details");
    } else {
      onComplete(title, subtitle, bookType, dedication, coverColor);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={step === "type" ? onBack : () => setStep("type")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <span className="text-sm">← Back</span>
        </button>

        {step === "type" ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4">
                What kind of book will you write?
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the format that best captures your story. You can always change this later.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {bookTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setBookType(type.id)}
                  className={cn(
                    "glass-card rounded-2xl p-6 text-left transition-all duration-300",
                    "hover:shadow-elevated hover:-translate-y-1",
                    bookType === type.id && "ring-2 ring-primary shadow-glow"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      bookType === type.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                      <type.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-foreground mb-1">
                        {type.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4">
                Personalize Your Book
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Add the finishing touches to make your book uniquely yours.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 shadow-elevated space-y-8">
              {/* Book Preview */}
              <div className="flex justify-center mb-8">
                <div
                  className="w-40 h-56 rounded-lg shadow-elevated flex flex-col items-center justify-center p-4 text-white relative overflow-hidden"
                  style={{ backgroundColor: coverColor }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
                  <BookOpen className="h-8 w-8 mb-2 relative z-10" />
                  <p className="font-display text-center text-sm font-medium relative z-10 leading-tight">
                    {title || "Your Title"}
                  </p>
                  {subtitle && (
                    <p className="text-xs opacity-80 text-center mt-1 relative z-10">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Story"
                  className="h-12 rounded-xl text-lg"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle (optional)</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A journey of discovery"
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Cover Color */}
              <div className="space-y-3">
                <Label>Cover Color</Label>
                <div className="flex flex-wrap gap-3">
                  {coverColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setCoverColor(color.color)}
                      className={cn(
                        "w-12 h-12 rounded-xl transition-all duration-200",
                        coverColor === color.color && "ring-2 ring-offset-2 ring-primary scale-110"
                      )}
                      style={{ backgroundColor: color.color }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Dedication */}
              <div className="space-y-2">
                <Label htmlFor="dedication">Dedication (optional)</Label>
                <Textarea
                  id="dedication"
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="To my family, who believed in me from the start..."
                  className="min-h-[100px] rounded-xl resize-none"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center mt-8">
          <Button variant="warm" size="xl" onClick={handleContinue} className="shadow-glow">
            {step === "type" ? "Continue" : "Start Writing"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};