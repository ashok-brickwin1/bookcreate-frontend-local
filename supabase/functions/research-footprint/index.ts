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
    const { basicInfo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Researching footprint for:", basicInfo.fullName);

    const systemPrompt = `You are an expert researcher and biographer. Your task is to create a digital footprint profile based on information provided about a person. Be creative yet plausible - create a compelling narrative foundation that feels authentic.

If limited information is available, use the person's name, role, and bio to infer likely background, achievements, and insights. Be encouraging and positive in tone.`;

    const userPrompt = `Create a digital footprint profile for this person:

Name: ${basicInfo.fullName}
Email: ${basicInfo.email}
Role: ${basicInfo.role || "Not specified"}
Bio: ${basicInfo.bio || "Not provided"}
LinkedIn: ${basicInfo.linkedin || "Not provided"}
Twitter: ${basicInfo.twitter || "Not provided"}
Website: ${basicInfo.website || "Not provided"}

Based on this information, create a compelling profile. Return ONLY valid JSON in this exact format:
{
  "biography": "A 2-3 sentence biography synthesizing who this person is",
  "career": "A 2-3 sentence summary of their likely career journey based on their role",
  "achievements": "1-2 sentences about likely achievements or notable work",
  "publicStatements": "A sentence about their voice or perspective (can be inferred from role/bio)",
  "insights": "A compelling 1-2 sentence insight about their story potential",
  "authenticityScore": [number between 30-70 based on info provided],
  "chapters": [
    {"title": "Origins", "summary": "Brief summary for this chapter", "dataStrength": "weak"},
    {"title": "Professional Journey", "summary": "Brief summary", "dataStrength": "moderate"},
    {"title": "Growth & Discovery", "summary": "Brief summary", "dataStrength": "weak"},
    {"title": "Legacy & Impact", "summary": "Brief summary", "dataStrength": "weak"}
  ]
}

For dataStrength, use:
- "strong" if the person provided relevant info
- "moderate" if we can infer from role/bio
- "weak" if we'll need their personal input`;

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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI Response received");

    // Parse JSON from response
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      // Fallback response
      parsed = {
        biography: `${basicInfo.fullName} brings a unique perspective to their work as ${basicInfo.role || "a professional"}.`,
        career: basicInfo.role ? `Currently excelling as ${basicInfo.role}, with a journey marked by growth and learning.` : "A career path full of potential waiting to be explored.",
        achievements: "Achievements will be uncovered through your personal narrative.",
        publicStatements: "Your authentic voice will shape this story.",
        insights: "A story of purpose and potential, ready to be told.",
        authenticityScore: 40,
        chapters: [
          { title: "Origins", summary: "Where your journey began", dataStrength: "weak" },
          { title: "Professional Journey", summary: "Your career path", dataStrength: "moderate" },
          { title: "Growth & Discovery", summary: "What drives you forward", dataStrength: "weak" },
          { title: "Legacy & Impact", summary: "The mark you want to leave", dataStrength: "weak" },
        ]
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in research-footprint:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
