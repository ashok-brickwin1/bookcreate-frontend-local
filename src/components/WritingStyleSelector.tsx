import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Pen, 
  Upload, 
  Link, 
  BookOpen, 
  Briefcase, 
  Youtube, 
  FileText, 
  Sparkles,
  Loader2,
  Check,
  X
} from "lucide-react";
import { 
  leadingWithLoveStyle, 
  WritingStyle, 
  sourceTypeLabels, 
  sourceTypeIcons 
} from "@/data/writingStyles";
import { cn } from "@/lib/utils";

interface WritingStyleSelectorProps {
  currentStyle: WritingStyle | null;
  onStyleChange: (style: WritingStyle | null) => void;
}

export const WritingStyleSelector = ({ 
  currentStyle, 
  onStyleChange 
}: WritingStyleSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedSourceType, setSelectedSourceType] = useState<WritingStyle['sourceType']>('book');
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [styleName, setStyleName] = useState("");
  const { toast } = useToast();

  const handleExtractStyle = async () => {
    const content = textInput.trim() || urlInput.trim();
    if (!content) {
      toast({
        title: "No content provided",
        description: "Please paste text or enter a URL to extract a writing style.",
        variant: "destructive"
      });
      return;
    }

    if (!styleName.trim()) {
      toast({
        title: "Name your style",
        description: "Give your writing style a name to identify it.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-writing-style', {
        body: {
          content: textInput.trim() || null,
          url: urlInput.trim() || null,
          sourceType: selectedSourceType,
          styleName: styleName.trim()
        }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const newStyle: WritingStyle = {
        id: `custom-${Date.now()}`,
        name: styleName.trim(),
        sourceType: selectedSourceType,
        sourceDescription: urlInput.trim() || "Pasted content",
        characteristics: data.characteristics || [],
        toneGuidance: data.toneGuidance || "",
        createdAt: new Date().toISOString()
      };

      onStyleChange(newStyle);
      setIsOpen(false);
      resetForm();
      
      toast({
        title: "Writing style extracted!",
        description: `"${styleName}" is now your active writing style.`
      });
    } catch (error) {
      console.error('Extract style error:', error);
      toast({
        title: "Couldn't extract style",
        description: "Please try again with different content.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const resetForm = () => {
    setUrlInput("");
    setTextInput("");
    setStyleName("");
    setSelectedSourceType('book');
  };

  const handleUseDefault = () => {
    onStyleChange(null);
    setIsOpen(false);
    toast({
      title: "Using default style",
      description: "Leading with Love is now your active writing style."
    });
  };

  const sourceOptions = [
    { type: 'book' as const, icon: BookOpen, label: 'Book' },
    { type: 'article' as const, icon: FileText, label: 'Article' },
    { type: 'linkedin' as const, icon: Briefcase, label: 'LinkedIn' },
    { type: 'youtube' as const, icon: Youtube, label: 'YouTube' },
    { type: 'magazine' as const, icon: FileText, label: 'Magazine' },
    { type: 'custom' as const, icon: Pen, label: 'Custom' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pen className="h-4 w-4" />
          {currentStyle ? currentStyle.name : "Leading with Love"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Writing Style
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Style Display */}
          <Card className="p-4 bg-secondary/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Style</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {currentStyle 
                      ? sourceTypeIcons[currentStyle.sourceType] 
                      : sourceTypeIcons.default}
                  </span>
                  <h3 className="font-semibold">
                    {currentStyle?.name || leadingWithLoveStyle.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentStyle?.sourceDescription || leadingWithLoveStyle.description}
                </p>
              </div>
              {currentStyle && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleUseDefault}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </Card>

          {/* Style Characteristics Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Style Characteristics</p>
            <div className="flex flex-wrap gap-2">
              {(currentStyle?.characteristics || leadingWithLoveStyle.characteristics)
                .slice(0, 5)
                .map((char, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {char}
                  </Badge>
                ))}
              {(currentStyle?.characteristics || leadingWithLoveStyle.characteristics).length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{(currentStyle?.characteristics || leadingWithLoveStyle.characteristics).length - 5} more
                </Badge>
              )}
            </div>
          </div>

          {/* Create Custom Style */}
          <div className="border-t border-border pt-6">
            <h4 className="font-medium mb-4">Create Custom Writing Style</h4>
            
            {/* Source Type Selection */}
            <div className="space-y-3 mb-4">
              <p className="text-sm text-muted-foreground">What type of content are you using?</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {sourceOptions.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSourceType(type)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                      selectedSourceType === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Name */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium">Style Name</label>
              <Input
                placeholder="e.g., 'My Leadership Voice' or 'Grandmother's Letters'"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
              />
            </div>

            {/* Content Input */}
            <Tabs defaultValue="paste" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="paste" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Paste Text
                </TabsTrigger>
                <TabsTrigger value="url" className="flex-1">
                  <Link className="h-4 w-4 mr-2" />
                  Enter URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="paste" className="mt-4">
                <Textarea
                  placeholder="Paste text from a book, article, LinkedIn post, YouTube transcript, or any content whose writing style you want to capture..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  For best results, paste at least 500 words of content that represents the writing style you want.
                </p>
              </TabsContent>
              
              <TabsContent value="url" className="mt-4">
                <Input
                  placeholder="https://linkedin.com/post/... or youtube.com/watch?v=..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter a URL to an article, LinkedIn post, or YouTube video (we'll extract the transcript).
                </p>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleExtractStyle}
              disabled={isExtracting || (!textInput.trim() && !urlInput.trim()) || !styleName.trim()}
              className="w-full mt-4"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Extracting Style...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Extract Writing Style
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
