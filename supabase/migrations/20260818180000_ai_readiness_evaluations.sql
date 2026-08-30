-- Migration: 20260818180000_ai_readiness_evaluations.sql
-- Description: AI-assisted trial readiness evaluations, scoring criteria, and recommendations

CREATE TABLE IF NOT EXISTS public.student_readiness_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    student_id UUID NOT NULL,

    readiness_score SMALLINT NOT NULL CHECK (readiness_score >= 0 AND readiness_score <= 100),
    readiness_tier TEXT NOT NULL CHECK (readiness_tier IN ('trial_ready', 'nearly_ready', 'needs_practice', 'not_ready')),
    recommendation_summary TEXT NOT NULL,

    skills_mastered_count INT NOT NULL DEFAULT 0,
    skills_missing TEXT[] NOT NULL DEFAULT '{}',
    practical_hours_completed NUMERIC(5, 2) NOT NULL DEFAULT 0,

    permit_status TEXT NOT NULL,
    medical_status TEXT NOT NULL,
    theory_exam_status TEXT NOT NULL,

    risk_warnings TEXT[] NOT NULL DEFAULT '{}',
    action_items TEXT[] NOT NULL DEFAULT '{}',

    evaluator_type TEXT NOT NULL DEFAULT 'rule_engine' CHECK (evaluator_type IN ('rule_engine', 'ai_assistant')),

    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_readiness_student
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_readiness_student
    ON public.student_readiness_evaluations(driving_school_id, student_id);

CREATE INDEX IF NOT EXISTS idx_readiness_tier
    ON public.student_readiness_evaluations(driving_school_id, readiness_tier);

-- Enable Row Level Security (RLS)
ALTER TABLE public.student_readiness_evaluations ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Policy
DROP POLICY IF EXISTS "readiness_all_policy" ON public.student_readiness_evaluations;
CREATE POLICY "readiness_all_policy" ON public.student_readiness_evaluations
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
