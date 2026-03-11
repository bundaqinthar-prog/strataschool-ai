
-- Create ai_reports table
CREATE TABLE public.ai_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  school_name TEXT NOT NULL DEFAULT '',
  feature_used TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_report_result TEXT NOT NULL DEFAULT '',
  score JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

-- Users can read own reports
CREATE POLICY "Users can read own reports"
  ON public.ai_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert own reports
CREATE POLICY "Users can insert own reports"
  ON public.ai_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own reports
CREATE POLICY "Users can delete own reports"
  ON public.ai_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all reports
CREATE POLICY "Admins can read all reports"
  ON public.ai_reports FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
