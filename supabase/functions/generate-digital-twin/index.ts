import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, bookTitle, model } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating digital twin for:", bookTitle);
    console.log("Using model:", model);

    // Compile all answers into context
    const answersContext = Object.entries(answers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n\n");

    // Legacy language guidance for warm, relational tone
    const legacyLanguageGuidance = `
LANGUAGE & TONE GUIDANCE (for authentic, warm representation):

When describing this person, use language that families and loved ones naturally use:
- Emotion & Relationships: loving, cherished, devoted, compassionate, treasured, gentle
- Service & Impact: "touched many lives", "made a difference", "gave generously", "always ready to help"
- Heritage & Continuity: tradition, heritage, values passed down, family legacy, cultural roots
- Character & Resilience: courage, grace, strength, dignity, "quiet resolve", "gentle determination"

SPEAKING ABOUT LEGACY:
- Use phrases like: "what endures is", "the impact that continues", "lives on through"
- Center relationships over achievements: "devoted parent" over "successful professional"
- Frame struggles as growth with grace, not defeat
- Emphasize what the person gave to others, not just what they accomplished

AVOID:
- Cold, corporate language
- Status-focused superlatives (most successful, highest-achieving)
- Competition language (dominated, crushed, beat)
- The word "but" - use alternatives like "yet", "and", "however", "while"

TONE:
- Warm and honoring, as a loved one would speak
- Relational and connected, not distant or clinical
- Humble yet confident, authentic and real
`;

    const systemPrompt = `You are an expert at creating digital twin profiles. A digital twin is an AI representation of a person that can make decisions and answer questions on their behalf.

${legacyLanguageGuidance}

Your task is to read through all the stories, memories, insights, and answers provided about this person's life, and create a comprehensive profile (~2000 words) that captures:

1. **Core Identity & Values** - Who they are at their core, what drives them, what they believe in. Speak of their values as a loved one would describe them - with warmth and genuine appreciation.

2. **Life Experiences & Wisdom** - Key moments that shaped them, lessons learned, pivotal decisions. Frame challenges as opportunities for growth, resilience, and grace.

3. **Thinking Patterns** - How they approach problems, make decisions, process information. Describe with respect for their unique perspective.

4. **Relationships & Connections** - How they relate to others, their communication style, what matters in relationships. This is central - emphasize how they made others feel, how they showed up for people.

5. **Legacy & Purpose** - Not just goals, yet what they want to leave behind, how they want to be remembered, the impact they hope to have on future generations. Use the warm legacy language guidance.

6. **Authentic Voice** - The unique traits, expressions, and characteristics that make them who they are. Capture their warmth, humor, quirks - what loved ones would recognize.

7. **Decision-Making Framework** - How they weigh options, what factors they prioritize. Emphasize their values-driven approach over purely analytical methods.

Write this profile in second person ("You are...") as if speaking directly to the digital twin, giving it all the context it needs to represent this person authentically. The digital twin should speak with the same warmth, wisdom, and relational focus that defines this person.

CRITICAL: Never use the word "but" - use alternative connectors instead.`;

    const userPrompt = `Create a digital twin profile for "${bookTitle}" based on these life stories and answers:

${answersContext}

Generate a comprehensive ~2000 word profile that captures everything the digital twin needs to know to authentically represent this person. Remember to use warm, relational language that honors their story and speaks as someone who truly knows and loves them would speak.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const profile = data.choices?.[0]?.message?.content;

    if (!profile) {
      throw new Error("No profile generated");
    }

    console.log("Digital twin profile generated, word count:", profile.split(/\s+/).length);

    return new Response(
      JSON.stringify({ profile, model }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating digital twin:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
