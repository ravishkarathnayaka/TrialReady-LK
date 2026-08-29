-- Migration: 20260815120000_practical_sessions_foundation.sql
-- Description: Practical driving session scheduling, attendance tracking, and conflict avoidance schema

-- 1. Create Enums
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'practical_session_status') THEN
        CREATE TYPE public.practical_session_status AS ENUM (
            'scheduled',
            'in_progress',
            'completed',
            'cancelled',
            'no_show'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_attendance_status') THEN
        CREATE TYPE public.session_attendance_status AS ENUM (
            'unmarked',
            'present',
            'absent',
            'late'
        );
    END IF;
END $$;

-- 2. Create practical_sessions Table
CREATE TABLE IF NOT EXISTS public.practical_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    branch_id UUID NOT NULL,
    student_id UUID NOT NULL,
    instructor_id UUID NOT NULL,
    vehicle_id UUID,
    licence_category_id UUID NOT NULL,

    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    status public.practical_session_status NOT NULL DEFAULT 'scheduled',
    attendance_status public.session_attendance_status NOT NULL DEFAULT 'unmarked',

    instructor_feedback TEXT,
    student_rating SMALLINT CHECK (student_rating IS NULL OR (student_rating >= 1 AND student_rating <= 5)),
    cancellation_reason TEXT,
    skills_covered TEXT[] NOT NULL DEFAULT '{}',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Multi-tenant Composite Foreign Keys
    CONSTRAINT fk_practical_sessions_branch
        FOREIGN KEY (branch_id, driving_school_id)
        REFERENCES public.branches(id, driving_school_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_practical_sessions_student
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_practical_sessions_instructor
        FOREIGN KEY (instructor_id, driving_school_id)
        REFERENCES public.instructors(id, driving_school_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_practical_sessions_vehicle
        FOREIGN KEY (vehicle_id, driving_school_id)
        REFERENCES public.vehicles(id, driving_school_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_practical_sessions_licence_category
        FOREIGN KEY (licence_category_id, driving_school_id)
        REFERENCES public.licence_categories(id, driving_school_id)
        ON DELETE RESTRICT,

    -- Logical Constraints
    CONSTRAINT check_session_time_order
        CHECK (start_time < end_time)
);

-- 3. Composite Indexes for Fast Scheduling, Calendar Queries, and Collision Detection
CREATE INDEX IF NOT EXISTS idx_practical_sessions_school_date
    ON public.practical_sessions(driving_school_id, session_date);

CREATE INDEX IF NOT EXISTS idx_practical_sessions_instructor_slot
    ON public.practical_sessions(driving_school_id, instructor_id, session_date, start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_practical_sessions_vehicle_slot
    ON public.practical_sessions(driving_school_id, vehicle_id, session_date, start_time, end_time)
    WHERE vehicle_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_practical_sessions_student
    ON public.practical_sessions(driving_school_id, student_id, session_date);

CREATE INDEX IF NOT EXISTS idx_practical_sessions_status
    ON public.practical_sessions(driving_school_id, status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.practical_sessions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Multi-tenant driving_school_id isolation)
DROP POLICY IF EXISTS "practical_sessions_select_policy" ON public.practical_sessions;
CREATE POLICY "practical_sessions_select_policy"
    ON public.practical_sessions
    FOR SELECT
    USING (
        driving_school_id = COALESCE(
            NULLIF(current_setting('request.jwt.claim.driving_school_id', true), '')::uuid,
            (SELECT p.driving_school_id FROM public.profiles p WHERE p.id = auth.uid() LIMIT 1),
            driving_school_id
        )
    );

DROP POLICY IF EXISTS "practical_sessions_insert_policy" ON public.practical_sessions;
CREATE POLICY "practical_sessions_insert_policy"
    ON public.practical_sessions
    FOR INSERT
    WITH CHECK (
        driving_school_id = COALESCE(
            NULLIF(current_setting('request.jwt.claim.driving_school_id', true), '')::uuid,
            (SELECT p.driving_school_id FROM public.profiles p WHERE p.id = auth.uid() LIMIT 1),
            driving_school_id
        )
    );

DROP POLICY IF EXISTS "practical_sessions_update_policy" ON public.practical_sessions;
CREATE POLICY "practical_sessions_update_policy"
    ON public.practical_sessions
    FOR UPDATE
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

DROP POLICY IF EXISTS "practical_sessions_delete_policy" ON public.practical_sessions;
CREATE POLICY "practical_sessions_delete_policy"
    ON public.practical_sessions
    FOR DELETE
    USING (
        driving_school_id = COALESCE(
            NULLIF(current_setting('request.jwt.claim.driving_school_id', true), '')::uuid,
            (SELECT p.driving_school_id FROM public.profiles p WHERE p.id = auth.uid() LIMIT 1),
            driving_school_id
        )
    );
