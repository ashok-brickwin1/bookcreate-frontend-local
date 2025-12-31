import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Legacy language guidance based on 38 million obituary study
const legacyLanguageGuidance = `
LEGACY & END-OF-LIFE LANGUAGE GUIDANCE (from obituary research):

PREFERRED LANGUAGE - What families actually use:
- Emotion & Relationships: loving, cherished, devoted, compassionate, treasured, adored, gentle
- Service & Impact: "touched many lives", "made a difference", "gave generously", "always ready to help"
- Heritage & Continuity: tradition, heritage, values passed down, family legacy, cultural roots
- Character & Resilience: courage, grace, strength, dignity, "quiet resolve", "gentle determination"

TRANSITION PHRASES - Respectful ways to discuss passing:
- "completed her journey", "found peace", "entered eternal rest", "was called home"
- "her legacy continues through", "his spirit lives on in", "what endures is"
- "lovingly remembered", "cherished memories remain", "forever in our hearts"

AVOID OR MINIMIZE:
- Status/power words: CEO, award-winning, most successful, highest-achieving
- Competition language: dominated, conquered, beat, crushed
- Superlatives focused on individual glory over connection

TONE PRINCIPLES:
- Center relationships over achievements: "devoted father" over "successful executive"
- Frame struggles as growth with grace, not defeat
- Emphasize what endures and continues, not what ends
- Write as families speak about loved ones: warm, honoring, relationship-focused
`;

// Era-specific language shifts based on historical research
const eraLanguageShifts = {
  "pre-1980": {
    description: "Traditional, formal, faith-centered",
    guidance: `Use language reflecting traditional values and formal expression:
- Strong faith-based framing: "called home to the Lord", "went to be with their Maker", "eternal reward"
- Formal titles and relationships: "Mrs. John Smith", "beloved wife and mother"
- Emphasis on duty, sacrifice, service to family and community
- Understated emotion: "quietly devoted", "steadfast in their faith"
- Gender-specific roles honored: "homemaker", "provider", "pillar of the family"`
  },
  "1980-2000": {
    description: "Achievement-oriented transitioning to personal fulfillment",
    guidance: `Balance achievement recognition with personal connection:
- Professional accomplishments mentioned with human context: "successful in business, yet always made time for family"
- Emergence of individuality language: "lived life on their own terms", "followed their passion"
- Hobby and lifestyle recognition: "avid golfer", "passionate gardener"
- Less formal, more personal: first names, nicknames accepted
- Beginning of "celebration of life" vs funeral language`
  },
  "2001-2019": {
    description: "Post-9/11 focus on meaning, community, resilience",
    guidance: `Emphasize community bonds, resilience, and deeper meaning:
- Community and belonging central: "pillar of the community", "brought people together"
- Resilience language prominent: "faced challenges with grace", "overcame adversity"
- Service to others elevated: "dedicated volunteer", "always first to help"
- Digital age awareness: "touched lives near and far", "connected across distances"
- Authentic expression valued: "lived authentically", "true to themselves"
- "Finding purpose" and "making meaning" language common`
  },
  "2020-present": {
    description: "COVID era - isolation awareness, essential connections, gratitude",
    guidance: `Reflect COVID-era insights about essential connections and gratitude:
- Heightened appreciation for presence: "cherished every moment together", "made the most of time"
- Essential relationships emphasized: "what mattered most was family", "true priorities revealed"
- Gratitude language prominent: "grateful for", "blessed by", "thankful for every day"
- Resilience through isolation: "stayed connected despite distance", "found new ways to love"
- Legacy of adaptability: "embraced change with grace", "taught us flexibility"
- Virtual connection acknowledged: "touched lives across screens", "presence felt even from afar"
- Frontline/essential worker honor: "served others selflessly", "answered the call when needed most"`
  }
};

function getEraGuidance(year?: number): string {
  if (!year) return "";
  
  let era: keyof typeof eraLanguageShifts;
  if (year < 1980) {
    era = "pre-1980";
  } else if (year < 2001) {
    era = "1980-2000";
  } else if (year < 2020) {
    era = "2001-2019";
  } else {
    era = "2020-present";
  }
  
  return `\n\nERA-SPECIFIC LANGUAGE (${eraLanguageShifts[era].description}):
${eraLanguageShifts[era].guidance}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, answer, category, lifeStage, year, customStyle } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Refining answer for:", question.substring(0, 50), "year:", year, "customStyle:", customStyle?.name || "default");

    // Determine if this is a legacy/wisdom question
    const isLegacyContext = category === "legacy" || lifeStage === "wisdom";

    // Get era-specific language guidance if year is provided
    const eraGuidance = getEraGuidance(year);

    // Use custom writing style if provided, otherwise default "Leading with Love" style
    const writingStyleGuidance = customStyle?.toneGuidance || `
WRITING STYLE: "LEADING WITH LOVE" - A Deeply Personal Memoir Voice

CORE PHILOSOPHY:
- "I Am, We Are" - Individual stories connect to universal human experience
- Purpose transcends self - part of something bigger than personal achievement
- Vulnerability is strength - sharing pain openly invites connection
- Transformation through adversity - every struggle becomes a seed for growth

NARRATIVE TECHNIQUES:
- Begin with sensory, grounded details
- Use present-tense reflection to bring readers into the moment
- Ask rhetorical questions to invite reader reflection
- Weave back and forth between past narrative and present understanding
- Ground abstract ideas in physical, tangible metaphors

VOCABULARY & TONE:
- Intimate yet universal ("I" becomes "We")
- Contemplative and measured pacing
- Farm and nature imagery: roots, seeds, planting, harvest, growth
- Faith in possibility without being preachy
- Honest about struggle without wallowing

SENTENCE STRUCTURE:
- Mix short, powerful statements with flowing reflections
- Use "And" to begin sentences for continuation and connection
- NEVER use "but" - replace with "yet", "and", "however", or restructure
- Build tension through repetition and parallel structure

EMOTIONAL REGISTER:
- Honor pain without dramatizing it
- Find light in darkness without dismissing the dark
- Speak as to a trusted friend sharing wisdom earned through experience
- End with hope, purpose, and invitation to the reader's own story
`;

    const basePrompt = `You are a skilled memoir writer and editor helping someone tell their personal story. Your job is to take their raw answer and refine it into a more polished, emotionally resonant version while keeping their authentic voice.

${writingStyleGuidance}

Key principles:
- Preserve the user's core message and intent
- Add emotional depth and storytelling elements
- Use vivid, sensory language where appropriate
- Keep the same person and perspective (first person)
- Make it feel natural, not overly polished
- NEVER use the word "but" - use alternatives like "yet", "and", "however", or restructure the sentence
- Keep the length similar to the original (within 50% longer or shorter)`;

    // Build system prompt with legacy and era guidance
    let systemPrompt = basePrompt;
    if (isLegacyContext) {
      systemPrompt += `\n\n${legacyLanguageGuidance}`;
    }
    if (eraGuidance) {
      systemPrompt += eraGuidance;
    }

    // Add life stage specific guidance
    let stageGuidance = "";
    if (lifeStage === "foundations") {
      stageGuidance = "\n\nFor FOUNDATIONS questions: Focus on formative influences, family bonds, and early values that took root. Use phrases like 'shaped by early experiences', 'the roots that grounded', 'lessons learned young that lasted a lifetime'.";
    } else if (lifeStage === "growth") {
      stageGuidance = "\n\nFor GROWTH questions: Emphasize resilience, transformation, and quiet courage. Use phrases like 'emerged through challenge', 'discovered inner strength', 'growth born from adversity'.";
    } else if (lifeStage === "mastery") {
      stageGuidance = "\n\nFor MASTERY questions: Center on contribution to others, service, and meaningful impact rather than personal achievement. Use phrases like 'made a lasting impact', 'touched the lives of many', 'gave generously of expertise and time'.";
    } else if (lifeStage === "wisdom") {
      stageGuidance = "\n\nFor WISDOM questions: Focus on continuity, what endures, and how influence ripples forward. Use phrases like 'the legacy that endures', 'what will be remembered', 'the values passed forward', 'a life that continues to inspire'.";
    }

    const userPrompt = `Question being answered: "${question}"
${category ? `Category: ${category}` : ""}
${lifeStage ? `Life Stage: ${lifeStage}` : ""}
${year ? `Year/Era context: ${year}` : ""}
${stageGuidance}

User's original answer: "${answer}"

Please refine this answer to be more compelling while keeping their authentic voice.${year ? ` Use language appropriate to how people spoke about legacy and life events during that era (around ${year}).` : ""} Return ONLY a JSON object:
{
  "refined": "The refined answer here",
  "changes": "Brief note about what you improved"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      // Return the raw content as refined if parsing fails
      parsed = {
        refined: content || answer,
        changes: "Minor improvements to flow and clarity"
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in refine-answer:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
