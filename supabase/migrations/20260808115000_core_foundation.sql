-- ============================================================
-- TrialReady LK
-- Core Database Foundation
-- Issue #9: Database schema, RLS, and backend foundation
-- ============================================================

-- Required for UUID generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- Application Roles
-- ------------------------------------------------------------
-- These values must stay consistent across:
-- Supabase
-- FastAPI
-- React authentication
-- Role-based routing
-- Row-Level Security

DO $$
BEGIN
    CREATE TYPE public.app_role AS ENUM (
        'administrator',
        'instructor',
        'student'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

-- ------------------------------------------------------------
-- User Account Status
-- ------------------------------------------------------------
-- Used to control whether an authenticated user is allowed
-- to access TrialReady LK.

DO $$
BEGIN
    CREATE TYPE public.account_status AS ENUM (
        'active',
        'inactive',
        'suspended',
        'disabled'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;
-- ============================================================
-- Core Multi-Tenant Structure
-- ============================================================

-- ------------------------------------------------------------
-- Driving Schools
-- ------------------------------------------------------------
-- Each driving school is treated as a separate tenant.
-- Data belonging to one school must never be exposed to another.

CREATE TABLE IF NOT EXISTS public.driving_schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    registration_number TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate registration numbers when one is provided.
CREATE UNIQUE INDEX IF NOT EXISTS
    driving_schools_registration_number_unique
ON public.driving_schools (registration_number)
WHERE registration_number IS NOT NULL;



-- ------------------------------------------------------------
-- Branches
-- ------------------------------------------------------------
-- A driving school can operate one or more branches.
-- Each branch is associated with a specific driving school.

CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT branches_school_name_unique
        UNIQUE (driving_school_id, name),

    CONSTRAINT branches_id_school_unique
        UNIQUE (id, driving_school_id)
);


-- ------------------------------------------------------------
-- User Profiles
-- ------------------------------------------------------------
-- Supabase Auth manages authentication.
-- This table stores TrialReady LK application-level
-- information for authenticated users.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    branch_id UUID,

    role public.app_role NOT NULL,

    full_name TEXT NOT NULL,
    phone TEXT,

    status public.account_status NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT profiles_id_school_unique
    UNIQUE (id, driving_school_id),

CONSTRAINT profiles_branch_school_fk
    FOREIGN KEY (branch_id, driving_school_id)
    REFERENCES public.branches(id, driving_school_id)
);
-- ============================================================
-- Licence Categories
-- ============================================================
-- Licence categories are maintained per driving school.
-- Examples may include A1, A, B1, B, C1, C, etc.
-- TrialReady LK should not hardcode these values because
-- schools may offer different categories.

CREATE TABLE IF NOT EXISTS public.licence_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT licence_categories_school_code_unique
        UNIQUE (driving_school_id, code),

    CONSTRAINT licence_categories_id_school_unique
        UNIQUE (id, driving_school_id)
);
-- ============================================================
-- Instructors
-- ============================================================
-- Stores operational instructor records for each driving school.
-- An instructor does not need a TrialReady LK login account
-- in order to exist in the system.

CREATE TABLE IF NOT EXISTS public.instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    branch_id UUID,

    employee_code TEXT,

    full_name TEXT NOT NULL,
    nic TEXT,
    phone TEXT,
    email TEXT,

    driving_licence_number TEXT,
    driving_licence_expiry_date DATE,

    joined_date DATE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT instructors_school_employee_code_unique
        UNIQUE (driving_school_id, employee_code),

    CONSTRAINT instructors_id_school_unique
        UNIQUE (id, driving_school_id),

    CONSTRAINT instructors_branch_school_fk
        FOREIGN KEY (branch_id, driving_school_id)
        REFERENCES public.branches(id, driving_school_id)
);
-- ============================================================
-- Instructor Licence Categories
-- ============================================================
-- Defines which licence categories each instructor
-- is qualified/authorized to teach.

CREATE TABLE IF NOT EXISTS public.instructor_licence_categories (
    instructor_id UUID NOT NULL,

    licence_category_id UUID NOT NULL,

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT instructor_licence_categories_pk
        PRIMARY KEY (instructor_id, licence_category_id),

    CONSTRAINT instructor_licence_categories_instructor_school_fk
        FOREIGN KEY (instructor_id, driving_school_id)
        REFERENCES public.instructors(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT instructor_licence_categories_category_school_fk
        FOREIGN KEY (licence_category_id, driving_school_id)
        REFERENCES public.licence_categories(id, driving_school_id)
        ON DELETE CASCADE
);
-- ============================================================
-- Students
-- ============================================================
-- Stores the core operational record for each driving-school
-- student. Authentication/portal access can be linked later.

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    branch_id UUID,

    primary_instructor_id UUID,

    student_code TEXT,

    full_name TEXT NOT NULL,
    nic TEXT,
    date_of_birth DATE,

    phone TEXT,
    email TEXT,
    address TEXT,

    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,

    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT students_school_student_code_unique
        UNIQUE (driving_school_id, student_code),

    CONSTRAINT students_id_school_unique
        UNIQUE (id, driving_school_id),

    CONSTRAINT students_branch_school_fk
        FOREIGN KEY (branch_id, driving_school_id)
        REFERENCES public.branches(id, driving_school_id),

    CONSTRAINT students_primary_instructor_school_fk
        FOREIGN KEY (primary_instructor_id, driving_school_id)
        REFERENCES public.instructors(id, driving_school_id)
        ON DELETE SET NULL (primary_instructor_id)
);
-- ============================================================
-- Student Licence Categories
-- ============================================================
-- Defines which licence categories each student is registered
-- to follow within the driving school.

CREATE TABLE IF NOT EXISTS public.student_licence_categories (
    student_id UUID NOT NULL,

    licence_category_id UUID NOT NULL,

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT student_licence_categories_pk
        PRIMARY KEY (student_id, licence_category_id),

    CONSTRAINT student_licence_categories_student_school_fk
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT student_licence_categories_category_school_fk
        FOREIGN KEY (licence_category_id, driving_school_id)
        REFERENCES public.licence_categories(id, driving_school_id)
        ON DELETE CASCADE
);
-- ============================================================
-- Instructor Profile Links
-- ============================================================
-- Links an operational instructor record to an authenticated
-- TrialReady LK profile.
--
-- The instructor record can exist without a login account.
-- Removing portal access therefore does not delete the
-- instructor's operational/history record.

CREATE TABLE IF NOT EXISTS public.instructor_profile_links (
    profile_id UUID NOT NULL,

    instructor_id UUID NOT NULL,

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT instructor_profile_links_pk
        PRIMARY KEY (profile_id),

    CONSTRAINT instructor_profile_links_instructor_unique
        UNIQUE (instructor_id),

    CONSTRAINT instructor_profile_links_profile_school_fk
        FOREIGN KEY (profile_id, driving_school_id)
        REFERENCES public.profiles(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT instructor_profile_links_instructor_school_fk
        FOREIGN KEY (instructor_id, driving_school_id)
        REFERENCES public.instructors(id, driving_school_id)
        ON DELETE CASCADE
);
-- ============================================================
-- Student Profile Links
-- ============================================================
-- Links an operational student record to an authenticated
-- TrialReady LK profile.
--
-- A student may exist in the driving-school system without
-- having portal access. Removing portal access therefore does
-- not delete the student's operational or historical record.

CREATE TABLE IF NOT EXISTS public.student_profile_links (
    profile_id UUID NOT NULL,

    student_id UUID NOT NULL,

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT student_profile_links_pk
        PRIMARY KEY (profile_id),

    CONSTRAINT student_profile_links_student_unique
        UNIQUE (student_id),

    CONSTRAINT student_profile_links_profile_school_fk
        FOREIGN KEY (profile_id, driving_school_id)
        REFERENCES public.profiles(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT student_profile_links_student_school_fk
        FOREIGN KEY (student_id, driving_school_id)
        REFERENCES public.students(id, driving_school_id)
        ON DELETE CASCADE
);
-- ============================================================
-- Automatic Updated-At Handling
-- ============================================================
-- Keeps updated_at timestamps synchronized automatically when
-- records are modified.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


CREATE TRIGGER set_driving_schools_updated_at
BEFORE UPDATE ON public.driving_schools
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


CREATE TRIGGER set_branches_updated_at
BEFORE UPDATE ON public.branches
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


CREATE TRIGGER set_licence_categories_updated_at
BEFORE UPDATE ON public.licence_categories
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


CREATE TRIGGER set_instructors_updated_at
BEFORE UPDATE ON public.instructors
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


CREATE TRIGGER set_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
-- ============================================================
-- Performance Indexes
-- ============================================================
-- Primary keys and UNIQUE constraints already create indexes.
-- These additional indexes support foreign-key lookups,
-- tenant filtering, scheduling, and relationship queries.

CREATE INDEX IF NOT EXISTS idx_profiles_driving_school
    ON public.profiles (driving_school_id);

CREATE INDEX IF NOT EXISTS idx_profiles_branch
    ON public.profiles (branch_id)
    WHERE branch_id IS NOT NULL;


CREATE INDEX IF NOT EXISTS idx_instructors_branch
    ON public.instructors (branch_id)
    WHERE branch_id IS NOT NULL;


CREATE INDEX IF NOT EXISTS idx_students_branch
    ON public.students (branch_id)
    WHERE branch_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_students_primary_instructor
    ON public.students (primary_instructor_id)
    WHERE primary_instructor_id IS NOT NULL;


CREATE INDEX IF NOT EXISTS idx_instructor_licence_categories_school
    ON public.instructor_licence_categories (driving_school_id);

CREATE INDEX IF NOT EXISTS idx_instructor_licence_categories_category
    ON public.instructor_licence_categories (licence_category_id);


CREATE INDEX IF NOT EXISTS idx_student_licence_categories_school
    ON public.student_licence_categories (driving_school_id);

CREATE INDEX IF NOT EXISTS idx_student_licence_categories_category
    ON public.student_licence_categories (licence_category_id);


CREATE INDEX IF NOT EXISTS idx_instructor_profile_links_school
    ON public.instructor_profile_links (driving_school_id);

CREATE INDEX IF NOT EXISTS idx_student_profile_links_school
    ON public.student_profile_links (driving_school_id);

    -- ============================================================
-- Row Level Security Foundation
-- ============================================================
-- TrialReady LK is multi-tenant.
-- Every authenticated user must only operate within the
-- driving school associated with their profile.

CREATE SCHEMA IF NOT EXISTS private;


-- ------------------------------------------------------------
-- Current User Driving School
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION private.current_driving_school_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT driving_school_id
    FROM public.profiles
    WHERE id = auth.uid()
      AND status = 'active'
    LIMIT 1;
$$;


-- ------------------------------------------------------------
-- Current User Role
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION private.current_app_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT role
    FROM public.profiles
    WHERE id = auth.uid()
      AND status = 'active'
    LIMIT 1;
$$;


-- Prevent anonymous/public direct execution.
REVOKE ALL ON FUNCTION private.current_driving_school_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.current_app_role() FROM PUBLIC;

GRANT USAGE ON SCHEMA private TO authenticated;

GRANT EXECUTE ON FUNCTION private.current_driving_school_id()
TO authenticated;

GRANT EXECUTE ON FUNCTION private.current_app_role()
TO authenticated;


-- ============================================================
-- Enable Row Level Security
-- ============================================================

ALTER TABLE public.driving_schools
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.branches
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.licence_categories
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.instructors
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.instructor_licence_categories
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.students
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.student_licence_categories
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.instructor_profile_links
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.student_profile_links
    ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Table Privileges for Supabase Data API Roles
-- ============================================================
--
-- PostgreSQL GRANTs determine whether a role can access a table.
-- Row Level Security policies below determine which rows the
-- authenticated role may access.
--
-- No privileges are granted to anon because TrialReady LK
-- requires authenticated application access.
--

-- Remove default schema access so anonymous/API roles do not
-- inherit access through PostgreSQL's PUBLIC pseudo-role.

REVOKE ALL PRIVILEGES ON SCHEMA public
FROM PUBLIC, anon, authenticated, service_role;

GRANT USAGE ON SCHEMA public
TO authenticated, service_role;
-- Reset any platform/default table privileges first so that this
-- migration produces the same permission model on every project.

REVOKE ALL PRIVILEGES
ON TABLE
    public.driving_schools,
    public.branches,
    public.profiles,
    public.licence_categories,
    public.instructors,
    public.instructor_licence_categories,
    public.students,
    public.student_licence_categories,
    public.instructor_profile_links,
    public.student_profile_links
FROM anon, authenticated, service_role;

-- ------------------------------------------------------------
-- Authenticated application users
-- ------------------------------------------------------------

GRANT SELECT, UPDATE
ON TABLE public.driving_schools
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.branches
TO authenticated;

GRANT SELECT, UPDATE
ON TABLE public.profiles
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.licence_categories
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.instructors
TO authenticated;

GRANT SELECT, INSERT, DELETE
ON TABLE public.instructor_licence_categories
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.students
TO authenticated;

GRANT SELECT, INSERT, DELETE
ON TABLE public.student_licence_categories
TO authenticated;

GRANT SELECT, INSERT, DELETE
ON TABLE public.instructor_profile_links
TO authenticated;

GRANT SELECT, INSERT, DELETE
ON TABLE public.student_profile_links
TO authenticated;


-- ------------------------------------------------------------
-- Trusted server-side Supabase client
-- ------------------------------------------------------------
--
-- service_role is reserved for trusted backend operations.
-- It must never be exposed to the frontend.
--

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE
    public.driving_schools,
    public.branches,
    public.profiles,
    public.licence_categories,
    public.instructors,
    public.instructor_licence_categories,
    public.students,
    public.student_licence_categories,
    public.instructor_profile_links,
    public.student_profile_links
TO service_role;

    -- ============================================================
-- Driving School Policies
-- ============================================================
-- All active authenticated users may read their own driving
-- school's information.
-- Only administrators may update their own driving school.
-- Creation/deletion of driving schools is reserved for trusted
-- backend/service-role onboarding processes.

CREATE POLICY driving_schools_select_own
ON public.driving_schools
FOR SELECT
TO authenticated
USING (
    id = private.current_driving_school_id()
);


CREATE POLICY driving_schools_update_admin
ON public.driving_schools
FOR UPDATE
TO authenticated
USING (
    id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
)
WITH CHECK (
    id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ============================================================
-- Branch Policies
-- ============================================================
-- Active users may view branches belonging to their own
-- driving school.
-- Administrators may create, update, and delete branches
-- within their own driving school.

CREATE POLICY branches_select_own_school
ON public.branches
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
);


CREATE POLICY branches_insert_admin
ON public.branches
FOR INSERT
TO authenticated
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


CREATE POLICY branches_update_admin
ON public.branches
FOR UPDATE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
)
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


CREATE POLICY branches_delete_admin
ON public.branches
FOR DELETE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);

-- ============================================================
-- Profile Policies
-- ============================================================
-- Every authenticated user may read their own profile.
--
-- Administrators may read and update profiles belonging to
-- their own driving school.
--
-- Profile creation is intentionally NOT exposed directly to
-- authenticated browser clients. It should be handled through
-- a trusted onboarding/backend flow.
--
-- Profile deletion is also intentionally not exposed.
-- Accounts should normally be disabled/suspended instead.

-- ------------------------------------------------------------
-- Read Own Profile
-- ------------------------------------------------------------

CREATE POLICY profiles_select_self
ON public.profiles
FOR SELECT
TO authenticated
USING (
    id = auth.uid()
);


-- ------------------------------------------------------------
-- Administrator: Read Profiles in Own School
-- ------------------------------------------------------------

CREATE POLICY profiles_select_admin_school
ON public.profiles
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Administrator: Update Profiles in Own School
-- ------------------------------------------------------------

CREATE POLICY profiles_update_admin_school
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
)
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);

-- ============================================================
-- Licence Category Policies
-- ============================================================
-- Active authenticated users may view licence categories
-- belonging to their own driving school.
--
-- Only administrators may create, update, or delete licence
-- categories for their own driving school.

CREATE POLICY licence_categories_select_own_school
ON public.licence_categories
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
);


CREATE POLICY licence_categories_insert_admin
ON public.licence_categories
FOR INSERT
TO authenticated
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


CREATE POLICY licence_categories_update_admin
ON public.licence_categories
FOR UPDATE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
)
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


CREATE POLICY licence_categories_delete_admin
ON public.licence_categories
FOR DELETE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);
-- ============================================================
-- Operational Identity Helpers
-- ============================================================
-- Resolves the authenticated user's operational instructor or
-- student record without exposing the profile-link tables.

CREATE OR REPLACE FUNCTION private.current_instructor_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT link.instructor_id
    FROM public.instructor_profile_links AS link
    JOIN public.profiles AS p
        ON p.id = link.profile_id
       AND p.driving_school_id = link.driving_school_id
    WHERE p.id = auth.uid()
      AND p.role = 'instructor'
      AND p.status = 'active'
    LIMIT 1;
$$;


CREATE OR REPLACE FUNCTION private.current_student_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT link.student_id
    FROM public.student_profile_links AS link
    JOIN public.profiles AS p
        ON p.id = link.profile_id
       AND p.driving_school_id = link.driving_school_id
    WHERE p.id = auth.uid()
      AND p.role = 'student'
      AND p.status = 'active'
    LIMIT 1;
$$;

REVOKE ALL ON FUNCTION private.current_instructor_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.current_student_id() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION private.current_instructor_id()
TO authenticated;

GRANT EXECUTE ON FUNCTION private.current_student_id()
TO authenticated;

-- ============================================================
-- Instructor Policies
-- ============================================================
-- Administrators may manage instructor records belonging to
-- their own driving school.
--
-- Active instructors may read only their own operational
-- instructor record.
--
-- Students receive no direct access to the full instructors
-- table because it contains sensitive operational information.


-- ------------------------------------------------------------
-- Administrator: Read Instructors in Own School
-- ------------------------------------------------------------

CREATE POLICY instructors_select_admin_school
ON public.instructors
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Instructor: Read Own Record
-- ------------------------------------------------------------

CREATE POLICY instructors_select_self
ON public.instructors
FOR SELECT
TO authenticated
USING (
    id = private.current_instructor_id()
    AND driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'instructor'
);


-- ------------------------------------------------------------
-- Administrator: Create Instructor
-- ------------------------------------------------------------

CREATE POLICY instructors_insert_admin
ON public.instructors
FOR INSERT
TO authenticated
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Administrator: Update Instructor
-- ------------------------------------------------------------

CREATE POLICY instructors_update_admin
ON public.instructors
FOR UPDATE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
)
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Administrator: Delete Instructor
-- ------------------------------------------------------------

CREATE POLICY instructors_delete_admin
ON public.instructors
FOR DELETE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);

-- ============================================================
-- Instructor Licence Category Policies
-- ============================================================
-- Administrators may view and manage instructor/category
-- assignments within their own driving school.
--
-- Instructors may view only their own licence-category
-- assignments.
--
-- Students receive no direct access to this junction table.


-- ------------------------------------------------------------
-- Administrator: Read Assignments in Own School
-- ------------------------------------------------------------

CREATE POLICY instructor_licence_categories_select_admin
ON public.instructor_licence_categories
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Instructor: Read Own Assignments
-- ------------------------------------------------------------

CREATE POLICY instructor_licence_categories_select_self
ON public.instructor_licence_categories
FOR SELECT
TO authenticated
USING (
    instructor_id = private.current_instructor_id()
    AND driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'instructor'
);


-- ------------------------------------------------------------
-- Administrator: Add Assignment
-- ------------------------------------------------------------

CREATE POLICY instructor_licence_categories_insert_admin
ON public.instructor_licence_categories
FOR INSERT
TO authenticated
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Administrator: Remove Assignment
-- ------------------------------------------------------------

CREATE POLICY instructor_licence_categories_delete_admin
ON public.instructor_licence_categories
FOR DELETE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);
-- ============================================================
-- Student Policies
-- ============================================================
-- Administrators may manage students belonging to their own
-- driving school.
--
-- Instructors may read students assigned to them as the
-- primary instructor.
--
-- Students may read only their own operational student record.


-- ------------------------------------------------------------
-- Administrator: Read Students in Own School
-- ------------------------------------------------------------

CREATE POLICY students_select_admin_school
ON public.students
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Instructor: Read Assigned Students
-- ------------------------------------------------------------

CREATE POLICY students_select_assigned_instructor
ON public.students
FOR SELECT
TO authenticated
USING (
    primary_instructor_id = private.current_instructor_id()
    AND driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'instructor'
);


-- ------------------------------------------------------------
-- Student: Read Own Record
-- ------------------------------------------------------------

CREATE POLICY students_select_self
ON public.students
FOR SELECT
TO authenticated
USING (
    id = private.current_student_id()
    AND driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'student'
);


-- ------------------------------------------------------------
-- Administrator: Create Student
-- ------------------------------------------------------------

CREATE POLICY students_insert_admin
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Administrator: Update Student
-- ------------------------------------------------------------

CREATE POLICY students_update_admin
ON public.students
FOR UPDATE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
)
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Administrator: Delete Student
-- ------------------------------------------------------------

CREATE POLICY students_delete_admin
ON public.students
FOR DELETE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);
-- ============================================================
-- Student Licence Category Policies
-- ============================================================
-- Administrators may view and manage student/category
-- assignments within their own driving school.
--
-- Students may view their own licence-category assignments.
--
-- Instructors may view licence-category assignments for
-- students currently assigned to them.


-- ------------------------------------------------------------
-- Administrator: Read Assignments in Own School
-- ------------------------------------------------------------

CREATE POLICY student_licence_categories_select_admin
ON public.student_licence_categories
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Student: Read Own Assignments
-- ------------------------------------------------------------

CREATE POLICY student_licence_categories_select_self
ON public.student_licence_categories
FOR SELECT
TO authenticated
USING (
    student_id = private.current_student_id()
    AND driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'student'
);


-- ------------------------------------------------------------
-- Instructor: Read Assigned Students' Categories
-- ------------------------------------------------------------

CREATE POLICY student_licence_categories_select_instructor
ON public.student_licence_categories
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'instructor'
    AND EXISTS (
        SELECT 1
        FROM public.students s
        WHERE s.id = student_id
          AND s.driving_school_id = student_licence_categories.driving_school_id
          AND s.primary_instructor_id = private.current_instructor_id()
    )
);


-- ------------------------------------------------------------
-- Administrator: Add Assignment
-- ------------------------------------------------------------

CREATE POLICY student_licence_categories_insert_admin
ON public.student_licence_categories
FOR INSERT
TO authenticated
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ------------------------------------------------------------
-- Administrator: Remove Assignment
-- ------------------------------------------------------------

CREATE POLICY student_licence_categories_delete_admin
ON public.student_licence_categories
FOR DELETE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);
-- ============================================================
-- Instructor Profile Link Policies
-- ============================================================
-- Only administrators may directly view or manage instructor
-- profile links within their own driving school.
--
-- Instructors do not require direct access to this table;
-- private.current_instructor_id() resolves their identity.

CREATE POLICY instructor_profile_links_select_admin
ON public.instructor_profile_links
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


CREATE POLICY instructor_profile_links_insert_admin
ON public.instructor_profile_links
FOR INSERT
TO authenticated
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
    AND EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = profile_id
          AND p.driving_school_id = instructor_profile_links.driving_school_id
          AND p.role = 'instructor'
          AND p.status = 'active'
    )
);


CREATE POLICY instructor_profile_links_delete_admin
ON public.instructor_profile_links
FOR DELETE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


-- ============================================================
-- Student Profile Link Policies
-- ============================================================
-- Only administrators may directly view or manage student
-- profile links within their own driving school.
--
-- Students do not require direct access to this table;
-- private.current_student_id() resolves their identity.

CREATE POLICY student_profile_links_select_admin
ON public.student_profile_links
FOR SELECT
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);


CREATE POLICY student_profile_links_insert_admin
ON public.student_profile_links
FOR INSERT
TO authenticated
WITH CHECK (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
    AND EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = profile_id
          AND p.driving_school_id = student_profile_links.driving_school_id
          AND p.role = 'student'
          AND p.status = 'active'
    )
);


CREATE POLICY student_profile_links_delete_admin
ON public.student_profile_links
FOR DELETE
TO authenticated
USING (
    driving_school_id = private.current_driving_school_id()
    AND private.current_app_role() = 'administrator'
);