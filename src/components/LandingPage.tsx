import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { ArrowRight, BookOpen, Sparkles, Shield, Search, MessageSquare, FileText, CheckCircle2, Brain, Zap, Users, Network, Printer, Globe, Pen, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-digital-twin.png";

import InteractiveDemo from "./InteractiveDemo";

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage = ({ onStart }: LandingPageProps) => {
  const hasBook = localStorage.getItem("hasBook") === "true";

  return (
    <div className="min-h-screen">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-medium">ECwriter</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
  variant="hero"
  size="sm"
  onClick={() => {
    localStorage.setItem("newjourney", hasBook ? "false" : "true");
    onStart();
  }}
>
  {hasBook ? "Resume Your Story" : "Begin Your Journey"}
</Button>

              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen gradient-hero flex items-center pt-16">
        <div className="container max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 backdrop-blur-sm mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Digital Footprint → Personal Narrative → Life Book</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-medium text-foreground leading-tight mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Your Life Story,{" "}
              <span className="bg-gradient-to-r from-primary via-[hsl(320,50%,55%)] to-accent bg-clip-text text-transparent">
                The Path to Safe AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
              In a world of AI, the person who got you here today is the one who will keep you safe tomorrow. 
              Your digital twin is grounded in <span className="text-foreground font-medium">your story</span>, <span className="text-foreground font-medium">your truth</span>, <span className="text-foreground font-medium">your trust</span>, <span className="text-foreground font-medium">your network</span>—so every decision reflects who you really are.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl"  onClick={() => {
    localStorage.setItem("newjourney", "true");
    onStart();
  }}className="group">
                Begin Your Journey
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="hero-outline" size="xl" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </div>

            {/* Hero Image */}
            <div className="mt-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                <img 
                  src={heroImage} 
                  alt="Open book with a glowing digital twin rising from its pages, representing your story as the foundation of AI-assisted decision making" 
                  className="w-full rounded-3xl shadow-elevated"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* 4-Stage Process Section */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-4">
              Four Stages to Your Digital Twin
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From digital research to a published memoir—and a personal AI that thinks like you do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {stages.map((stage, index) => (
              <div
                key={stage.title}
                className="relative group"
              >
                <div className="glass-card rounded-3xl p-8 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      stage.bgColor
                    )}>
                      <stage.icon className={cn("h-7 w-7", stage.iconColor)} />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-display font-medium text-primary">{index + 1}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-medium text-foreground mb-3">
                    {stage.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {stage.description}
                  </p>
                  <ul className="space-y-2">
                    {stage.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Interactive Walkthrough</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-4">
              Experience the Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Click through each stage to see how your story transforms into a powerful digital twin.
            </p>
          </div>
          
          <InteractiveDemo onStart={onStart} />
        </div>
      </section>

      {/* AI Safety Through Story Section */}
      <section className="py-24 gradient-hero">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Your Safety Net in AI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground mb-6">
              Your Story Keeps{" "}
              <span className="bg-gradient-to-r from-primary via-[hsl(320,50%,55%)] to-accent bg-clip-text text-transparent">
                AI Safe for Everyone
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              In a world where AI makes more decisions every day, the wisdom, values, and experiences 
              that brought you here today become the foundation that keeps your AI decisions authentic—and keeps you safe in the future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {safetyPillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
              >
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4",
                  pillar.bgColor
                )}>
                  <pillar.icon className={cn("h-7 w-7", pillar.iconColor)} />
                </div>
                <h3 className="text-lg font-display font-medium text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-elevated">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-4">
                  Why Your Story Matters for AI Safety
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Generic AI doesn't know you. It can't distinguish between what aligns with your values 
                  and what contradicts everything you stand for. Your digital twin, grounded in your authentic life story, 
                  ensures every AI interaction reflects who you truly are.
                </p>
                <ul className="space-y-3">
                  {safetyBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-glow">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-lg text-foreground font-medium mb-2">
                      "The book is your safety net in the AI world."
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your lived experience, truth, and trusted relationships remain the foundation 
                      for all AI-assisted decisions—now and in the future.
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent opacity-20 blur-2xl animate-float" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Twin Value Section */}
      <section className="py-24 gradient-hero overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">The Heart of Your Digital Twin</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground mb-6">
              Your Story Powers{" "}
              <span className="bg-gradient-to-r from-primary via-[hsl(320,50%,55%)] to-accent bg-clip-text text-transparent">
                Your AI Influence
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your life book creates a digital twin grounded in what matters most: <span className="text-foreground font-medium">your story</span>, <span className="text-foreground font-medium">your truth</span>, <span className="text-foreground font-medium">your trust</span>, <span className="text-foreground font-medium">your network</span>. 
              It makes decisions the way you would—keeping you safe and authentic in every AI interaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {digitalTwinFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4",
                  feature.bgColor
                )}>
                  <feature.icon className={cn("h-7 w-7", feature.iconColor)} />
                </div>
                <h3 className="text-lg font-display font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Agentic Network Visualization */}
          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-elevated">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-4">
                  Build Your Agentic Network
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Your digital twin doesn't work alone. It connects to an expanding network of AI agents—
                  each trained to handle specific tasks while staying true to your values and preferences.
                </p>
                <ul className="space-y-3">
                  {agenticBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square relative">
                  {/* Central node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow z-10">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  {/* Orbiting nodes */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <div
                      key={angle}
                      className="absolute h-12 w-12 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-soft"
                      style={{
                        top: `${50 + 35 * Math.sin((angle * Math.PI) / 180)}%`,
                        left: `${50 + 35 * Math.cos((angle * Math.PI) / 180)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                  ))}
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <line
                        key={angle}
                        x1="50%"
                        y1="50%"
                        x2={`${50 + 35 * Math.cos((angle * Math.PI) / 180)}%`}
                        y2={`${50 + 35 * Math.sin((angle * Math.PI) / 180)}%`}
                        stroke="hsl(var(--primary))"
                        strokeWidth="1"
                        strokeOpacity="0.3"
                        strokeDasharray="4 4"
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Validation Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-6">
                "Is This What You Mean?"
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Every response you give is refined by AI and presented back to you for validation. 
                This creates accuracy, emotional authenticity, and ensures your voice shines through.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/60 backdrop-blur-sm">
                  <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Speak or Type</h4>
                    <p className="text-sm text-muted-foreground">
                      Share your story naturally—voice creates the most authentic narrative
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/60 backdrop-blur-sm">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">AI Refinement</h4>
                    <p className="text-sm text-muted-foreground">
                      Our AI enhances clarity while preserving your authentic voice
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass-card rounded-3xl p-8 shadow-elevated">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse-soft" />
                  <span className="text-sm text-muted-foreground">Validation Loop Active</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-secondary">
                    <p className="text-sm text-muted-foreground mb-2">Your answer:</p>
                    <p className="text-foreground text-sm">"I guess the biggest thing was when I finally quit my job to start the company..."</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <p className="text-sm text-primary mb-2">AI Refined Version:</p>
                    <p className="text-foreground text-sm leading-relaxed">
                      "The pivotal moment came when I chose to leave the security of my corporate role 
                      to pursue the entrepreneurial vision that had been calling me for years..."
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Is this what you meant?
                  </Button>
                </div>
              </div>
              
              {/* Floating decoration */}
              <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-coral-light opacity-20 blur-2xl animate-float" />
            </div>
          </div>
        </div>
      </section>

      {/* Publishing & Distribution Section */}
      <section className="py-24 gradient-hero">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Publish Your Way</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground mb-6">
              From Story to{" "}
              <span className="bg-gradient-to-r from-primary via-[hsl(320,50%,55%)] to-accent bg-clip-text text-transparent">
                Published Book
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your memoir deserves to be shared. Export in any format, distribute to major retailers, 
              or create professional print-ready files for bookstores worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {publishingFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
              >
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4",
                  feature.bgColor
                )}>
                  <feature.icon className={cn("h-7 w-7", feature.iconColor)} />
                </div>
                <h3 className="text-lg font-display font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-elevated">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-4">
                  Professional Print-Ready PDFs
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Generate industry-standard print files with proper bleed margins, trim marks, 
                  and automatic spine width calculation based on your page count. 
                  Ready for any print-on-demand service.
                </p>
                <ul className="space-y-3">
                  {printFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="glass-card rounded-2xl p-6 shadow-soft">
                  <div className="text-center mb-4">
                    <Printer className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h4 className="font-display font-medium text-foreground">Print Specifications</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Trim Size</span>
                      <span className="text-sm font-medium text-foreground">6" × 9"</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Bleed</span>
                      <span className="text-sm font-medium text-foreground">3mm</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Spine Width</span>
                      <span className="text-sm font-medium text-foreground">Auto-calculated</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Crop Marks</span>
                      <span className="text-sm font-medium text-foreground">Included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-24 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-8"
              >
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
                  feature.bgColor
                )}>
                  <feature.icon className={cn("h-8 w-8", feature.iconColor)} />
                </div>
                <h3 className="text-xl font-display font-medium text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-6">
            Your Story Keeps You Safe
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Your story is your safety net in the AI world. The wisdom, values, and experiences that brought you here today 
            become the foundation that keeps your AI decisions authentic—and keeps you safe in the future. 
            <span className="block mt-2 text-foreground font-medium">Grounded in your story. Your truth. Your trust. Your network.</span>
          </p>
          <Button variant="warm" size="xl" onClick={onStart} className="shadow-glow">
            Start Your Journey
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-display font-medium">ECwriter</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-Generated Life Books grounded in both truth and meaning
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Safe & Secure AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const stages = [
  {
    icon: Search,
    title: "Digital Footprint",
    description: "We research your public presence—LinkedIn, articles, social profiles—to create a factual foundation for your story.",
    bgColor: "bg-coral-glow",
    iconColor: "text-primary",
    features: [
      "Automated research across public sources",
      "Chapter-level authenticity scores",
      "Review and approve findings",
    ],
  },
  {
    icon: MessageSquare,
    title: "Personal Narrative",
    description: "Answer guided questions across four life domains. Upload your writing style from books, articles, or YouTube to match your unique voice.",
    bgColor: "bg-sky-light/50",
    iconColor: "text-accent",
    features: [
      "Custom writing style extraction",
      "Voice-first authentic storytelling",
      "Real-time AI validation loop",
    ],
  },
  {
    icon: FileText,
    title: "Publish Everywhere",
    description: "Export your book as PDF or EPUB, generate print-ready files with bleed marks, or publish to Amazon, Barnes & Noble, and 40+ retailers.",
    bgColor: "bg-lavender/50",
    iconColor: "text-lavender",
    features: [
      "PDF, EPUB & print-ready exports",
      "Distribute to major booksellers",
      "Print-on-demand integration",
    ],
  },
  {
    icon: Brain,
    title: "Your Digital Twin",
    description: "Your life story reveals how you think—the challenges you faced, the decisions that got you safely to today. Your twin captures these thinking patterns to answer questions the way you would.",
    bgColor: "bg-coral-glow",
    iconColor: "text-primary",
    features: [
      "Thinking patterns from your journey",
      "Personal safe AI decisions",
      "Compare & refine your twin",
      "Generate content that fits your voice",
    ],
  },
];

const digitalTwinFeatures = [
  {
    icon: Brain,
    title: "Knows Your Values",
    description: "Your twin understands what matters to you—your principles, priorities, and non-negotiables.",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Pen,
    title: "Your Writing Style",
    description: "Upload books, articles, or content to capture your unique voice and tone.",
    bgColor: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Users,
    title: "Compare & Refine",
    description: "See how your twin compares to other AI models and refine until it's truly you.",
    bgColor: "bg-lavender/20",
    iconColor: "text-lavender",
  },
  {
    icon: Network,
    title: "Grows Your Influence",
    description: "Extend your reach across AI networks while staying true to who you are.",
    bgColor: "bg-coral-glow",
    iconColor: "text-primary",
  },
];

const agenticBenefits = [
  "Make trusted decisions aligned with your values—even when you're not available",
  "Connect to specialized AI agents for email, scheduling, research, and more",
  "Maintain consistency across all your AI interactions",
  "Scale your influence without losing your authentic voice",
  "Choose which LLM powers your twin—Gemini, GPT-5, or others",
];

const publishingFeatures = [
  {
    icon: FileText,
    title: "PDF & EPUB Export",
    description: "Download your book in standard formats for reading, sharing, or selling.",
    bgColor: "bg-red-500/10",
    iconColor: "text-red-500",
  },
  {
    icon: Printer,
    title: "Print-Ready Files",
    description: "Professional PDFs with bleed, trim marks, and cover spreads for POD.",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Globe,
    title: "Major Retailers",
    description: "Distribute to Amazon, Barnes & Noble, Apple Books, and 40+ stores.",
    bgColor: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: BookMarked,
    title: "Print-on-Demand",
    description: "Partner with Lulu, Blurb, IngramSpark, or KDP for physical copies.",
    bgColor: "bg-lavender/20",
    iconColor: "text-lavender",
  },
];

const printFeatures = [
  "3mm bleed margins for professional trimming",
  "Crop marks and registration marks included",
  "Automatic spine width based on page count",
  "Full cover spread (front + spine + back)",
  "Compatible with Lulu, Blurb, IngramSpark, and KDP Print",
];

const safetyPillars = [
  {
    icon: BookOpen,
    title: "Your Story",
    description: "The experiences, decisions, and wisdom that shaped who you are become the foundation of your digital twin.",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: CheckCircle2,
    title: "Your Truth",
    description: "Authentic narratives from your own voice ensure AI decisions reflect your real values, not assumptions.",
    bgColor: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Shield,
    title: "Your Trust",
    description: "Control what information powers your twin. Review, approve, and manage access to your data.",
    bgColor: "bg-lavender/20",
    iconColor: "text-lavender",
  },
  {
    icon: Network,
    title: "Your Network",
    description: "Connect to an agentic network that extends your influence while staying grounded in who you are.",
    bgColor: "bg-coral-glow",
    iconColor: "text-primary",
  },
];

const safetyBenefits = [
  "AI decisions aligned with your values—not generic responses",
  "Protection from AI that contradicts your principles",
  "Full control over what information your twin can access",
  "Transparency into how decisions are made on your behalf",
  "A foundation that grows with you as your story evolves",
];

const trustFeatures = [
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your story stays yours. Control what's included, redact sensitive details, and manage AI access to your data.",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: CheckCircle2,
    title: "Authenticity Verified",
    description: "Transparency into how each chapter is constructed. See what's from research and what's from your narrative.",
    bgColor: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Sparkles,
    title: "Your Voice, Enhanced",
    description: "AI refines without replacing. Every suggestion is validated by you, ensuring your authentic voice shines through.",
    bgColor: "bg-lavender/20",
    iconColor: "text-lavender",
  },
];
