-- Create table for digital twin comparison results
CREATE TABLE public.digital_twin_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  digital_twin_profile TEXT NOT NULL,
  compared_model TEXT NOT NULL,
  overall_alignment INTEGER NOT NULL,
  voice_tone_data JSONB NOT NULL DEFAULT '{}',
  values_intent_data JSONB NOT NULL DEFAULT '{}',
  knowledge_depth_data JSONB NOT NULL DEFAULT '{}',
  decision_posture_data JSONB NOT NULL DEFAULT '{}',
  relational_style_data JSONB NOT NULL DEFAULT '{}',
  match_summary TEXT,
  adjustments JSONB NOT NULL DEFAULT '[]',
  refinement_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.digital_twin_comparisons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own comparisons"
ON public.digital_twin_comparisons
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comparisons"
ON public.digital_twin_comparisons
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparisons"
ON public.digital_twin_comparisons
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons"
ON public.digital_twin_comparisons
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_digital_twin_comparisons_updated_at
BEFORE UPDATE ON public.digital_twin_comparisons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();