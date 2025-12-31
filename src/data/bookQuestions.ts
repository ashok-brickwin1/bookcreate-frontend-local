export interface Question {
  id: string;
  category: "personal" | "professional" | "curiosity" | "legacy";
  subSection: string;
  lifeStage: "foundations" | "growth" | "mastery" | "wisdom";
  title: string;
  prompt: string;
  helpText?: string;
  contextPrompt?: string; // For era context - when was this? What was happening in your life?
}

export interface Category {
  id: "personal" | "professional" | "curiosity" | "legacy";
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

export interface LifeStage {
  id: "foundations" | "growth" | "mastery" | "wisdom";
  title: string;
  description: string;
  ageRange: string;
}

export const lifeStages: LifeStage[] = [
  {
    id: "foundations",
    title: "Foundations",
    description: "Early experiences that shaped your core identity",
    ageRange: "Early years",
  },
  {
    id: "growth",
    title: "Growth & Change",
    description: "Transitional periods where your thinking evolved",
    ageRange: "Emerging independence",
  },
  {
    id: "mastery",
    title: "Mastery & Impact",
    description: "Peak performance and major contributions",
    ageRange: "Prime years",
  },
  {
    id: "wisdom",
    title: "Wisdom & Reflection",
    description: "Lessons learned and legacy building",
    ageRange: "Reflection years",
  },
];

export const categories: Category[] = [
  {
    id: "personal",
    title: "Personal",
    subtitle: "Identity, Emotions & Relationships",
    description: "How you see yourself, handle emotions, key relationships, and personal values that shaped you.",
    icon: "🌱",
    color: "coral",
  },
  {
    id: "professional",
    title: "Professional",
    subtitle: "Career, Decisions & Leadership",
    description: "How you make decisions, your career journey, leadership style, and expertise.",
    icon: "💼",
    color: "sky",
  },
  {
    id: "curiosity",
    title: "Curiosity & Growth",
    subtitle: "How You Think, Teach & Predict",
    description: "How you process information, spot trends, and explain ideas to others.",
    icon: "✨",
    color: "lavender",
  },
  {
    id: "legacy",
    title: "Legacy",
    subtitle: "Impact, Purpose & What You Leave Behind",
    description: "How you define a meaningful life, the lessons you pass down, and the mark you want to leave.",
    icon: "🌟",
    color: "coral",
  },
];

export const questions: Question[] = [
  // ==========================================
  // PERSONAL: Identity, Emotions, Relationships & Self-Beliefs
  // ==========================================
  
  // Foundations of Self
  {
    id: "personal-earliest-understanding",
    category: "personal",
    subSection: "Foundations of Self",
    lifeStage: "foundations",
    title: "First Self-Discovery",
    prompt: "What's your earliest memory of truly understanding something about yourself?",
    helpText: "Where were you? What triggered it?",
    contextPrompt: "What year was this? What was happening in the world at that time?",
  },
  {
    id: "personal-influential-people",
    category: "personal",
    subSection: "Foundations of Self",
    lifeStage: "foundations",
    title: "Early Influences",
    prompt: "Who were the most influential people in your early life?",
    helpText: "Parents, teachers, mentors—what did they teach you?",
    contextPrompt: "What era was this? What values were common in your community then?",
  },
  {
    id: "personal-shaping-stories",
    category: "personal",
    subSection: "Foundations of Self",
    lifeStage: "foundations",
    title: "Stories That Shaped You",
    prompt: "What books, movies, or stories shaped your worldview?",
    helpText: "What did they make you believe about life?",
    contextPrompt: "What was popular culture like when you discovered these?",
  },
  {
    id: "personal-defining-setback",
    category: "personal",
    subSection: "Foundations of Self",
    lifeStage: "foundations",
    title: "Defining Challenge",
    prompt: "What was a defining challenge or setback, and how did it shape your confidence, fears, or future choices?",
    helpText: "The moment that tested you and what you learned from it.",
    contextPrompt: "What was your life situation at this time? What support did you have?",
  },

  // Growth & Change
  {
    id: "personal-first-realization",
    category: "personal",
    subSection: "Growth & Change",
    lifeStage: "growth",
    title: "First Big Realization",
    prompt: "What was your first big realization about yourself as you gained independence?",
    helpText: "How did it change your decisions?",
    contextPrompt: "What age were you? What was happening in your life at that time?",
  },
  {
    id: "personal-struggle-shaped",
    category: "personal",
    subSection: "Growth & Change",
    lifeStage: "growth",
    title: "Struggle That Shaped You",
    prompt: "What personal struggle or moment of pain shaped who you became?",
    helpText: "What did you learn from this difficult time?",
    contextPrompt: "What was going on in the world during this period? Any major events that added context?",
  },
  {
    id: "personal-transitional-influences",
    category: "personal",
    subSection: "Growth & Change",
    lifeStage: "growth",
    title: "Transitional Influences",
    prompt: "Who influenced your thinking most during key transitional periods?",
    helpText: "Friends, family, books, experiences?",
    contextPrompt: "What was changing in your life during these transitions?",
  },
  {
    id: "personal-mistake-lesson",
    category: "personal",
    subSection: "Growth & Change",
    lifeStage: "growth",
    title: "Mistake That Taught",
    prompt: "What mistake in your personal life taught you a lesson you still carry today?",
    helpText: "The error that became wisdom.",
    contextPrompt: "Looking back, what factors contributed to that mistake?",
  },

  // Evolving Priorities
  {
    id: "personal-rethink-priorities",
    category: "personal",
    subSection: "Evolving Priorities",
    lifeStage: "mastery",
    title: "Rethinking Priorities",
    prompt: "What moment made you rethink your priorities in life?",
    helpText: "Did something change in your relationships, health, or happiness?",
    contextPrompt: "What was happening in your career and personal life at this point?",
  },
  {
    id: "personal-emotional-challenge",
    category: "personal",
    subSection: "Evolving Priorities",
    lifeStage: "mastery",
    title: "Emotional Challenge",
    prompt: "What was the biggest emotional challenge you had to overcome?",
    helpText: "How did you manage it?",
    contextPrompt: "What resources or support systems helped you through this?",
  },
  {
    id: "personal-philosophy-shift",
    category: "personal",
    subSection: "Evolving Priorities",
    lifeStage: "mastery",
    title: "Philosophy Shift",
    prompt: "What book, mentor, or philosophy shifted your thinking during a major transition?",
    helpText: "The ideas that changed everything.",
    contextPrompt: "What were you seeking when you found this new perspective?",
  },

  // Reflection & Wisdom
  {
    id: "personal-lesson-others",
    category: "personal",
    subSection: "Reflection & Wisdom",
    lifeStage: "wisdom",
    title: "Lesson for Others",
    prompt: "What personal lesson do you wish more people understood?",
    helpText: "Why is this lesson so important?",
    contextPrompt: "How did you come to understand this truth?",
  },
  {
    id: "personal-truly-matters",
    category: "personal",
    subSection: "Reflection & Wisdom",
    lifeStage: "wisdom",
    title: "What Truly Matters",
    prompt: "What moment made you realize what truly matters in life?",
    helpText: "The clarity that came from experience.",
    contextPrompt: "What had you been prioritizing before this realization?",
  },
  {
    id: "personal-wisdom-younger-self",
    category: "personal",
    subSection: "Reflection & Wisdom",
    lifeStage: "wisdom",
    title: "Wisdom to Younger Self",
    prompt: "If you could pass one piece of wisdom to your younger self, what would it be?",
    helpText: "The advice that would have changed everything.",
    contextPrompt: "At what age would this advice have made the biggest difference?",
  },

  // ==========================================
  // PROFESSIONAL: Career, Decision-Making & Leadership
  // ==========================================

  // Early Career & First Decisions
  {
    id: "prof-first-career-choice",
    category: "professional",
    subSection: "Early Career & First Decisions",
    lifeStage: "foundations",
    title: "First Career Choice",
    prompt: "How did you choose your first job or career path?",
    helpText: "What were you thinking at the time?",
    contextPrompt: "What was the job market like then? What options did you have?",
  },
  {
    id: "prof-first-failure",
    category: "professional",
    subSection: "Early Career & First Decisions",
    lifeStage: "foundations",
    title: "First Professional Failure",
    prompt: "What was your first professional failure, and what did you learn?",
    helpText: "The setback that became a stepping stone.",
    contextPrompt: "What year was this? How did you recover?",
  },
  {
    id: "prof-early-mentor",
    category: "professional",
    subSection: "Early Career & First Decisions",
    lifeStage: "foundations",
    title: "Early Career Mentor",
    prompt: "Who was the most important mentor in your early career, and why?",
    helpText: "The person who believed in you.",
    contextPrompt: "How did you meet this person? What was the context?",
  },
  {
    id: "prof-influential-book",
    category: "professional",
    subSection: "Early Career & First Decisions",
    lifeStage: "foundations",
    title: "Book That Influenced Work",
    prompt: "What book most influenced your approach to work and success?",
    helpText: "The ideas that shaped your professional philosophy.",
    contextPrompt: "When did you read this? What was happening in your career at that time?",
  },

  // Professional Growth & Leadership
  {
    id: "prof-major-risk",
    category: "professional",
    subSection: "Professional Growth & Leadership",
    lifeStage: "growth",
    title: "Major Career Risk",
    prompt: "What major career risk or pivot did you take?",
    helpText: "How did it shape your path?",
    contextPrompt: "What gave you the courage to take this risk? What was at stake?",
  },
  {
    id: "prof-leadership-challenge",
    category: "professional",
    subSection: "Professional Growth & Leadership",
    lifeStage: "growth",
    title: "Leadership Challenge",
    prompt: "What's a leadership challenge you faced, and how did you handle it?",
    helpText: "The moment that tested your leadership.",
    contextPrompt: "What were the circumstances? Who was affected?",
  },
  {
    id: "prof-skill-shift",
    category: "professional",
    subSection: "Professional Growth & Leadership",
    lifeStage: "growth",
    title: "Skill or Mindset Shift",
    prompt: "What professional skill or mindset shift made the biggest difference in your success?",
    helpText: "The change that unlocked new possibilities.",
    contextPrompt: "What prompted this shift? How long did it take to develop?",
  },
  {
    id: "prof-leadership-influence",
    category: "professional",
    subSection: "Professional Growth & Leadership",
    lifeStage: "growth",
    title: "Leadership Influences",
    prompt: "Who influenced how you lead, think, or manage people?",
    helpText: "A boss, mentor, book?",
    contextPrompt: "What specific situation made their influence clear to you?",
  },

  // Mastery & Industry Impact
  {
    id: "prof-best-decision",
    category: "professional",
    subSection: "Mastery & Industry Impact",
    lifeStage: "mastery",
    title: "Best Career Decision",
    prompt: "What's the best career decision you ever made?",
    helpText: "What made it the right one?",
    contextPrompt: "What alternatives did you consider? What made you choose this path?",
  },
  {
    id: "prof-leadership-lesson",
    category: "professional",
    subSection: "Mastery & Industry Impact",
    lifeStage: "mastery",
    title: "Leadership Lesson to Pass Down",
    prompt: "What's a lesson about work or leadership you want to pass down?",
    helpText: "The wisdom earned through experience.",
    contextPrompt: "How did you learn this lesson? Through success or failure?",
  },
  {
    id: "prof-hardest-lesson",
    category: "professional",
    subSection: "Mastery & Industry Impact",
    lifeStage: "mastery",
    title: "Hardest Business Lesson",
    prompt: "What was the hardest business lesson you learned later in your career?",
    helpText: "The truth that took time to understand.",
    contextPrompt: "Why did it take time to learn this? What had to happen first?",
  },
  {
    id: "prof-mentor-advice",
    category: "professional",
    subSection: "Mastery & Industry Impact",
    lifeStage: "wisdom",
    title: "One Thing to Understand",
    prompt: "If you had to mentor someone based on your career, what's the one thing they must understand?",
    helpText: "The essential truth of your professional journey.",
    contextPrompt: "What would you tell them about your era and how things have changed?",
  },

  // ==========================================
  // CURIOSITY & GROWTH: How You Think, Teach & Predict
  // ==========================================

  // Recognizing Patterns & Predicting the Future
  {
    id: "curiosity-patterns",
    category: "curiosity",
    subSection: "Recognizing Patterns & Predicting",
    lifeStage: "mastery",
    title: "Seeing Patterns Others Miss",
    prompt: "How do you see patterns that others miss?",
    helpText: "Describe a moment when you predicted something correctly.",
    contextPrompt: "What information were you drawing on? What did others overlook?",
  },
  {
    id: "curiosity-unpopular-opinion",
    category: "curiosity",
    subSection: "Recognizing Patterns & Predicting",
    lifeStage: "mastery",
    title: "Unpopular Opinion",
    prompt: "What's an unpopular opinion you hold that you believe is true?",
    helpText: "Where do you challenge conventional thinking?",
    contextPrompt: "Why do you think most people see this differently?",
  },

  // Refining Expertise & Teaching Others
  {
    id: "curiosity-industry-problem",
    category: "curiosity",
    subSection: "Refining Expertise & Teaching",
    lifeStage: "mastery",
    title: "Biggest Industry Problem",
    prompt: "What's the biggest problem in your industry, and how do you think it should be solved?",
    helpText: "Your unique perspective on systemic challenges.",
    contextPrompt: "How has this problem evolved over your career?",
  },
  {
    id: "curiosity-changed-mind",
    category: "curiosity",
    subSection: "Refining Expertise & Teaching",
    lifeStage: "growth",
    title: "Changed Your Mind",
    prompt: "What is something you changed your mind about over time?",
    helpText: "Why did your thinking evolve?",
    contextPrompt: "What new information or experience caused this shift?",
  },
  {
    id: "curiosity-framework",
    category: "curiosity",
    subSection: "Refining Expertise & Teaching",
    lifeStage: "mastery",
    title: "Your Framework for Problems",
    prompt: "What's your unique framework or method for solving problems?",
    helpText: "Explain it as if teaching someone.",
    contextPrompt: "How did you develop this approach? What experiences shaped it?",
  },

  // Wisdom & Teaching for Next Generation
  {
    id: "curiosity-younger-professionals",
    category: "curiosity",
    subSection: "Wisdom & Teaching",
    lifeStage: "wisdom",
    title: "For Younger Professionals",
    prompt: "What's one thing you wish younger professionals understood about your field?",
    helpText: "The insight that takes years to see.",
    contextPrompt: "How has the field changed since you started? What remains constant?",
  },
  {
    id: "curiosity-mindset-shift",
    category: "curiosity",
    subSection: "Wisdom & Teaching",
    lifeStage: "wisdom",
    title: "Mindset Shift for Next Generation",
    prompt: "What's the most important mindset shift for the next generation?",
    helpText: "The thinking that will serve them best.",
    contextPrompt: "What challenges do you see coming that they'll need to navigate?",
  },
  {
    id: "curiosity-enduring-influences",
    category: "curiosity",
    subSection: "Wisdom & Teaching",
    lifeStage: "wisdom",
    title: "Enduring Influences",
    prompt: "What books, mentors, or ideas still influence how you see the world today?",
    helpText: "The wisdom that has stood the test of time.",
    contextPrompt: "When did you first encounter these influences? How has your understanding deepened?",
  },

  // ==========================================
  // LEGACY: Impact, Purpose & What You Leave Behind
  // ==========================================

  // Defining Your Legacy
  {
    id: "legacy-first-thinking",
    category: "legacy",
    subSection: "Defining Your Legacy",
    lifeStage: "mastery",
    title: "First Thoughts of Legacy",
    prompt: "When did you first start thinking about the impact you wanted to leave?",
    helpText: "What triggered this?",
    contextPrompt: "What was happening in your life at that moment?",
  },
  {
    id: "legacy-best-advice",
    category: "legacy",
    subSection: "Defining Your Legacy",
    lifeStage: "wisdom",
    title: "Most Valuable Advice Received",
    prompt: "What's the most valuable piece of advice you received about life?",
    helpText: "Who gave it to you?",
    contextPrompt: "What situation were you in when you received this advice?",
  },
  {
    id: "legacy-built-to-outlast",
    category: "legacy",
    subSection: "Defining Your Legacy",
    lifeStage: "mastery",
    title: "What You Built to Outlast",
    prompt: "What's something you built (a business, philosophy, system) that will outlast you?",
    helpText: "Your contribution that continues.",
    contextPrompt: "Why did you choose to invest in this? What drove you?",
  },

  // Passing Down Wisdom
  {
    id: "legacy-core-principles",
    category: "legacy",
    subSection: "Passing Down Wisdom",
    lifeStage: "wisdom",
    title: "Core Principles to Follow",
    prompt: "If someone wanted to live by your principles, what core ideas should they follow?",
    helpText: "The foundations of your philosophy.",
    contextPrompt: "How did you arrive at these principles? What tested them?",
  },
  {
    id: "legacy-mistakes-to-avoid",
    category: "legacy",
    subSection: "Passing Down Wisdom",
    lifeStage: "wisdom",
    title: "Mistakes to Avoid",
    prompt: "What mistake do you hope future generations avoid?",
    helpText: "The error you want to prevent.",
    contextPrompt: "What made this mistake so costly? What could have been different?",
  },
  {
    id: "legacy-lessons-to-learn",
    category: "legacy",
    subSection: "Passing Down Wisdom",
    lifeStage: "wisdom",
    title: "Lessons to Learn",
    prompt: "What books, ideas, or lessons should the next generation learn from?",
    helpText: "The wisdom worth passing forward.",
    contextPrompt: "Why are these particularly important for the future?",
  },
  {
    id: "legacy-ai-phrase",
    category: "legacy",
    subSection: "Passing Down Wisdom",
    lifeStage: "wisdom",
    title: "Your Guiding Phrase",
    prompt: "If your AI had to guide someone using your wisdom, what phrase should it always repeat?",
    helpText: "Your essential truth in one statement.",
    contextPrompt: "When did this phrase crystallize for you? What moment made it clear?",
  },
];

export const getQuestionsByCategory = (categoryId: string) => {
  return questions.filter((q) => q.category === categoryId);
};

export const getQuestionsByLifeStage = (lifeStage: string) => {
  return questions.filter((q) => q.lifeStage === lifeStage);
};

export const getQuestionsByCategoryAndStage = (categoryId: string, lifeStage: string) => {
  return questions.filter((q) => q.category === categoryId && q.lifeStage === lifeStage);
};

export const getSubSections = (categoryId: string) => {
  const categoryQuestions = getQuestionsByCategory(categoryId);
  const subSections = [...new Set(categoryQuestions.map(q => q.subSection))];
  return subSections;
};

export const getQuestionsBySubSection = (categoryId: string, subSection: string) => {
  return questions.filter((q) => q.category === categoryId && q.subSection === subSection);
};

export const getTotalQuestions = () => questions.length;

export const getCategoryProgress = (
  categoryId: string,
  answers: Record<string, string>
) => {
  const categoryQuestions = getQuestionsByCategory(categoryId);
  const answered = categoryQuestions.filter(
    (q) => answers[q.id] && answers[q.id].trim().length > 0
  ).length;
  return {
    answered,
    total: categoryQuestions.length,
    percentage: Math.round((answered / categoryQuestions.length) * 100),
  };
};

export const getTotalProgress = (answers: Record<string, string>) => {
  const answered = questions.filter(
    (q) => answers[q.id] && answers[q.id].trim().length > 0
  ).length;
  return {
    answered,
    total: questions.length,
    percentage: Math.round((answered / questions.length) * 100),
  };
};

export const getLifeStageProgress = (
  lifeStage: string,
  answers: Record<string, string>
) => {
  const stageQuestions = getQuestionsByLifeStage(lifeStage);
  const answered = stageQuestions.filter(
    (q) => answers[q.id] && answers[q.id].trim().length > 0
  ).length;
  return {
    answered,
    total: stageQuestions.length,
    percentage: Math.round((answered / stageQuestions.length) * 100),
  };
};
