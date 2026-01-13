import { useState ,useEffect} from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBook, BookType } from "@/hooks/useBook";
import { StepIndicator } from "./StepIndicator";
import { BasicInfoStep, BasicInfo } from "./BasicInfoStep";
import { BookSetupStep, BookSetupData } from "./BookSetupStep";
import {fetchBookSetup} from "@/api/bookSetup";
import {fetchSavedAnswers} from "@/api/answer";
import { DigitalFootprintStep, FootprintData } from "./DigitalFootprintStep";
import { GuidedInterviewStep } from "./GuidedInterviewStep";
import { ReviewStep, JourneyMoment } from "./ReviewStep";
import { BookPreview } from "@/components/BookPreview";
import { questions } from "@/data/bookQuestions";
import { UserMenu } from "@/components/UserMenu";
import { BookOpen } from "lucide-react";
import { WritingStyle } from "@/data/writingStyles";

interface StoryJourneyProps {
  onBack: () => void;
}

const STEPS = [
  { id: "info", label: "Your Info" },
  { id: "setup", label: "Book Setup" },
  { id: "interview", label: "Interview" },
  

  { id: "review", label: "Review" },
  // changing_step_order
  { id: "footprint", label: "Footprint" },
  { id: "book", label: "Your Book" },
];

export const StoryJourney = ({ onBack }: StoryJourneyProps) => {
  const { user } = useAuth();
  const { currentBook, answers, createBook, updateBook, saveAnswer } = useBook();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [bookSetup, setBookSetup] = useState<BookSetupData | null>(null);
  const [footprint, setFootprint] = useState<FootprintData | null>(null);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  const [journeyMoments, setJourneyMoments] = useState<JourneyMoment[]>([]);
  const [writingStyle, setWritingStyle] = useState<WritingStyle | null>(null);
  

  const [initialBookSetup, setInitialBookSetup] = useState<BookSetupData | undefined>();
const [loading, setLoading] = useState(true);



const mapBookSetupFromApi = (apiData: any): BookSetupData => {
  const b = apiData.book_setup;

  return {
    genre: b.genre,
    customGenre: b.custom_genre ?? "",
    workingTitle: b.working_title,
    chapterCount: b.chapter_count,
    desiredLength: b.desired_length,
    dedication: b.dedication ?? "",
    gdprConsent: b.gdpr_consent,
  };
};



useEffect(() => {
  const loadAll = async () => {
    try {
      const [ answersRes] = await Promise.all([
        // fetchBookSetup(),
        fetchSavedAnswers(),
      ]);

      // book setup
      // const mappedSetup = mapBookSetupFromApi(bookSetupRes);
      // setInitialBookSetup(mappedSetup);

      // answers
      const mappedAnswers: Record<string, string> = {};
      answersRes.answers.forEach((a: any) => {
        mappedAnswers[a.question_id] = a.answer_text;
      });
      setLocalAnswers(mappedAnswers);

    } catch (err) {
      console.error("Failed to preload journey data", err);
    } finally {
      setLoading(false);
    }
  };

  loadAll();
}, []); 


// useEffect(() => {
//   const load = async () => {
//     try {
//       const apiRes = await fetchBookSetup();
//       const mapped = mapBookSetupFromApi(apiRes);
//       setInitialBookSetup(mapped);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   load();
// }, []);


// useEffect(() => {
//   const loadAnswers = async () => {
//     try {
//       const res = await fetchSavedAnswers();

//       const mapped: Record<string, string> = {};
//       res.answers.forEach((a: any) => {
//         mapped[a.question_id] = a.answer_text;
//       });

//       setLocalAnswers(mapped); // ✅ FIX
//     } catch (err) {
//       console.error("Failed to prefill answers", err);
//     }
//   };

//   loadAnswers();
// }, []);


if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <BookOpen className="h-8 w-8 animate-pulse text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your journey…
        </p>
      </div>
    </div>
  );
}



  const handleAddMoment = (moment: Omit<JourneyMoment, "id">) => {
    const newMoment: JourneyMoment = {
      ...moment,
      id: crypto.randomUUID(),
    };
    setJourneyMoments(prev => [...prev, newMoment]);
  };

  const handleReplaceMoments = (moments: JourneyMoment[]) => {
  setJourneyMoments(moments);
};

  const handleRemoveMoment = (id: string) => {
    setJourneyMoments(prev => prev.filter(m => m.id !== id));
  };

  // Merge local answers with saved answers
  const mergedAnswers = { ...answers, ...localAnswers };
  

  const handleBasicInfoComplete = (info: BasicInfo) => {
    setBasicInfo(info);
    setCurrentStep(1);
  };

  const handleBookSetupComplete = async (setup: BookSetupData) => {
    setBookSetup(setup);
    
    // Create book if user is logged in
    // if (user && !currentBook) {
    //   const bookType = setup.genre as BookType;
    //   await createBook(setup.workingTitle || basicInfo?.fullName + "'s Story", bookType);
    // }
    
    setCurrentStep(2);
  };
  const handleInterviewComplete = () => {
    setCurrentStep(3);
  };

  const handleReviewComplete = () => {
    setCurrentStep(4);
  };

  const handleFootprintComplete = (data: FootprintData) => {
    setFootprint(data);
    setCurrentStep(5);
  };

  const handleSaveAnswer = (questionId: string, answer: string) => {
    setLocalAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Also save to database if user is logged in
    if (user && currentBook) {
      saveAnswer(questionId, answer);
    }
  };

  

  const handleEditAnswer = (questionId: string) => {
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex >= 0) {
      setCurrentStep(3);
      // The interview step will handle scrolling to the right question
    }
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setBasicInfo(null);
    setBookSetup(null);
    setFootprint(null);
    setLocalAnswers({});
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            initialData={basicInfo || undefined}
            onComplete={handleBasicInfoComplete}
            onBack={onBack}
          />
        );
      
      case 1:
        if (!basicInfo) {
          setCurrentStep(0);
          return null;
        }
        return (
          <BookSetupStep
            initialData={bookSetup || undefined}
            onComplete={handleBookSetupComplete}
            onBack={() => setCurrentStep(0)}
          />
        );
      
      
      
      case 2:
        return (
          <GuidedInterviewStep
            answers={mergedAnswers}
            onSaveAnswer={handleSaveAnswer}
            onComplete={handleInterviewComplete}
            onBack={() => setCurrentStep(1)}
            writingStyle={writingStyle}
            onWritingStyleChange={setWritingStyle}
          />
        );
      
      case 3:
        return (
          <ReviewStep
            answers={mergedAnswers}
            footprint={footprint}
            journeyMoments={journeyMoments}
            onAddMoment={handleAddMoment}
            onRemoveMoment={handleRemoveMoment}
            onReplaceMoments={handleReplaceMoments}
            onComplete={handleReviewComplete}
            onBack={() => setCurrentStep(2)}
            onEditAnswer={handleEditAnswer}
          />
        );

      case 4:
        if (!basicInfo) {
          setCurrentStep(0);
          return null;
        }
        return (
          <DigitalFootprintStep
            basicInfo={basicInfo}
            onComplete={handleFootprintComplete}
            onBack={() => setCurrentStep(3)}
          />
        );
      
      case 5:
        return (
          <BookPreview
            answers={mergedAnswers}
            onBack={() => setCurrentStep(4)}
            onStartOver={handleStartOver}
          />
        );
      
      default:
        return null;
    }
  };

  // Show step indicator for steps 1-4 (not on basic info or final book preview)
  const showStepIndicator = currentStep > 0 && currentStep < 5;

  return (
    <div className="min-h-screen">
      {/* Global Header with Step Indicator */}
      {showStepIndicator && (
        <header className="fixed top-0 left-0 right-0 z-40 glass-card border-b border-border/50">
          <div className="container max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-display text-lg font-medium hidden sm:block">ECwriter</span>
              </div>
              
              <StepIndicator steps={STEPS} currentStep={currentStep} />
              
              <UserMenu />
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className={showStepIndicator ? "pt-20" : ""}>
        {renderStep()}
      </div>
    </div>
  );
};
