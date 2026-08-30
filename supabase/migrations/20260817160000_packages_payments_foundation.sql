-- Migration: 20260817160000_packages_payments_foundation.sql
-- Description: Course packages catalog, student package enrolments, and payment instalment tracking

-- 1. Table: public.packages
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,

    fee NUMERIC(10, 2) NOT NULL CHECK (fee >= 0),
    practical_hours_included INT NOT NULL DEFAULT 15 CHECK (practical_hours_included >= 0),
    theory_classes_included INT NOT NULL DEFAULT 5 CHECK (theory_classes_included >= 0),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT packages_school_code_unique
        UNIQUE (driving_school_id, code)
);

-- 2. Table: public.student_package_enrolments
CREATE TABLE IF NOT EXISTS public.student_package_enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    student_id UUID NOT NULL,
    package_id UUID NOT NULL
        REFERENCES public.packages(id)
        ON DELETE RESTRICT,

    enrolled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    agreed_total_fee NUMERIC(10, 2) NOT NULL CHECK (agreed_total_fee >= 0),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),

    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_enrolment_student
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE
);

-- 3. Table: public.student_payments
CREATE TABLE IF NOT EXISTS public.student_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    student_id UUID NOT NULL,
    enrolment_id UUID
        REFERENCES public.student_package_enrolments(id)
        ON DELETE SET NULL,

    receipt_number TEXT NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'card', 'cheque', 'online')),
    payment_reference TEXT,

    collected_by UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_payment_student
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT payments_school_receipt_unique
        UNIQUE (driving_school_id, receipt_number)
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_packages_school
    ON public.packages(driving_school_id);

CREATE INDEX IF NOT EXISTS idx_enrolments_student
    ON public.student_package_enrolments(driving_school_id, student_id);

CREATE INDEX IF NOT EXISTS idx_payments_student
    ON public.student_payments(driving_school_id, student_id);

CREATE INDEX IF NOT EXISTS idx_payments_date
    ON public.student_payments(driving_school_id, payment_date);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_package_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_payments ENABLE ROW LEVEL SECURITY;

-- 6. Multi-Tenant RLS Policies
-- Packages
DROP POLICY IF EXISTS "packages_all_policy" ON public.packages;
CREATE POLICY "packages_all_policy" ON public.packages
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

-- Enrolments
DROP POLICY IF EXISTS "student_package_enrolments_all_policy" ON public.student_package_enrolments;
CREATE POLICY "student_package_enrolments_all_policy" ON public.student_package_enrolments
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

-- Payments
DROP POLICY IF EXISTS "student_payments_all_policy" ON public.student_payments;
CREATE POLICY "student_payments_all_policy" ON public.student_payments
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
