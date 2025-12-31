/**
 * Legacy Language Guide
 * Based on analysis of 38 million American obituaries (1998-2024)
 * This language reflects how families authentically discuss loved ones,
 * emphasizing relationships, care, heritage, and character over achievement.
 */

export interface LanguageCategory {
  id: string;
  title: string;
  description: string;
  coreWords: string[];
  contextualPhrases: string[];
}

export const legacyLanguageCategories: LanguageCategory[] = [
  {
    id: "benevolence",
    title: "Benevolence & Care",
    description: "Language centered on love, devotion, and caring for others",
    coreWords: [
      "loving", "devoted", "adoring", "caring", "compassionate",
      "cherished", "treasured", "deeply loved", "selfless",
      "kind heart", "gentle spirit"
    ],
    contextualPhrases: [
      "She poured love into every part of life she touched",
      "Always there for others",
      "Gave so much of herself to others",
      "His kindness was felt by all who knew him",
      "She made everyone feel seen and valued"
    ]
  },
  {
    id: "tradition",
    title: "Tradition & Heritage",
    description: "Language reflecting continuity, ritual, and cultural grounding",
    coreWords: [
      "honored tradition", "deep faith", "cultural heritage",
      "steadfast in beliefs", "time-honored customs",
      "family values", "roots", "legacy"
    ],
    contextualPhrases: [
      "She lived by the traditions passed down through generations",
      "He found joy in the simple rhythms of home and community",
      "Her faith was the foundation of everything she did",
      "Values passed down became guiding lights",
      "The traditions will continue through those who follow"
    ]
  },
  {
    id: "loyalty",
    title: "Loyalty & Commitment",
    description: "Words around lasting bonds and enduring relationships",
    coreWords: [
      "loyal", "steadfast", "unwavering support",
      "faithful companion", "committed partner", "life partner",
      "friend to many", "trusted confidante"
    ],
    contextualPhrases: [
      "Her loyalty was a quiet but enduring force",
      "Together they weathered life's storms with courage",
      "His word was his bond",
      "A friendship that spanned decades",
      "Through every season of life, she remained true"
    ]
  },
  {
    id: "generosity",
    title: "Generosity & Service",
    description: "Language emphasizing how loved ones made life better for others",
    coreWords: [
      "service", "giving", "generous",
      "touched many lives", "always ready to help",
      "made a difference", "never hesitated to give"
    ],
    contextualPhrases: [
      "She gave generously of her time and spirit",
      "He made his community kinder just by being part of it",
      "Her door was always open",
      "He found purpose in serving others",
      "The lives she touched continue to bloom"
    ]
  },
  {
    id: "resilience",
    title: "Resilience & Grace",
    description: "How people met life's challenges with dignity",
    coreWords: [
      "courageous", "strong spirit", "grace under pressure",
      "quiet resilience", "dignity", "gentle resolve",
      "strength", "perseverance"
    ],
    contextualPhrases: [
      "Her strength inspired all who knew her",
      "He met life's trials with a gentle resolve",
      "She faced each challenge with grace",
      "Even in difficulty, his spirit remained unbroken",
      "She taught us that courage comes in quiet forms"
    ]
  }
];

// Phrases for transitioning/passing - respectful, gentle language
export const transitionPhrases = {
  passing: [
    "passed peacefully",
    "completed her journey",
    "entered eternal rest",
    "was called home",
    "departed this life",
    "left this world",
    "crossed over",
    "found peace"
  ],
  continuity: [
    "her legacy continues through",
    "his spirit lives on in",
    "she will be remembered for",
    "the impact remains",
    "what endures is",
    "carrying forward",
    "her influence reaches beyond",
    "he left behind a world better than he found it"
  ],
  memory: [
    "will be deeply missed",
    "forever in our hearts",
    "lovingly remembered",
    "her memory is a blessing",
    "we hold close the memories",
    "the stories we carry",
    "remembered with love",
    "cherished memories remain"
  ]
};

// Era-specific language shifts (for historical context)
export const eraLanguageShifts = {
  "pre-2001": {
    emphasis: ["individual achievement", "career milestones", "personal success"],
    tone: "More focused on individual accomplishments"
  },
  "post-9/11": {
    emphasis: ["community", "service", "loyalty", "togetherness", "resilience"],
    tone: "Shift toward collective values and service to others",
    increased: ["community", "service", "loyalty"],
    decreased: ["security", "survival"]
  },
  "covid-era": {
    emphasis: ["connection despite distance", "cherished moments", "family bonds"],
    tone: "Heightened appreciation for presence and togetherness",
    notes: "Benevolence language initially declined due to social disruption, then tradition language rose as communities adapted"
  },
  "post-2022": {
    emphasis: ["legacy", "meaning", "authentic connection", "values"],
    tone: "Return to relationship-centered language with added emphasis on legacy and meaning"
  }
};

// Words to emphasize (what families actually use)
export const preferredWords = {
  emotion: ["love", "loving", "cherished", "adored", "treasured", "devoted", "compassionate", "caring", "gentle"],
  community: ["service", "giving", "generosity", "touched lives", "made a difference", "helped others", "kind presence"],
  heritage: ["tradition", "heritage", "cultural roots", "values passed down", "family legacy"],
  character: ["courage", "grace", "strength", "dignity", "calm resolve", "quiet determination"]
};

// Words to use sparingly (less common in authentic obituary language)
export const wordsToMinimize = [
  "CEO", "highest-earning", "award-winning",
  "dominated", "conquered", "crushed the competition",
  "best ever", "most successful", "top performer",
  "power", "status", "prestige"
];

// Sentence templates for legacy reflections
export const legacyTemplates = [
  "She was known for [character trait] and [impact on others]",
  "He lived a life marked by [value] and [relationship quality]",
  "Their presence in the community [lasting effect]",
  "Her legacy continues through [how it lives on]",
  "What he taught us about [lesson] remains [enduring quality]",
  "The [tradition/value] she instilled in her family [how it continues]",
  "His quiet [character trait] spoke louder than [contrast]",
  "She showed us that [life lesson] through [how she lived]"
];

// Helper to get appropriate language for a life stage
export function getLanguageForLifeStage(stage: "foundations" | "growth" | "mastery" | "wisdom"): {
  suggestedPhrases: string[];
  toneGuidance: string;
} {
  switch (stage) {
    case "foundations":
      return {
        suggestedPhrases: [
          "shaped by early experiences",
          "the roots that grounded",
          "foundations laid by family",
          "lessons learned young that lasted a lifetime"
        ],
        toneGuidance: "Focus on formative influences, family bonds, and early values that took root"
      };
    case "growth":
      return {
        suggestedPhrases: [
          "emerged through challenge",
          "discovered inner strength",
          "the turning point came when",
          "growth born from adversity"
        ],
        toneGuidance: "Emphasize resilience, transformation, and the quiet courage of change"
      };
    case "mastery":
      return {
        suggestedPhrases: [
          "made a lasting impact",
          "touched the lives of many",
          "gave generously of expertise and time",
          "built something that mattered"
        ],
        toneGuidance: "Center on contribution to others, service, and meaningful impact rather than personal achievement"
      };
    case "wisdom":
      return {
        suggestedPhrases: [
          "the legacy that endures",
          "what will be remembered",
          "the values passed forward",
          "a life that continues to inspire"
        ],
        toneGuidance: "Focus on continuity, what endures, and how the person's influence ripples forward through others"
      };
  }
}

// System prompt enhancement for legacy-focused AI generation
export const legacySystemPromptAddition = `
When discussing legacy, end-of-life reflections, or life stories:

LANGUAGE TO EMBRACE:
- Center relationships over achievements: "devoted mother" over "successful executive"
- Use warm, relational language: loving, cherished, devoted, caring, compassionate
- Emphasize service and impact on others: "touched many lives", "made a difference"
- Honor resilience with grace: "met challenges with quiet strength", "faced adversity with dignity"
- Connect to continuity: "legacy lives on", "values passed down", "traditions carried forward"

LANGUAGE TO MINIMIZE:
- Status and power words: CEO, award-winning, most successful
- Competition language: dominated, conquered, beat
- Superlatives focused on individual glory

TONE GUIDANCE:
- Write as families speak about loved ones: warm, honoring, relationship-focused
- Acknowledge struggle with grace, not defeat
- Frame endings as transitions, completions, or new beginnings
- Emphasize what endures rather than what ends

TRANSITION LANGUAGE:
- Use gentle phrases: "completed her journey", "found peace", "entered eternal rest"
- Focus on continuity: "her spirit lives on", "the impact remains", "carrying forward"
- Honor memory: "lovingly remembered", "cherished memories remain"
`;
