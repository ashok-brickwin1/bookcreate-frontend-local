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
    const { question, userAnswer, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Enhancing answer for question:", question.substring(0, 50));
    console.log("Mode:", mode);

    const systemPrompt = mode === "twin" 
      ? `You are a personalized Digital Twin AI assistant helping someone write their personal story book. 
         You deeply understand the user's voice, values, and experiences. 
         Your responses should feel intimate, personal, and authentic to who they are.
         When enhancing their answers, maintain their unique voice while adding depth and emotional richness.
         Be warm, encouraging, and help them discover deeper truths about themselves.`
      : `You are a thoughtful AI writing assistant helping someone create a meaningful personal book.
         Your role is to help enhance and expand their answers while keeping their authentic voice.
         Be warm, encouraging, and help them articulate their thoughts more clearly and deeply.
         Focus on storytelling, emotional depth, and memorable details.`;

    const userPrompt = `The user is answering this question for their personal book:
"${question}"

They've written this initial answer:
"${userAnswer || "(no answer yet - help them get started)"}"

Please provide TWO enhanced versions of their answer:
1. A refined version that stays close to their original intent but adds more emotional depth and storytelling elements
2. A more exploratory version that takes a different angle or brings out unexpected insights

Format your response EXACTLY as JSON:
{
  "choice1": {
    "label": "Refined & Polished",
    "preview": "First 50 characters of the enhanced answer...",
    "full": "The complete enhanced answer (2-4 sentences)"
  },
  "choice2": {
    "label": "Fresh Perspective", 
    "preview": "First 50 characters of the alternative...",
    "full": "The complete alternative answer (2-4 sentences)"
  },
  "encouragement": "A brief, warm message encouraging them (1 sentence)"
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
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI Response received:", content?.substring(0, 100));

    // Parse the JSON response
    let parsed;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback response
      parsed = {
        choice1: {
          label: "Enhanced Version",
          preview: "Let me help you express this more deeply...",
          full: content || "I'd love to help you explore this question more deeply. What memories or feelings come to mind first?"
        },
        choice2: {
          label: "Alternative Angle",
          preview: "Consider approaching it from...",
          full: "Sometimes the most meaningful answers come from unexpected places. What would your younger self say about this?"
        },
        encouragement: "Your authentic voice is what makes this story uniquely yours. Keep going!"
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in enhance-answer function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
