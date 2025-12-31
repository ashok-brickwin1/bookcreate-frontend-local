import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, User, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Entity {
  id: string;
  name: string;
  description: string;
  type: "twin" | "human";
  source: string;
}

interface EntitySelectorProps {
  twinProfile: string;
  bookTitle: string;
  onCompare: (entityA: Entity, entityB: Entity) => void;
}

const AI_MODELS = [
  { id: "groq", name: "Groq (Llama)", description: "Fast inference, different interpretation" },
  { id: "chatgpt", name: "ChatGPT (GPT-5)", description: "OpenAI's flagship model" },
  { id: "gemini", name: "Gemini Pro", description: "Google's reasoning model" },
  { id: "claude", name: "Claude", description: "Anthropic's conversational model" },
];

export const EntitySelector = ({ twinProfile, bookTitle, onCompare }: EntitySelectorProps) => {
  const [selectedA, setSelectedA] = useState<string>("your-twin");
  const [selectedB, setSelectedB] = useState<string | null>(null);

  const yourTwin: Entity = {
    id: "your-twin",
    name: `${bookTitle} — Your Digital Twin`,
    description: "Generated from your book and stories",
    type: "twin",
    source: twinProfile,
  };

  const entities: Entity[] = AI_MODELS.map((model) => ({
    id: model.id,
    name: `${model.name} Interpretation`,
    description: model.description,
    type: "twin" as const,
    source: model.id,
  }));

  const handleCompare = () => {
    if (!selectedB) return;
    const entityA = yourTwin;
    const entityB = entities.find((e) => e.id === selectedB)!;
    onCompare(entityA, entityB);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Select What to Compare
          </h2>
          <p className="text-muted-foreground">
            Compare your digital twin against other AI interpretations
          </p>
        </div>

        {/* Your Twin (always selected) */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Your Digital Twin</label>
          <div className="glass-card rounded-xl p-4 border-2 border-primary bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{yourTwin.name}</p>
                <p className="text-xs text-muted-foreground">{yourTwin.description}</p>
              </div>
              <Check className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Other AI Models */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Compare Against</label>
          <div className="grid gap-3">
            {entities.map((entity) => (
              <button
                key={entity.id}
                onClick={() => setSelectedB(entity.id)}
                className={cn(
                  "glass-card rounded-xl p-4 text-left transition-all",
                  selectedB === entity.id
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-border/50 hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{entity.name}</p>
                    <p className="text-xs text-muted-foreground">{entity.description}</p>
                  </div>
                  {selectedB === entity.id && <Check className="w-5 h-5 text-primary" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="warm"
          size="lg"
          className="w-full gap-2"
          onClick={handleCompare}
          disabled={!selectedB}
        >
          Compare
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
