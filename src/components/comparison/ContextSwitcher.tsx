import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, MessageCircle, Code, Globe, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextSwitcherProps {
  bookTitle: string;
  onRefine: () => void;
}

const CONTEXTS = [
  {
    id: "executive",
    label: "Executive Decision",
    icon: Briefcase,
    description: "Strategic, decisive, outcome-focused",
    example: "Based on the data and our strategic objectives, I recommend we proceed with Option B. It aligns with our core values while managing risk effectively. Here's the implementation timeline...",
  },
  {
    id: "coaching",
    label: "Coaching Conversation",
    icon: MessageCircle,
    description: "Warm, inquisitive, supportive",
    example: "I hear what you're saying, and there's real wisdom in that hesitation. What if we explored what's underneath that feeling? Sometimes our resistance points us toward what matters most...",
  },
  {
    id: "technical",
    label: "Technical Explanation",
    icon: Code,
    description: "Precise, structured, educational",
    example: "The core architecture follows a modular pattern where each component handles a specific responsibility. Let me walk you through the three key layers and how they interact...",
  },
  {
    id: "public",
    label: "Public-Facing Message",
    icon: Globe,
    description: "Inspiring, clear, values-driven",
    example: "We believe in building technology that amplifies human potential, not replaces it. Every feature we ship asks one question: does this help people do more of what matters?",
  },
  {
    id: "crisis",
    label: "Crisis Response",
    icon: AlertTriangle,
    description: "Calm, direct, action-oriented",
    example: "Here's what happened, here's what we're doing about it, and here's how we're making sure it doesn't happen again. Let me address each of your concerns directly...",
  },
];

export const ContextSwitcher = ({ bookTitle, onRefine }: ContextSwitcherProps) => {
  const [activeContext, setActiveContext] = useState<string>("executive");
  const activeContextData = CONTEXTS.find((c) => c.id === activeContext);

  return (
    <div className="min-h-[80vh] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Context Switching Preview
          </h2>
          <p className="text-muted-foreground">
            See how your digital twin adapts tone and depth across different contexts — without losing identity
          </p>
        </div>

        {/* Context Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CONTEXTS.map((context) => {
            const Icon = context.icon;
            return (
              <button
                key={context.id}
                onClick={() => setActiveContext(context.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all",
                  activeContext === context.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{context.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Context Preview */}
        {activeContextData && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <activeContextData.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{activeContextData.label}</h3>
                <p className="text-xs text-muted-foreground">{activeContextData.description}</p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-5">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                {bookTitle} Digital Twin Response
              </p>
              <p className="text-sm text-foreground leading-relaxed italic">
                "{activeContextData.example}"
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Same values and identity, adapted for context
            </p>
          </div>
        )}

        {/* Why This Works */}
        <div className="glass-card rounded-xl p-5 bg-primary/5 border border-primary/20">
          <h4 className="font-medium text-sm mb-3">Why This Works</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Digital Twins fail when they are trained only on words.
            They succeed when they are aligned on <strong className="text-foreground">values, intent, tone, and decision posture</strong>.
            This comparison reveals gaps humans feel instinctively — until now.
          </p>
        </div>

        {/* Final CTA */}
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <p className="text-foreground leading-relaxed">
            If an AI is going to speak for you,<br />
            influence decisions for you,<br />
            or scale your presence —<br />
            <strong>it should represent you accurately.</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            This tool gives you the language and leverage to make that real.
          </p>
          <Button variant="warm" size="lg" className="gap-2" onClick={onRefine}>
            <Sparkles className="w-4 h-4" />
            Refine This Digital Twin
          </Button>
        </div>
      </div>
    </div>
  );
};
