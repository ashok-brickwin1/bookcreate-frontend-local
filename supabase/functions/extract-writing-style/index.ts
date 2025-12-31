import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, url, sourceType, styleName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let textToAnalyze = content;

    // If URL is provided, try to fetch content (basic implementation)
    if (url && !content) {
      console.log("Fetching content from URL:", url);
      try {
        const fetchResponse = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; WritingStyleExtractor/1.0)'
          }
        });
        if (fetchResponse.ok) {
          const html = await fetchResponse.text();
          // Basic text extraction - strip HTML tags
          textToAnalyze = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 10000); // Limit to 10k chars
        }
      } catch (fetchError) {
        console.log("URL fetch failed, will analyze URL description instead");
        textToAnalyze = `Content from ${sourceType} at: ${url}. Please infer writing style characteristics typical of ${sourceType} content.`;
      }
    }

    if (!textToAnalyze || textToAnalyze.length < 50) {
      throw new Error("Not enough content to analyze. Please provide more text.");
    }

    console.log("Extracting writing style:", styleName, "from", sourceType);
    console.log("Content length:", textToAnalyze.length);

    const systemPrompt = `You are an expert literary analyst and writing coach. Your task is to analyze a piece of writing and extract its distinctive writing style characteristics.

Analyze the provided text and identify:
1. Voice and tone (formal/informal, warm/distant, authoritative/conversational)
2. Narrative techniques (first-person, sensory details, rhetorical questions, etc.)
3. Sentence structure patterns (short punchy vs flowing, use of fragments, etc.)
4. Vocabulary choices (simple/complex, technical/accessible, emotional/analytical)
5. Thematic elements (what values or philosophies shine through)
6. Unique stylistic markers (catchphrases, metaphor preferences, word avoidances)
7. Emotional register (how feelings are expressed or implied)
8. Pacing and rhythm of prose

Return a JSON object with:
{
  "characteristics": ["array of 8-12 specific, actionable style characteristics"],
  "toneGuidance": "A detailed 300-400 word guide that a writer could use to replicate this style. Include specific dos and don'ts, example phrases, and techniques."
}`;

    const userPrompt = `Analyze this ${sourceType} content called "${styleName}" and extract its writing style:

---
${textToAnalyze.substring(0, 8000)}
---

Extract the distinctive writing style characteristics that make this voice unique. The guidance should be specific enough that another writer could adopt this style.`;

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
        return new Response(JSON.stringify({ error: "Rate limits exceeded. Please try again." }), {
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
    const aiContent = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      // Fallback
      parsed = {
        characteristics: [
          "Personal, first-person narrative voice",
          "Vivid sensory details and concrete imagery",
          "Emotional honesty and vulnerability",
          "Connection between personal and universal themes",
          "Thoughtful, reflective pacing"
        ],
        toneGuidance: `Write in a warm, personal style that invites the reader into your experience. Use first-person narrative with vivid sensory details. Be emotionally honest and vulnerable. Connect personal stories to larger universal themes. Maintain a thoughtful, reflective pace. Avoid overly formal language - write as if speaking to a trusted friend.`
      };
    }

    console.log("Writing style extracted successfully");

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error extracting writing style:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});