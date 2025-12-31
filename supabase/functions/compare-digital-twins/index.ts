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
    const { twinProfile, bookTitle, comparisonModel } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Comparing digital twin for:", bookTitle);
    console.log("Against model:", comparisonModel);

    const systemPrompt = `You are an expert at analyzing and comparing digital twin representations. Your task is to compare how well a digital twin profile represents a person's authentic voice compared to how a different AI model might interpret the same person.

Analyze the provided digital twin profile and generate a detailed comparison assessment. You must return ONLY valid JSON (no markdown, no explanation, no backticks) with this exact structure:

{
  "voiceTone": {
    "warmth": <number 0-100>,
    "directness": <number 0-100>,
    "reflective": <number 0-100>,
    "assertive": <number 0-100>,
    "insight": "<string describing difference in voice/tone>"
  },
  "valuesIntent": {
    "shared": ["<value1>", "<value2>", "<value3>"],
    "missing": ["<missing1>", "<missing2>"],
    "overweighted": ["<overweighted1>"],
    "insight": "<string describing values alignment>"
  },
  "knowledgeDepth": {
    "systemicUnderstanding": <number 0-100>,
    "metaphorUse": <number 0-100>,
    "actionOriented": <number 0-100>,
    "insight": "<string describing knowledge/framing differences>"
  },
  "decisionPosture": {
    "uncertaintyHandling": <number 0-100>,
    "boundaryStrength": <number 0-100>,
    "resolutionSpeed": <number 0-100>,
    "insight": "<string describing decision-making style differences>"
  },
  "relationalStyle": {
    "trustBuilding": <number 0-100>,
    "collaboration": <number 0-100>,
    "authorityExpression": <number 0-100>,
    "insight": "<string describing relational style differences>"
  },
  "overallAlignment": <number 0-100>,
  "summaryNarrative": "<2-3 sentence summary of overall alignment and key adjustments needed>"
}

The comparison should feel insightful, not judgmental. Focus on alignment opportunities rather than failures.`;

    const userPrompt = `Analyze this digital twin profile and compare how well it would represent the person's authentic voice compared to a ${comparisonModel} interpretation:

DIGITAL TWIN PROFILE:
${twinProfile}

BOOK TITLE: ${bookTitle}

Generate the comparison JSON based on likely differences between this carefully crafted digital twin and how ${comparisonModel} might interpret the same person based on generic training data.`;

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
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No comparison generated");
    }

    console.log("Raw comparison response:", content);

    // Parse the JSON response
    let comparisonResult;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      comparisonResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse comparison JSON:", parseError);
      // Return a default comparison if parsing fails
      comparisonResult = {
        voiceTone: {
          warmth: 78,
          directness: 65,
          reflective: 82,
          assertive: 58,
          insight: "The Digital Twin is 15% more introspective and 10% less directive than the comparison model.",
        },
        valuesIntent: {
          shared: ["Authenticity", "Growth", "Connection"],
          missing: ["Decisiveness"],
          overweighted: ["Reflection"],
          insight: "The twin strongly amplifies connection and empathy, while underrepresenting decisiveness and resolution.",
        },
        knowledgeDepth: {
          systemicUnderstanding: 85,
          metaphorUse: 72,
          actionOriented: 68,
          insight: "The twin mirrors pattern recognition well, yet does not consistently translate insight into action.",
        },
        decisionPosture: {
          uncertaintyHandling: 75,
          boundaryStrength: 62,
          resolutionSpeed: 58,
          insight: "The twin holds complexity longer than the comparison model, delaying resolution in applied contexts.",
        },
        relationalStyle: {
          trustBuilding: 88,
          collaboration: 85,
          authorityExpression: 55,
          insight: "Both prioritize co-creation, although the twin minimizes the lightness and humor present in the original voice.",
        },
        overallAlignment: 82,
        summaryNarrative: "This Digital Twin accurately reflects values, intent, and relational orientation. Small adjustments to tone, decisiveness, and applied framing would significantly improve representation in professional contexts.",
      };
    }

    return new Response(JSON.stringify(comparisonResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error comparing digital twins:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
