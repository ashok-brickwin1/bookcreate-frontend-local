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
    const { year, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!year) {
      throw new Error("Year is required");
    }

    console.log("Fetching era context for year:", year, "with context:", context);

    const systemPrompt = `You are a historian and cultural expert. When given a year (and optionally additional context about someone's life situation), provide a vivid, concise snapshot of what life was like during that time.

Focus on:
1. **Major World Events** - What was happening globally? Wars, political changes, economic conditions
2. **Cultural Moments** - Popular movies, music, TV shows, books that defined the era
3. **Technology & Daily Life** - What technology was new? How did people communicate, work, travel?
4. **Famous Figures** - Who was influential? Leaders, celebrities, cultural icons
5. **Social Climate** - What were people worried about? Hopeful about? Fighting for?

Keep your response engaging and personal - help someone remember or understand what it felt like to live in that time. Use specific examples rather than generalities.

Do not use the word "but" - use alternative connectors instead.`;

    const userPrompt = context 
      ? `Describe what life was like in ${year}. The person was experiencing: "${context}". Help them remember and reflect on the world around them during this pivotal moment.`
      : `Describe what life was like in ${year}. Paint a vivid picture of the era - the events, culture, technology, and social climate that shaped that time.`;

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
    const eraContext = data.choices?.[0]?.message?.content;

    if (!eraContext) {
      throw new Error("No era context generated");
    }

    console.log("Era context generated for year:", year);

    return new Response(
      JSON.stringify({ year, eraContext }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error getting era context:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
