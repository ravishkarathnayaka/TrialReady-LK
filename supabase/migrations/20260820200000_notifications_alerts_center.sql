-- Migration: 20260820200000_notifications_alerts_center.sql
-- Description: Automated alerts, SMS/WhatsApp simulated notifications, and Academy Notice Board

-- 1. Table: public.notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('student', 'instructor', 'all_students', 'all_staff')),
    recipient_id UUID,

    type TEXT NOT NULL CHECK (type IN (
        'permit_expiring',
        'medical_expiring',
        'session_reminder',
        'payment_due',
        'trial_scheduled',
        'announcement'
    )),

    title TEXT NOT NULL,
    message TEXT NOT NULL,

    channel TEXT NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app', 'sms', 'whatsapp', 'email')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),

    action_url TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- 2. Table: public.academy_announcements
CREATE TABLE IF NOT EXISTS public.academy_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,
    content TEXT NOT NULL,

    target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'instructors')),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    author_name TEXT NOT NULL DEFAULT 'School Management',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_school_status
    ON public.notifications(driving_school_id, status);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient
    ON public.notifications(driving_school_id, recipient_id);

CREATE INDEX IF NOT EXISTS idx_announcements_school
    ON public.academy_announcements(driving_school_id, is_pinned);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_announcements ENABLE ROW LEVEL SECURITY;

-- 5. Multi-Tenant RLS Policies
-- Notifications
DROP POLICY IF EXISTS "notifications_all_policy" ON public.notifications;
CREATE POLICY "notifications_all_policy" ON public.notifications
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

-- Announcements
DROP POLICY IF EXISTS "announcements_all_policy" ON public.academy_announcements;
CREATE POLICY "announcements_all_policy" ON public.academy_announcements
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
