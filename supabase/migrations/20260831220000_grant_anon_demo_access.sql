-- Migration: 20260831220000_grant_anon_demo_access.sql
-- Description: Grant anon permissions and public read policies for live demonstration

-- 1. Schema Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 2. Anon Demo RLS Policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "anon_select_driving_schools" ON public.driving_schools;
    CREATE POLICY "anon_select_driving_schools" ON public.driving_schools FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_branches" ON public.branches;
    CREATE POLICY "anon_select_branches" ON public.branches FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_licence_categories" ON public.licence_categories;
    CREATE POLICY "anon_select_licence_categories" ON public.licence_categories FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_instructors" ON public.instructors;
    CREATE POLICY "anon_select_instructors" ON public.instructors FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_vehicles" ON public.vehicles;
    CREATE POLICY "anon_select_vehicles" ON public.vehicles FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_students" ON public.students;
    CREATE POLICY "anon_select_students" ON public.students FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_student_permits" ON public.student_permits;
    CREATE POLICY "anon_select_student_permits" ON public.student_permits FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_student_medical" ON public.student_medical_records;
    CREATE POLICY "anon_select_student_medical" ON public.student_medical_records FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_student_exams" ON public.student_exam_trials;
    CREATE POLICY "anon_select_student_exams" ON public.student_exam_trials FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_packages" ON public.packages;
    CREATE POLICY "anon_select_packages" ON public.packages FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_enrolments" ON public.student_package_enrolments;
    CREATE POLICY "anon_select_enrolments" ON public.student_package_enrolments FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_payments" ON public.student_payments;
    CREATE POLICY "anon_select_payments" ON public.student_payments FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_sessions" ON public.practical_sessions;
    CREATE POLICY "anon_select_sessions" ON public.practical_sessions FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_readiness" ON public.student_readiness_evaluations;
    CREATE POLICY "anon_select_readiness" ON public.student_readiness_evaluations FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_mock_exams" ON public.student_mock_exam_attempts;
    CREATE POLICY "anon_select_mock_exams" ON public.student_mock_exam_attempts FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_notifications" ON public.notifications;
    CREATE POLICY "anon_select_notifications" ON public.notifications FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "anon_select_announcements" ON public.academy_announcements;
    CREATE POLICY "anon_select_announcements" ON public.academy_announcements FOR SELECT TO anon USING (true);
END $$;
