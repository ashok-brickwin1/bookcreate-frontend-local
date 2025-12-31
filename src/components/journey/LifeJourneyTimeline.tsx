import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lifeStages } from "@/data/bookQuestions";
import { TrendingUp, TrendingDown, Plus, Sparkles, Calendar, MapPin } from "lucide-react";
import { createLifeMoment,deleteLifeMoment } from "@/api/lifeMoment";
export interface JourneyMoment {
  id: string;
  lifeStage: "foundations" | "growth" | "mastery" | "wisdom";
  type: "high" | "low";
  year?: string;
  title: string;
  description: string;
  lesson?: string;
}

interface LifeJourneyTimelineProps {
  moments: JourneyMoment[];
  onAddMoment: (moment: Omit<JourneyMoment, "id">) => void;
  onRemoveMoment?: (id: string) => void;
}

const stageColors = {
  foundations: "from-amber-500/20 to-amber-500/5",
  growth: "from-emerald-500/20 to-emerald-500/5",
  mastery: "from-blue-500/20 to-blue-500/5",
  wisdom: "from-purple-500/20 to-purple-500/5",
};

const stageBorderColors = {
  foundations: "border-amber-500/30",
  growth: "border-emerald-500/30",
  mastery: "border-blue-500/30",
  wisdom: "border-purple-500/30",
};

const stageTextColors = {
  foundations: "text-amber-600 dark:text-amber-400",
  growth: "text-emerald-600 dark:text-emerald-400",
  mastery: "text-blue-600 dark:text-blue-400",
  wisdom: "text-purple-600 dark:text-purple-400",
};

export function LifeJourneyTimeline({ moments, onAddMoment, onRemoveMoment }: LifeJourneyTimelineProps) {
  const [isAddingMoment, setIsAddingMoment] = useState(false);
  const [newMoment, setNewMoment] = useState<Partial<JourneyMoment>>({
    type: "high",
    lifeStage: "foundations",
  });

  const handleAddMoment = () => {
    if (newMoment.title && newMoment.lifeStage && newMoment.type) {
      onAddMoment({
        lifeStage: newMoment.lifeStage,
        type: newMoment.type,
        year: newMoment.year,
        title: newMoment.title,
        description: newMoment.description || "",
        lesson: newMoment.lesson,
      });
      setNewMoment({ type: "high", lifeStage: "foundations" });
      setIsAddingMoment(false);
    }
  };

 





  const getMomentsForStage = (stageId: string) => {
    return moments.filter((m) => m.lifeStage === stageId);
  };

  // Calculate the "journey line" path based on moments
  const getJourneyPath = () => {
    const points: { stage: number; value: number }[] = [];
    
    lifeStages.forEach((stage, index) => {
      const stageMoments = getMomentsForStage(stage.id);
      const highs = stageMoments.filter((m) => m.type === "high").length;
      const lows = stageMoments.filter((m) => m.type === "low").length;
      const value = highs - lows; // Net positivity
      points.push({ stage: index, value });
    });

    return points;
  };

  const journeyPath = getJourneyPath();
  const maxValue = Math.max(3, ...journeyPath.map((p) => Math.abs(p.value)));

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Life Journey
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Map the highs and lows that shaped your thinking across life stages
            </p>
          </div>
          <Dialog open={isAddingMoment} onOpenChange={setIsAddingMoment}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Moment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add a Life Moment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select
                      value={newMoment.type}
                      onValueChange={(v) => setNewMoment({ ...newMoment, type: v as "high" | "low" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">
                          <span className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            High Point
                          </span>
                        </SelectItem>
                        <SelectItem value="low">
                          <span className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-rose-500" />
                            Low Point
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Life Stage</label>
                    <Select
                      value={newMoment.lifeStage}
                      onValueChange={(v) => setNewMoment({ ...newMoment, lifeStage: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {lifeStages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year (optional)</label>
                  <Input
                    placeholder="e.g., 1995"
                    value={newMoment.year || ""}
                    onChange={(e) => setNewMoment({ ...newMoment, year: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">What happened?</label>
                  <Input
                    placeholder="Brief title for this moment"
                    value={newMoment.title || ""}
                    onChange={(e) => setNewMoment({ ...newMoment, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tell the story</label>
                  <Textarea
                    placeholder="Describe this moment and its impact on your life..."
                    value={newMoment.description || ""}
                    onChange={(e) => setNewMoment({ ...newMoment, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">What did you learn?</label>
                  <Textarea
                    placeholder="How did this shape your thinking?"
                    value={newMoment.lesson || ""}
                    onChange={(e) => setNewMoment({ ...newMoment, lesson: e.target.value })}
                    rows={2}
                  />
                </div>

                <Button onClick={handleAddMoment} className="w-full" disabled={!newMoment.title}>
                  Add to Timeline
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Visual Timeline Graph */}
        <div className="relative mb-8">
          <svg viewBox="0 0 400 100" className="w-full h-24 overflow-visible">
            {/* Grid lines */}
            <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4" />
            
            {/* Journey path */}
            <path
              d={`M ${journeyPath.map((p, i) => {
                const x = 50 + i * 100;
                const y = 50 - (p.value / maxValue) * 30;
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              }).join(" ")}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-lg"
            />
            
            {/* Stage markers */}
            {journeyPath.map((p, i) => {
              const x = 50 + i * 100;
              const y = 50 - (p.value / maxValue) * 30;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="hsl(var(--background))"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="hsl(var(--primary))"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Labels */}
          <div className="flex justify-between px-4">
            {lifeStages.map((stage) => (
              <div key={stage.id} className="text-center w-1/4">
                <p className={`text-xs font-medium ${stageTextColors[stage.id]}`}>
                  {stage.title}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {stage.ageRange}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {lifeStages.map((stage) => {
            const stageMoments = getMomentsForStage(stage.id);
            const highs = stageMoments.filter((m) => m.type === "high");
            const lows = stageMoments.filter((m) => m.type === "low");

            return (
              <div
                key={stage.id}
                className={`rounded-lg border ${stageBorderColors[stage.id]} bg-gradient-to-b ${stageColors[stage.id]} p-4`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-semibold text-sm ${stageTextColors[stage.id]}`}>
                    {stage.title}
                  </h4>
                  <div className="flex gap-1">
                    {highs.length > 0 && (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs px-1.5">
                        {highs.length} <TrendingUp className="h-3 w-3 ml-0.5" />
                      </Badge>
                    )}
                    {lows.length > 0 && (
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30 text-xs px-1.5">
                        {lows.length} <TrendingDown className="h-3 w-3 ml-0.5" />
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2 min-h-[80px]">
                  {stageMoments.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-4">
                      No moments added yet
                    </p>
                  ) : (
                    stageMoments.map((moment) => (
                      <div
                        key={moment.id}
                        className={`p-2 rounded-md text-xs ${
                          moment.type === "high"
                            ? "bg-emerald-500/10 border border-emerald-500/20"
                            : "bg-rose-500/10 border border-rose-500/20"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {moment.type === "high" ? (
                            <TrendingUp className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-rose-500 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="font-medium truncate">{moment.title}</span>
                              {moment.year && (
                                <span className="text-muted-foreground flex items-center gap-0.5">
                                  <Calendar className="h-2.5 w-2.5" />
                                  {moment.year}
                                </span>
                              )}
                            </div>
                            {moment.description && (
                              <p className="text-muted-foreground line-clamp-2 mt-0.5">
                                {moment.description}
                              </p>
                            )}
                            {moment.lesson && (
                              <p className="text-primary/80 italic mt-1 line-clamp-1">
                                💡 {moment.lesson}
                              </p>
                            )}
                          </div>
                          {onRemoveMoment && (
                            <button
                              onClick={() => onRemoveMoment(moment.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {moments.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-sm">Your Journey Summary</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              You've mapped <span className="text-emerald-600 font-medium">{moments.filter((m) => m.type === "high").length} highs</span> and{" "}
              <span className="text-rose-600 font-medium">{moments.filter((m) => m.type === "low").length} lows</span> across your life stages.
              {moments.some((m) => m.lesson) && (
                <> These experiences have shaped your thinking and the wisdom you carry today.</>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
