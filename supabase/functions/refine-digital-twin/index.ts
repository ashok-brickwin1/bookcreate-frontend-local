import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Adjustment {
  id: string;
  title: string;
  description: string;
  impact: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { twinProfile, adjustments, answers, bookTitle } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Refining digital twin for:", bookTitle);
    console.log("Applying adjustments:", adjustments?.length || 0);

    const adjustmentInstructions = (adjustments as Adjustment[])
      .map((adj, i) => `${i + 1}. ${adj.title}: ${adj.description}`)
      .join("\n");

    const systemPrompt = `You are an expert at creating deeply authentic digital twin profiles. Your task is to REFINE an existing digital twin profile by applying specific adjustments while maintaining the core identity.

The refinements should:
- Preserve the essential values, experiences, and thinking patterns
- Apply the specific adjustments provided to improve alignment
- Maintain the ~2000 word narrative format
- Enhance authenticity without losing depth

Apply the adjustments naturally - don't just add disclaimers or notes about the changes. Integrate them seamlessly into the refined profile.`;

    const userPrompt = `ORIGINAL DIGITAL TWIN PROFILE:
${twinProfile}

ADJUSTMENTS TO APPLY:
${adjustmentInstructions}

ORIGINAL ANSWERS FOR CONTEXT:
${JSON.stringify(answers, null, 2)}

BOOK TITLE: ${bookTitle}

Generate a REFINED digital twin profile (~2000 words) that incorporates these adjustments while maintaining authenticity. The refined profile should feel like an improved, more accurate representation of the person.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
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
    const refinedProfile = data.choices?.[0]?.message?.content;

    if (!refinedProfile) {
      throw new Error("No refined profile generated");
    }

    console.log("Refined profile word count:", refinedProfile.split(/\s+/).length);

    return new Response(
      JSON.stringify({ 
        profile: refinedProfile,
        appliedAdjustments: adjustments?.length || 0
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error refining digital twin:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
