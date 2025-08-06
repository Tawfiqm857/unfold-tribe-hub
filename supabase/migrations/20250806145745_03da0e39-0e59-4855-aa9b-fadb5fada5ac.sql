-- Create magazines table for storing magazine metadata
CREATE TABLE public.magazines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  issue_number TEXT,
  cover_image_url TEXT,
  publication_date DATE,
  embed_url TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hard_copy_requests table for physical magazine requests
CREATE TABLE public.hard_copy_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  magazine_id UUID REFERENCES public.magazines(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  delivery_address TEXT NOT NULL,
  status TEXT DEFAULT 'pending'::text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hard_copy_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for magazines (publicly readable for browsing)
CREATE POLICY "Anyone can view magazines" 
ON public.magazines 
FOR SELECT 
USING (true);

-- RLS policies for hard_copy_requests (users can only see their own requests)
CREATE POLICY "Users can view their own requests" 
ON public.hard_copy_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" 
ON public.hard_copy_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" 
ON public.hard_copy_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_magazines_updated_at
BEFORE UPDATE ON public.magazines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hard_copy_requests_updated_at
BEFORE UPDATE ON public.hard_copy_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample magazine data
INSERT INTO public.magazines (title, description, issue_number, cover_image_url, publication_date, embed_url, tags) VALUES
('Unfold Editorial Magazine', 'A digital magazine showcasing innovative content and creative perspectives from Nigeria and beyond.', 'Issue #1 - 2024', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=600&fit=crop', '2024-01-01', 'https://tawfiqm857.github.io/unfold-editorial-web/', ARRAY['entrepreneurship', 'innovation', 'nigeria', 'technology']);