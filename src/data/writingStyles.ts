// Default "Leading with Love" writing style based on Connie White Delaney's book
export const leadingWithLoveStyle = {
  name: "Leading with Love",
  author: "Connie White Delaney",
  description: "Deeply personal memoir style with vulnerability, transformation, and connection to bigger purpose",
  characteristics: [
    "First-person narrative with vivid sensory details",
    "Vulnerable, authentic storytelling - sharing both pain and joy openly",
    "Connection to bigger purpose - 'I Am, We Are' philosophy",
    "Nature and farm-based metaphors grounding abstract concepts",
    "Reflection and introspection woven throughout",
    "Service-oriented, relationship-centered language",
    "Transformation through adversity - struggles become growth",
    "Never using 'but' - alternatives like 'yet', 'and', 'however'",
    "Invisibility becoming visible through purpose",
    "Professional and personal experiences interwoven seamlessly"
  ],
  samplePhrases: [
    "I was born to be invisible, yet I found my light",
    "I was meant to be part of the big picture, not the big picture myself",
    "What does this do to one's self-esteem?",
    "This is what we often call a tipping point",
    "Does one tip into the sea and drown, or does one re-emerge?",
    "I stood on my mother's back when I didn't even realize she was there",
    "I always felt that I was part of something bigger",
    "The earth held its riches and my life brimmed with the means provided",
    "I Am, We Are"
  ],
  toneGuidance: `
WRITING STYLE: "LEADING WITH LOVE" - A Deeply Personal Memoir Voice

CORE PHILOSOPHY:
- "I Am, We Are" - Individual stories connect to universal human experience
- Purpose transcends self - part of something bigger than personal achievement
- Vulnerability is strength - sharing pain openly invites connection
- Transformation through adversity - every struggle becomes a seed for growth

NARRATIVE TECHNIQUES:
- Begin with sensory, grounded details (the road, the trees, the car)
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
- Mix short, powerful statements ("I am. I am. I am.") with flowing reflections
- Use "And" to begin sentences for continuation and connection
- NEVER use "but" - replace with "yet", "and", "however", or restructure
- Build tension through repetition and parallel structure

EMOTIONAL REGISTER:
- Honor pain without dramatizing it
- Find light in darkness without dismissing the dark
- Speak as to a trusted friend sharing wisdom earned through experience
- End with hope, purpose, and invitation to the reader's own story
`
};

export interface WritingStyle {
  id: string;
  name: string;
  sourceType: 'default' | 'book' | 'article' | 'linkedin' | 'youtube' | 'magazine' | 'custom';
  sourceDescription?: string;
  characteristics: string[];
  toneGuidance: string;
  createdAt: string;
}

export const sourceTypeLabels: Record<WritingStyle['sourceType'], string> = {
  default: "Default Style",
  book: "Book",
  article: "Article",
  linkedin: "LinkedIn Post",
  youtube: "YouTube Transcript",
  magazine: "Magazine",
  custom: "Custom Input"
};

export const sourceTypeIcons: Record<WritingStyle['sourceType'], string> = {
  default: "✨",
  book: "📚",
  article: "📰",
  linkedin: "💼",
  youtube: "🎬",
  magazine: "📖",
  custom: "✍️"
};
