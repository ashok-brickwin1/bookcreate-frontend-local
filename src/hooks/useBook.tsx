import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export type BookType = "autobiography" | "memoir" | "fiction" | "fairy_tale" | "love_story" | "professional" | "legacy";
export type BookStatus = "draft" | "in_progress" | "completed" | "published";

export interface Book {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  book_type: BookType;
  status: BookStatus;
  cover_color: string;
  dedication: string | null;
  custom_chapters: any[];
  created_at: string;
  updated_at: string;
}

export interface BookAnswer {
  id: string;
  book_id: string;
  question_id: string;
  answer: string | null;
  ai_enhanced: boolean;
  created_at: string;
  updated_at: string;
}

export const useBook = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Fetch user's books
  const fetchBooks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching books:", error);
      return;
    }

    setBooks(data as Book[]);
    if (data.length > 0 && !currentBook) {
      setCurrentBook(data[0] as Book);
    }
    setLoading(false);
  };

  // Fetch answers for current book
  const fetchAnswers = async (bookId: string) => {
    const { data, error } = await supabase
      .from("book_answers")
      .select("*")
      .eq("book_id", bookId);

    if (error) {
      console.error("Error fetching answers:", error);
      return;
    }

    const answersMap: Record<string, string> = {};
    (data as BookAnswer[]).forEach((answer) => {
      if (answer.answer) {
        answersMap[answer.question_id] = answer.answer;
      }
    });
    setAnswers(answersMap);
  };

  // Create a new book
  const createBook = async (
    title: string = "My Story",
    bookType: BookType = "autobiography"
  ): Promise<Book | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("books")
      .insert({
        user_id: user.id,
        title,
        book_type: bookType,
      })
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error creating book",
        description: error.message,
      });
      return null;
    }

    const newBook = data as Book;
    setBooks((prev) => [newBook, ...prev]);
    setCurrentBook(newBook);
    setAnswers({});
    
    toast({
      title: "Book created!",
      description: `"${title}" is ready for your story.`,
    });
    
    return newBook;
  };

  // Update book details
  const updateBook = async (bookId: string, updates: Partial<Book>) => {
    const { error } = await supabase
      .from("books")
      .update(updates)
      .eq("id", bookId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating book",
        description: error.message,
      });
      return false;
    }

    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, ...updates } : b))
    );
    if (currentBook?.id === bookId) {
      setCurrentBook((prev) => (prev ? { ...prev, ...updates } : null));
    }
    return true;
  };

  // Save an answer
  const saveAnswer = async (questionId: string, answer: string, aiEnhanced: boolean = false) => {
    if (!currentBook) return false;

    const { error } = await supabase
      .from("book_answers")
      .upsert(
        {
          book_id: currentBook.id,
          question_id: questionId,
          answer,
          ai_enhanced: aiEnhanced,
        },
        {
          onConflict: "book_id,question_id",
        }
      );

    if (error) {
      console.error("Error saving answer:", error);
      return false;
    }

    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    return true;
  };

  // Auto-save with debounce
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const debouncedSaveAnswer = (questionId: string, answer: string, aiEnhanced: boolean = false) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      saveAnswer(questionId, answer, aiEnhanced);
    }, 1000);

    setSaveTimeout(timeout);
  };

  useEffect(() => {
    if (user) {
      fetchBooks();
    } else {
      setBooks([]);
      setCurrentBook(null);
      setAnswers({});
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentBook) {
      fetchAnswers(currentBook.id);
    }
  }, [currentBook?.id]);

  return {
    books,
    currentBook,
    answers,
    loading,
    setCurrentBook,
    createBook,
    updateBook,
    saveAnswer: debouncedSaveAnswer,
    fetchBooks,
  };
};