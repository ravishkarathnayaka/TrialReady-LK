-- Migration: 20260819190000_theory_mock_exams.sql
-- Description: Theory question bank, road signs quiz, and student mock exam attempt history

-- 1. Table: public.theory_questions
CREATE TABLE IF NOT EXISTS public.theory_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category TEXT NOT NULL CHECK (category IN (
        'road_signs_regulatory',
        'road_signs_warning',
        'road_signs_informative',
        'priority_and_junctions',
        'general_road_safety',
        'vehicle_mechanics_controls'
    )),

    question_text TEXT NOT NULL,
    image_url TEXT,

    options JSONB NOT NULL,
    correct_option_index SMALLINT NOT NULL CHECK (correct_option_index >= 0 AND correct_option_index <= 3),

    explanation TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table: public.student_mock_exam_attempts
CREATE TABLE IF NOT EXISTS public.student_mock_exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    student_id UUID NOT NULL,

    total_questions INT NOT NULL DEFAULT 40,
    correct_answers_count INT NOT NULL,
    score_percentage NUMERIC(5, 2) NOT NULL,
    passed BOOLEAN NOT NULL,
    time_spent_seconds INT NOT NULL,

    answers JSONB NOT NULL DEFAULT '[]',

    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_mock_exam_student
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_theory_questions_cat
    ON public.theory_questions(category);

CREATE INDEX IF NOT EXISTS idx_mock_exam_student
    ON public.student_mock_exam_attempts(driving_school_id, student_id);

CREATE INDEX IF NOT EXISTS idx_mock_exam_date
    ON public.student_mock_exam_attempts(driving_school_id, attempted_at);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.theory_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_mock_exam_attempts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Public/Authenticated read for theory questions
DROP POLICY IF EXISTS "theory_questions_read_policy" ON public.theory_questions;
CREATE POLICY "theory_questions_read_policy" ON public.theory_questions
    FOR SELECT
    USING (true);

-- Multi-Tenant RLS for student mock attempts
DROP POLICY IF EXISTS "mock_exam_attempts_all_policy" ON public.student_mock_exam_attempts;
CREATE POLICY "mock_exam_attempts_all_policy" ON public.student_mock_exam_attempts
    FOR ALL
    USING (
        driving_school_id = COALESCE(
            NULLIF(current_setting('request.jwt.claim.driving_school_id', true), '')::uuid,
            (SELECT p.driving_school_id FROM public.profiles p WHERE p.id = auth.uid() LIMIT 1),
            driving_school_id
        )
    )
    WITH CHECK (
        driving_school_id = COALESCE(
            NULLIF(current_setting('request.jwt.claim.driving_school_id', true), '')::uuid,
            (SELECT p.driving_school_id FROM public.profiles p WHERE p.id = auth.uid() LIMIT 1),
            driving_school_id
        )
    );
