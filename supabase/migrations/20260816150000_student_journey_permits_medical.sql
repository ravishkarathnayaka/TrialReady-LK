-- Migration: 20260816150000_student_journey_permits_medical.sql
-- Description: Student journey tracking, learner's permits, NTMI medical appointments, and DMT exam/trial milestones

-- 1. Create Enums
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'student_medical_status') THEN
        CREATE TYPE public.student_medical_status AS ENUM (
            'not_scheduled',
            'appointment_booked',
            'passed',
            'temporary_unfit',
            'failed'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'student_permit_status') THEN
        CREATE TYPE public.student_permit_status AS ENUM (
            'not_applied',
            'applied',
            'active',
            'expiring_soon',
            'expired',
            'renewed'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'student_exam_status') THEN
        CREATE TYPE public.student_exam_status AS ENUM (
            'scheduled',
            'passed',
            'failed',
            'absent',
            'cancelled'
        );
    END IF;
END $$;

-- 2. Table: public.student_permits
CREATE TABLE IF NOT EXISTS public.student_permits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    student_id UUID NOT NULL,

    permit_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,

    status public.student_permit_status NOT NULL DEFAULT 'active',
    dmt_reference TEXT,
    notes TEXT,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_permits_student
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT check_permit_dates_order
        CHECK (issue_date <= expiry_date)
);

-- 3. Table: public.student_medical_records
CREATE TABLE IF NOT EXISTS public.student_medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    student_id UUID NOT NULL,

    status public.student_medical_status NOT NULL DEFAULT 'not_scheduled',
    appointment_date DATE,
    certificate_number TEXT,
    issued_date DATE,
    expiry_date DATE,
    ntmi_branch TEXT,
    blood_group TEXT,
    restrictions TEXT,
    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_medicals_student
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE
);

-- 4. Table: public.student_exam_trials
CREATE TABLE IF NOT EXISTS public.student_exam_trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    student_id UUID NOT NULL,

    exam_type TEXT NOT NULL CHECK (exam_type IN ('theory', 'practical_trial')),
    attempt_number INT NOT NULL DEFAULT 1,
    scheduled_date DATE NOT NULL,
    status public.student_exam_status NOT NULL DEFAULT 'scheduled',
    score SMALLINT,
    location TEXT,
    examiner_notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_exams_student
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_student_permits_student
    ON public.student_permits(driving_school_id, student_id);

CREATE INDEX IF NOT EXISTS idx_student_permits_expiry
    ON public.student_permits(driving_school_id, expiry_date);

CREATE INDEX IF NOT EXISTS idx_student_medicals_student
    ON public.student_medical_records(driving_school_id, student_id);

CREATE INDEX IF NOT EXISTS idx_student_exams_student
    ON public.student_exam_trials(driving_school_id, student_id, exam_type);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.student_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_exam_trials ENABLE ROW LEVEL SECURITY;

-- 7. Multi-Tenant RLS Policies
-- Permits
DROP POLICY IF EXISTS "student_permits_all_policy" ON public.student_permits;
CREATE POLICY "student_permits_all_policy" ON public.student_permits
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

-- Medicals
DROP POLICY IF EXISTS "student_medicals_all_policy" ON public.student_medical_records;
CREATE POLICY "student_medicals_all_policy" ON public.student_medical_records
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

-- Exam Trials
DROP POLICY IF EXISTS "student_exams_all_policy" ON public.student_exam_trials;
CREATE POLICY "student_exams_all_policy" ON public.student_exam_trials
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
