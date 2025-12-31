import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LandingPage } from "@/components/LandingPage";
import { StoryJourney } from "@/components/journey/StoryJourney";
import { Loader2 } from "lucide-react";

type AppState = "landing" | "journey";

const Index = () => {
  const { loading: authLoading } = useAuth();
  const [state, setState] = useState<AppState>("landing");

  const handleStart = () => {
    setState("journey");
  };

  const handleBackToLanding = () => {
    setState("landing");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state === "landing") {
    return <LandingPage onStart={handleStart} />;
  }

  return <StoryJourney onBack={handleBackToLanding} />;
};

export default Index;