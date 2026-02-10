import { useEffect, useState } from "react";
import { fetchVisionQuestions } from "@/api/vision";
import { VisionQuestion } from "@/types/vision";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { handleSubmitBasicInfo } from "@/api/basicInfo";
import { ArrowRight, User, Mail, Briefcase, Globe, Linkedin, Twitter, Sparkles, Plus, X, BookOpen, Film, Music, Heart, Rocket, Brain, Users, Compass, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VITE_API_BASE_URL } from "@/const";



const API_BASE = VITE_API_BASE_URL;

export interface InfluentialContent {
  personal: { type: string; title: string; why: string }[];
  professional: { type: string; title: string; why: string }[];
  curiosity: { type: string; title: string; why: string }[];
  legacy: { type: string; title: string; why: string }[];
}

export interface ForwardVision {
  careerOutlook: string;
  skillsToLearn: string;
  familyPlans: string;
  curiosityAreas: string;
  legacyGoals: string;
}

export interface BasicInfo {
  fullName: string;
  email: string;
  role: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  additionalSocialSites?: string[];
  influentialContent?: InfluentialContent;
  forwardVision?: ForwardVision;
}

interface BasicInfoStepProps {
  initialData?: BasicInfo;
  onComplete: (data: BasicInfo) => void;
  onBack: () => void;
}



const SOCIAL_SITE_SUGGESTIONS = [
  { name: "Facebook", placeholder: "facebook.com/username" },
  { name: "Instagram", placeholder: "instagram.com/username" },
  { name: "YouTube", placeholder: "youtube.com/@channel" },
  { name: "TikTok", placeholder: "tiktok.com/@username" },
  { name: "Medium", placeholder: "medium.com/@username" },
  { name: "GitHub", placeholder: "github.com/username" },
  { name: "Pinterest", placeholder: "pinterest.com/username" },
  { name: "Threads", placeholder: "threads.net/@username" },
  { name: "Reddit", placeholder: "reddit.com/u/username" },
  { name: "Substack", placeholder: "username.substack.com" },
];

const CONTENT_TYPES = [
  { value: "book", label: "Book", icon: BookOpen },
  { value: "movie", label: "Movie/Film", icon: Film },
  { value: "song", label: "Song/Music", icon: Music },
  { value: "podcast", label: "Podcast", icon: Compass },
  { value: "article", label: "Article/Essay", icon: BookOpen },
  { value: "speech", label: "Speech/Talk", icon: Users },
  { value: "other", label: "Other", icon: Sparkles },
];

const QUADRANTS = [
  { key: "personal", label: "Personal", icon: Heart, description: "Content that shaped who you are personally" },
  { key: "professional", label: "Professional", icon: Briefcase, description: "Content that influenced your career thinking" },
  { key: "curiosity", label: "Curiosity & Growth", icon: Brain, description: "Content that sparked new interests or learning" },
  { key: "legacy", label: "Legacy & Meaning", icon: Rocket, description: "Content that influenced your sense of purpose" },
] as const;

export const BasicInfoStep = ({ initialData, onComplete, onBack }: BasicInfoStepProps) => {
  const [formData, setFormData] = useState<BasicInfo>(
    initialData || {
      fullName: "",
      email: "",
      role: "",
      bio: "",
      linkedin: "",
      twitter: "",
      website: "",
      additionalSocialSites: [],
      influentialContent: {
        personal: [],
        professional: [],
        curiosity: [],
        legacy: [],
      },
      forwardVision: {
        careerOutlook: "",
        skillsToLearn: "",
        familyPlans: "",
        curiosityAreas: "",
        legacyGoals: "",
      },
    }
  );
  const [showSocialDialog, setShowSocialDialog] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [activeQuadrant, setActiveQuadrant] = useState<keyof InfluentialContent>("personal");
  const [newContent, setNewContent] = useState({ type: "book", title: "", why: "" });
  const [contentSectionOpen, setContentSectionOpen] = useState(false);
  const [visionSectionOpen, setVisionSectionOpen] = useState(false);
  const [visionQuestions, setVisionQuestions] = useState<Record<string, VisionQuestion[]>>({});
  const [visionLoading, setVisionLoading] = useState(true);

  const [visionAnswers, setVisionAnswers] = useState<Record<string, string>>({});

  const [socialSites, setSocialSites] = useState<{ name: string; url: string }[]>(
    initialData?.additionalSocialSites?.map((url, i) => ({ 
      name: SOCIAL_SITE_SUGGESTIONS[i]?.name || `Site ${i + 1}`, 
      url 
    })) || []
  );

  const handleChange = (field: keyof BasicInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  //  change 
  const buildSubmitPayload = () => {
  const basic_info = {
    full_name: formData.fullName,
    email: formData.email,
    role: formData.role,
    bio: formData.bio,
  };

  const social_profiles = {
    linkedin: formData.linkedin || null,
    twitter: formData.twitter || null,
    website: formData.website || null,
    others: socialSites.reduce<Record<string, string>>((acc, s) => {
      if (s.url) acc[s.name.toLowerCase()] = s.url;
      return acc;
    }, {}),
  };

  const influential_content = formData.influentialContent;

  const vision_answers = Object.entries(visionAnswers).map(
    ([vision_question_id, answer]) => ({
      vision_question_id,
      answer,
    })
  );

  return {
    basic_info,
    social_profiles,
    influential_content,
    vision_answers,
  };
};

const handleSubmit = async () => {
  console.log("handle submit called")
  const payload = buildSubmitPayload();
  

  try {

    
    const data= await handleSubmitBasicInfo(payload)
    onComplete(formData); // keep your existing flow
  } catch (err) {
    console.error("Failed to submit onboarding", err);
    alert(err.message);
  }
};

  


  useEffect(() => {
  fetchVisionQuestions()
    .then((data) => {
      const grouped = data.reduce((acc, q) => {
        const key = q.vision_type_title;

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(q);
        return acc;
      }, {} as Record<string, VisionQuestion[]>);

      setVisionQuestions(grouped);
    })
    .catch((err) => {
      console.error("Failed to load vision questions", err);
    })
    .finally(() => setVisionLoading(false));
}, []);



  const handleSocialSiteChange = (index: number, url: string) => {
    const updated = [...socialSites];
    updated[index] = { ...updated[index], url };
    setSocialSites(updated);
  };

  const addSocialSite = (suggestion: { name: string; placeholder: string }) => {
    if (socialSites.length < 10 && !socialSites.find(s => s.name === suggestion.name)) {
      setSocialSites([...socialSites, { name: suggestion.name, url: "" }]);
    }
  };

  const removeSocialSite = (index: number) => {
    setSocialSites(socialSites.filter((_, i) => i !== index));
  };

  const handleSaveSocialSites = () => {
    setFormData(prev => ({
      ...prev,
      additionalSocialSites: socialSites.filter(s => s.url.trim()).map(s => s.url)
    }));
    setShowSocialDialog(false);
  };

  const handleAddContent = () => {
    if (newContent.title.trim() && newContent.why.trim()) {
      setFormData(prev => ({
        ...prev,
        influentialContent: {
          ...prev.influentialContent!,
          [activeQuadrant]: [...(prev.influentialContent?.[activeQuadrant] || []), newContent]
        }
      }));
      setNewContent({ type: "book", title: "", why: "" });
    }
  };

  const handleDoneContent = () => {
    if (newContent.title.trim() && newContent.why.trim()) {
      setFormData(prev => ({
        ...prev,
        influentialContent: {
          ...prev.influentialContent!,
          [activeQuadrant]: [...(prev.influentialContent?.[activeQuadrant] || []), newContent]
        }
      }));
      
    }
    setNewContent({ type: "book", title: "", why: "" });
  };

  const handleRemoveContent = (quadrant: keyof InfluentialContent, index: number) => {
    setFormData(prev => ({
      ...prev,
      influentialContent: {
        ...prev.influentialContent!,
        [quadrant]: prev.influentialContent![quadrant].filter((_, i) => i !== index)
      }
    }));
  };

  const handleVisionChange = (field: keyof ForwardVision, value: string) => {
    setFormData(prev => ({
      ...prev,
      forwardVision: {
        ...prev.forwardVision!,
        [field]: value
      }
    }));
  };

  const getTotalContentCount = () => {
    const content = formData.influentialContent;
    if (!content) return 0;
    return content.personal.length + content.professional.length + content.curiosity.length + content.legacy.length;
  };



  const hydrateFromApiPayload = (payload: any) => {
  if (!payload) return;

  /* ---------------- Basic Info ---------------- */
  setFormData({
    fullName: payload.basic_info?.full_name || "",
    email: payload.basic_info?.email || "",
    role: payload.basic_info?.role || "",
    bio: payload.basic_info?.bio || "",

    linkedin: payload.social_profiles?.linkedin || "",
    twitter: payload.social_profiles?.twitter || "",
    website: payload.social_profiles?.website || "",

    additionalSocialSites: payload.social_profiles?.others
      ? Object.values(payload.social_profiles.others)
      : [],

    influentialContent: payload.influential_content || {
      personal: [],
      professional: [],
      curiosity: [],
      legacy: [],
    },

    forwardVision: {
      careerOutlook: "",
      skillsToLearn: "",
      familyPlans: "",
      curiosityAreas: "",
      legacyGoals: "",
    },
  });

  /* ---------------- Social Sites ---------------- */
  if (payload.social_profiles?.others) {
    const others = Object.entries(payload.social_profiles.others).map(
      ([name, url]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        url: url as string,
      })
    );
    setSocialSites(others);
  }

  /* ---------------- Vision Answers ---------------- */
  if (Array.isArray(payload.vision_answers)) {
    const visionMap: Record<string, string> = {};
    payload.vision_answers.forEach((v: any) => {
      visionMap[v.vision_question_id] = v.answer;
    });
    setVisionAnswers(visionMap);
  }
};


useEffect(() => {
  const loadExistingData = async () => {
    try {
      console.log("Loading existing onboarding data for hydration");
      let accessToken = localStorage.getItem("access_token");
      const newjourney = localStorage.getItem("newjourney");
      const path=newjourney==="true"?"onboarding/dummy/empty":"onboarding/dummy";
      if(newjourney==="true") {
      console.log("newjourney is true, returning empty data");
      return ;
  }

      const res = await fetch(`${API_BASE}/${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    });
      const data = await res.json();
      if(newjourney=="false")
      hydrateFromApiPayload(data);
    } catch (err) {
      console.error("Failed to hydrate onboarding data", err);
    }
  };

  loadExistingData();
}, []);


const isValid =
  formData.fullName.trim() &&
  formData.email.trim() &&
  formData.linkedin.trim();

  const hasSocialProfiles = formData.linkedin || formData.twitter || formData.website;

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <span className="text-sm">← Back</span>
        </button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground mb-4">
            Let's start with you
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Tell us a bit about yourself. We'll use this to discover your digital footprint 
            and help craft your unique story.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-elevated space-y-6 animate-slide-up">
          {/* Name & Email Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Your full name"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Current Role / Title
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="e.g., Entrepreneur, Author, Executive..."
              className="h-12 rounded-xl"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Brief Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="A short description of who you are and what you do..."
              className="min-h-[100px] rounded-xl resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Social profiles (optional - helps us find more about your story)
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2 text-sm">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  LinkedIn *
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/..."
                  className="h-10 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2 text-sm">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                  Twitter/X
                </Label>
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                  placeholder="@username"
                  className="h-10 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="yoursite.com"
                  className="h-10 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Quick Book Preview CTA - appears when social profiles are entered */}
          {hasSocialProfiles && (
            <div className="pt-4 border-t border-border animate-fade-in">
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">
                      Want a quick preview of your book?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your top social sites and we'll generate a first draft based on your digital footprint. This is optional—you can always do the full interview for a richer story.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSocialDialog(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Social Sites ({socialSites.filter(s => s.url).length}/10)
                    </Button>
                    {socialSites.filter(s => s.url).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {socialSites.filter(s => s.url).length} site(s) added
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Influential Content Section */}
          <Collapsible open={contentSectionOpen} onOpenChange={setContentSectionOpen}>
            <div className="pt-4 border-t border-border">
              <CollapsibleTrigger className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-foreground">Content That Changed Your Life</h3>
                    <p className="text-sm text-muted-foreground">
                      Books, movies, songs that shaped who you are {getTotalContentCount() > 0 && `(${getTotalContentCount()} added)`}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${contentSectionOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Tell us about content that has influenced you across different areas of your life. This helps us understand your values, inspirations, and what resonates with you.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {QUADRANTS.map((quadrant) => {
                    const Icon = quadrant.icon;
                    const count = formData.influentialContent?.[quadrant.key]?.length || 0;
                    return (
                      <Button
                        key={quadrant.key}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveQuadrant(quadrant.key);
                          setShowContentDialog(true);
                        }}
                        className="flex flex-col h-auto py-3 gap-1"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{quadrant.label}</span>
                        {count > 0 && (
                          <span className="text-xs text-primary">({count})</span>
                        )}
                      </Button>
                    );
                  })}
                </div>
                
                {/* Show added content */}
                {getTotalContentCount() > 0 && (
                  <div className="space-y-2">
                    {QUADRANTS.map((quadrant) => {
                      const items = formData.influentialContent?.[quadrant.key] || [];
                      if (items.length === 0) return null;
                      return (
                        <div key={quadrant.key} className="text-sm">
                          <span className="text-muted-foreground">{quadrant.label}:</span>{" "}
                          {items.map((item, i) => (
                            <span key={i} className="inline-flex items-center gap-1">
                              <span className="text-foreground">{item.title}</span>
                              <button 
                                onClick={() => handleRemoveContent(quadrant.key, i)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {i < items.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Forward Vision Section */}
          <Collapsible open={visionSectionOpen} onOpenChange={setVisionSectionOpen}>
            <div className="pt-4 border-t border-border">
              <CollapsibleTrigger className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-foreground">Your 2-Year Vision</h3>
                    <p className="text-sm text-muted-foreground">
                      Where do you see yourself based on current trends?
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${visionSectionOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Looking forward two years based on current trends in your field, tell us what you envision for your future.
                </p>
                
                {/* <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="careerOutlook" className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      Career Outlook
                    </Label>
                    <Textarea
                      id="careerOutlook"
                      value={formData.forwardVision?.careerOutlook || ""}
                      onChange={(e) => handleVisionChange("careerOutlook", e.target.value)}
                      placeholder="What will your job/role look like in 2 years? What trends are shaping your field?"
                      className="min-h-[80px] rounded-xl resize-none text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skillsToLearn" className="flex items-center gap-2 text-sm">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      Skills to Learn
                    </Label>
                    <Textarea
                      id="skillsToLearn"
                      value={formData.forwardVision?.skillsToLearn || ""}
                      onChange={(e) => handleVisionChange("skillsToLearn", e.target.value)}
                      placeholder="What new skills will you need? What are you planning to learn?"
                      className="min-h-[80px] rounded-xl resize-none text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="familyPlans" className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Family & Personal
                    </Label>
                    <Textarea
                      id="familyPlans"
                      value={formData.forwardVision?.familyPlans || ""}
                      onChange={(e) => handleVisionChange("familyPlans", e.target.value)}
                      placeholder="What are you thinking about for your family? Personal milestones?"
                      className="min-h-[80px] rounded-xl resize-none text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="curiosityAreas" className="flex items-center gap-2 text-sm">
                      <Compass className="h-4 w-4 text-muted-foreground" />
                      Curiosity & Exploration
                    </Label>
                    <Textarea
                      id="curiosityAreas"
                      value={formData.forwardVision?.curiosityAreas || ""}
                      onChange={(e) => handleVisionChange("curiosityAreas", e.target.value)}
                      placeholder="What new areas are you curious about? What do you want to explore?"
                      className="min-h-[80px] rounded-xl resize-none text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="legacyGoals" className="flex items-center gap-2 text-sm">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      Legacy & Impact
                    </Label>
                    <Textarea
                      id="legacyGoals"
                      value={formData.forwardVision?.legacyGoals || ""}
                      onChange={(e) => handleVisionChange("legacyGoals", e.target.value)}
                      placeholder="What impact do you want to make? What legacy are you building toward?"
                      className="min-h-[80px] rounded-xl resize-none text-sm"
                    />
                  </div>
                </div> */}
                {visionLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading vision questions…
                  </p>
                ) : (
                  Object.entries(visionQuestions).map(([typeTitle, questions]) => (
                    <div key={typeTitle} className="space-y-4">
                      {/* Label = vision type title */}
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {typeTitle}
                      </h4>

                      {/* Questions */}
                      {questions.map((q) => (
                        <Textarea
                          key={q.id}
                          placeholder={q.text}
                          value={visionAnswers[q.id] || ""}
                          onChange={(e) =>
                            setVisionAnswers((prev) => ({
                              ...prev,
                              [q.id]: e.target.value,
                            }))
                          }
                          className="min-h-[90px] rounded-xl resize-none"
                        />
                      ))}
                    </div>
                  ))
                )}

              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            variant="warm"
            size="xl"
            onClick={handleSubmit}
            disabled={!isValid}
            className="shadow-glow"
          >
            Discover My Footprint
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Social Sites Dialog */}
      <Dialog open={showSocialDialog} onOpenChange={setShowSocialDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">

          <DialogHeader>
            <DialogTitle>Add Your Social Sites</DialogTitle>
            <DialogDescription>
              Add up to 10 social profiles to help us build a richer picture of your digital presence.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">

            {/* Quick add suggestions */}
            <div className="flex flex-wrap gap-2">
              {SOCIAL_SITE_SUGGESTIONS.filter(s => !socialSites.find(ss => ss.name === s.name)).map((suggestion) => (
                <Button
                  key={suggestion.name}
                  variant="outline"
                  size="sm"
                  onClick={() => addSocialSite(suggestion)}
                  disabled={socialSites.length >= 10}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {suggestion.name}
                </Button>
              ))}
            </div>

            {/* Added sites */}
            {socialSites.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                {socialSites.map((site, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        {site.name}
                      </Label>
                      <Input
                        value={site.url}
                        onChange={(e) => handleSocialSiteChange(index, e.target.value)}
                        placeholder={SOCIAL_SITE_SUGGESTIONS.find(s => s.name === site.name)?.placeholder || "Enter URL"}
                        className="h-9 text-sm"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialSite(index)}
                      className="h-9 w-9 mt-5"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {socialSites.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Click a platform above to add it
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setShowSocialDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSocialSites}>
              Save Sites
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Influential Content Dialog */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="max-w-lg h-[90vh] flex flex-col">

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {QUADRANTS.find(q => q.key === activeQuadrant)?.icon && (
                (() => {
                  const Icon = QUADRANTS.find(q => q.key === activeQuadrant)!.icon;
                  return <Icon className="h-5 w-5 text-primary" />;
                })()
              )}
              {QUADRANTS.find(q => q.key === activeQuadrant)?.label} Influences
            </DialogTitle>
            <DialogDescription>
              {QUADRANTS.find(q => q.key === activeQuadrant)?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 px-2 py-4 pb-24">
            <div className="space-y-2">
              <Label>Type of Content</Label>
              <Select value={newContent.type} onValueChange={(value) => setNewContent(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Title / Name</Label>
              <Input
                value={newContent.title}
                onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., The Alchemist, Inception, Bohemian Rhapsody..."
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Why did this change your life?</Label>
              <Textarea
                value={newContent.why}
                onChange={(e) => setNewContent(prev => ({ ...prev, why: e.target.value }))}
                placeholder="How did this content influence you? What did it teach you or make you realize?"
                className="min-h-[100px] resize-none"
              />
            </div>
            
            {/* Show existing items for this quadrant */}
            {(formData.influentialContent?.[activeQuadrant]?.length || 0) > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Already added:</p>
                <div className="space-y-2">
                  {formData.influentialContent?.[activeQuadrant]?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                      <div>
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">({item.type})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveContent(activeQuadrant, index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">

            <Button variant="outline" onClick={() => {
              handleDoneContent();
              setShowContentDialog(false)
              
            }}>
              Done
            </Button>
            <Button 
              onClick={handleAddContent}
              disabled={!newContent.title.trim() || !newContent.why.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};