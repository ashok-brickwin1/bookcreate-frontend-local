-- Create publishing_settings table to store book publishing preferences
CREATE TABLE public.publishing_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Publishing status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'preparing', 'submitted', 'published', 'unpublished')),
  
  -- Distribution service choice
  distribution_service TEXT CHECK (distribution_service IN ('draft2digital', 'ingramspark', 'publishdrive', 'streetlib', 'smashwords', 'self')),
  
  -- Format preferences
  export_pdf BOOLEAN DEFAULT true,
  export_epub BOOLEAN DEFAULT true,
  export_print_ready BOOLEAN DEFAULT false,
  
  -- Print-on-demand service
  pod_service TEXT CHECK (pod_service IN ('lulu', 'blurb', 'bookbaby', 'ingramspark', 'kdp', 'none')),
  
  -- ISBN info
  isbn_ebook TEXT,
  isbn_print TEXT,
  use_free_isbn BOOLEAN DEFAULT true,
  
  -- Pricing
  ebook_price DECIMAL(10,2),
  print_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  
  -- Marketplace links (stored as JSON)
  marketplace_links JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata for publishing
  book_description TEXT,
  keywords TEXT[],
  categories TEXT[],
  language TEXT DEFAULT 'en',
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  unpublished_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(book_id)
);

-- Enable RLS
ALTER TABLE public.publishing_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own publishing settings"
  ON public.publishing_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own publishing settings"
  ON public.publishing_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own publishing settings"
  ON public.publishing_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own publishing settings"
  ON public.publishing_settings FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_publishing_settings_updated_at
  BEFORE UPDATE ON public.publishing_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();