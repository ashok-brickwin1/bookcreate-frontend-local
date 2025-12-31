-- Create enum for book types
CREATE TYPE public.book_type AS ENUM ('autobiography', 'memoir', 'fiction', 'fairy_tale', 'love_story', 'professional', 'legacy');

-- Create enum for book status
CREATE TYPE public.book_status AS ENUM ('draft', 'in_progress', 'completed', 'published');

-- Create enum for collaboration role
CREATE TYPE public.collaboration_role AS ENUM ('contributor', 'editor', 'viewer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Story',
  subtitle TEXT,
  book_type public.book_type NOT NULL DEFAULT 'autobiography',
  status public.book_status NOT NULL DEFAULT 'draft',
  cover_color TEXT DEFAULT '#8B5CF6',
  dedication TEXT,
  custom_chapters JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create book answers table
CREATE TABLE public.book_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  answer TEXT,
  ai_enhanced BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(book_id, question_id)
);

-- Create book collaborators table
CREATE TABLE public.book_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role public.collaboration_role NOT NULL DEFAULT 'contributor',
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(book_id, email)
);

-- Create collaborator contributions table
CREATE TABLE public.collaborator_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  collaborator_id UUID NOT NULL REFERENCES public.book_collaborators(id) ON DELETE CASCADE,
  question_id TEXT,
  contribution TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborator_contributions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Books policies
CREATE POLICY "Users can view their own books" ON public.books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own books" ON public.books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own books" ON public.books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own books" ON public.books FOR DELETE USING (auth.uid() = user_id);

-- Book answers policies
CREATE POLICY "Users can view answers for their books" ON public.book_answers FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.books WHERE books.id = book_answers.book_id AND books.user_id = auth.uid()));
CREATE POLICY "Users can insert answers for their books" ON public.book_answers FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.books WHERE books.id = book_answers.book_id AND books.user_id = auth.uid()));
CREATE POLICY "Users can update answers for their books" ON public.book_answers FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.books WHERE books.id = book_answers.book_id AND books.user_id = auth.uid()));
CREATE POLICY "Users can delete answers for their books" ON public.book_answers FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.books WHERE books.id = book_answers.book_id AND books.user_id = auth.uid()));

-- Collaborators policies
CREATE POLICY "Book owners can view collaborators" ON public.book_collaborators FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.books WHERE books.id = book_collaborators.book_id AND books.user_id = auth.uid()));
CREATE POLICY "Book owners can add collaborators" ON public.book_collaborators FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.books WHERE books.id = book_collaborators.book_id AND books.user_id = auth.uid()));
CREATE POLICY "Book owners can update collaborators" ON public.book_collaborators FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.books WHERE books.id = book_collaborators.book_id AND books.user_id = auth.uid()));
CREATE POLICY "Book owners can remove collaborators" ON public.book_collaborators FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.books WHERE books.id = book_collaborators.book_id AND books.user_id = auth.uid()));
CREATE POLICY "Collaborators can view their own invites" ON public.book_collaborators FOR SELECT 
  USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Contributions policies
CREATE POLICY "Book owners can view contributions" ON public.collaborator_contributions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.books WHERE books.id = collaborator_contributions.book_id AND books.user_id = auth.uid()));
CREATE POLICY "Collaborators can add contributions" ON public.collaborator_contributions FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.book_collaborators 
    WHERE book_collaborators.id = collaborator_contributions.collaborator_id 
    AND book_collaborators.user_id = auth.uid()
    AND book_collaborators.accepted_at IS NOT NULL
  ));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_book_answers_updated_at BEFORE UPDATE ON public.book_answers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();