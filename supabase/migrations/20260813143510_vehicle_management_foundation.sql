-- TrialReady LK
-- Vehicle Management and Availability foundation
-- Issue #14

CREATE TYPE public.vehicle_operational_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'out_of_service'
);

CREATE TYPE public.vehicle_availability_status AS ENUM (
    'available',
    'unavailable',
    'in_maintenance'
);

CREATE TYPE public.vehicle_maintenance_status AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled'
);

CREATE TYPE public.vehicle_transmission_type AS ENUM (
    'manual',
    'automatic',
    'semi_automatic',
    'other'
);

CREATE TYPE public.vehicle_fuel_type AS ENUM (
    'petrol',
    'diesel',
    'hybrid',
    'electric',
    'other'
);

CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    driving_school_id UUID NOT NULL,
    branch_id UUID,
    licence_category_id UUID NOT NULL,

    registration_number TEXT NOT NULL,
    display_name TEXT,
    manufacturer TEXT NOT NULL,
    model TEXT NOT NULL,
    year_of_manufacture INTEGER,

    transmission_type public.vehicle_transmission_type NOT NULL,
    fuel_type public.vehicle_fuel_type,

    photo_path TEXT,

    date_added DATE NOT NULL DEFAULT CURRENT_DATE,
    training_use_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    operational_status public.vehicle_operational_status
        NOT NULL DEFAULT 'active',

    availability_status public.vehicle_availability_status
        NOT NULL DEFAULT 'available',

    current_odometer_km INTEGER,
    next_service_date DATE,

    internal_notes TEXT,

    deactivation_reason TEXT,
    deactivated_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT vehicles_id_school_unique
        UNIQUE (id, driving_school_id),

    CONSTRAINT vehicles_driving_school_id_fkey
        FOREIGN KEY (driving_school_id)
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    CONSTRAINT vehicles_branch_school_fk
        FOREIGN KEY (branch_id, driving_school_id)
        REFERENCES public.branches(id, driving_school_id),

    CONSTRAINT vehicles_category_school_fk
        FOREIGN KEY (licence_category_id, driving_school_id)
        REFERENCES public.licence_categories(id, driving_school_id),

    CONSTRAINT vehicles_registration_number_not_empty
        CHECK (length(trim(registration_number)) > 0),

    CONSTRAINT vehicles_manufacturer_not_empty
        CHECK (length(trim(manufacturer)) > 0),

    CONSTRAINT vehicles_model_not_empty
        CHECK (length(trim(model)) > 0),

    CONSTRAINT vehicles_year_of_manufacture_check
        CHECK (
            year_of_manufacture IS NULL
            OR year_of_manufacture BETWEEN 1900 AND 2100
        ),

    CONSTRAINT vehicles_odometer_check
        CHECK (
            current_odometer_km IS NULL
            OR current_odometer_km >= 0
        ),

    CONSTRAINT vehicles_operational_availability_check
        CHECK (
            operational_status = 'active'
            OR availability_status <> 'available'
        ),

    CONSTRAINT vehicles_training_availability_check
        CHECK (
            training_use_enabled = TRUE
            OR availability_status <> 'available'
        )
);

CREATE UNIQUE INDEX vehicles_school_registration_unique
    ON public.vehicles (
        driving_school_id,
        upper(trim(registration_number))
    );

CREATE INDEX idx_vehicles_driving_school
    ON public.vehicles(driving_school_id);

CREATE INDEX idx_vehicles_branch
    ON public.vehicles(branch_id);

CREATE INDEX idx_vehicles_licence_category
    ON public.vehicles(licence_category_id);

CREATE INDEX idx_vehicles_operational_status
    ON public.vehicles(driving_school_id, operational_status);

CREATE INDEX idx_vehicles_availability_status
    ON public.vehicles(driving_school_id, availability_status);

CREATE INDEX idx_vehicles_next_service_date
    ON public.vehicles(next_service_date);

CREATE TRIGGER set_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

    CREATE TYPE public.vehicle_document_type AS ENUM (
    'insurance',
    'revenue_licence',
    'other'
);

CREATE TABLE public.vehicle_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    vehicle_id UUID NOT NULL,
    driving_school_id UUID NOT NULL,

    document_type public.vehicle_document_type NOT NULL,
    document_name TEXT,
    reference_number TEXT,

    issue_date DATE,
    expiry_date DATE,

    file_path TEXT,
    notes TEXT,

    is_current BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT vehicle_documents_vehicle_school_fk
        FOREIGN KEY (vehicle_id, driving_school_id)
        REFERENCES public.vehicles(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT vehicle_documents_driving_school_id_fkey
        FOREIGN KEY (driving_school_id)
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    CONSTRAINT vehicle_documents_date_order_check
        CHECK (
            issue_date IS NULL
            OR expiry_date IS NULL
            OR expiry_date >= issue_date
        ),

    CONSTRAINT vehicle_documents_other_name_check
        CHECK (
            document_type <> 'other'
            OR length(trim(COALESCE(document_name, ''))) > 0
        )
);

CREATE UNIQUE INDEX vehicle_documents_current_unique
    ON public.vehicle_documents (
        vehicle_id,
        document_type,
        COALESCE(lower(trim(document_name)), '')
    )
    WHERE is_current = TRUE;

CREATE INDEX idx_vehicle_documents_vehicle
    ON public.vehicle_documents(vehicle_id);

CREATE INDEX idx_vehicle_documents_school
    ON public.vehicle_documents(driving_school_id);

CREATE INDEX idx_vehicle_documents_expiry
    ON public.vehicle_documents(expiry_date)
    WHERE is_current = TRUE;

CREATE TRIGGER set_vehicle_documents_updated_at
    BEFORE UPDATE ON public.vehicle_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

    CREATE TABLE public.vehicle_maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    vehicle_id UUID NOT NULL,
    driving_school_id UUID NOT NULL,

    maintenance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    maintenance_type TEXT NOT NULL,
    description TEXT NOT NULL,

    service_provider TEXT,
    cost NUMERIC(12, 2),
    odometer_reading_km INTEGER,

    status public.vehicle_maintenance_status
        NOT NULL DEFAULT 'scheduled',

    next_recommended_service_date DATE,
    unavailable_from TIMESTAMPTZ,
    unavailable_until TIMESTAMPTZ,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT vehicle_maintenance_records_id_school_unique
        UNIQUE (id, driving_school_id),

    CONSTRAINT vehicle_maintenance_records_vehicle_school_fk
        FOREIGN KEY (vehicle_id, driving_school_id)
        REFERENCES public.vehicles(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT vehicle_maintenance_records_school_fk
        FOREIGN KEY (driving_school_id)
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    CONSTRAINT vehicle_maintenance_type_not_empty
        CHECK (length(trim(maintenance_type)) > 0),

    CONSTRAINT vehicle_maintenance_description_not_empty
        CHECK (length(trim(description)) > 0),

    CONSTRAINT vehicle_maintenance_cost_check
        CHECK (
            cost IS NULL
            OR cost >= 0
        ),

    CONSTRAINT vehicle_maintenance_odometer_check
        CHECK (
            odometer_reading_km IS NULL
            OR odometer_reading_km >= 0
        ),

    CONSTRAINT vehicle_maintenance_unavailable_period_check
        CHECK (
            unavailable_from IS NULL
            OR unavailable_until IS NULL
            OR unavailable_until > unavailable_from
        ),

    CONSTRAINT vehicle_maintenance_next_service_check
        CHECK (
            next_recommended_service_date IS NULL
            OR next_recommended_service_date >= maintenance_date
        )
);

CREATE INDEX idx_vehicle_maintenance_vehicle
    ON public.vehicle_maintenance_records(vehicle_id);

CREATE INDEX idx_vehicle_maintenance_school
    ON public.vehicle_maintenance_records(driving_school_id);

CREATE INDEX idx_vehicle_maintenance_date
    ON public.vehicle_maintenance_records(
        driving_school_id,
        maintenance_date DESC
    );

CREATE INDEX idx_vehicle_maintenance_status
    ON public.vehicle_maintenance_records(
        driving_school_id,
        status
    );

CREATE INDEX idx_vehicle_maintenance_next_service
    ON public.vehicle_maintenance_records(
        next_recommended_service_date
    );

CREATE TRIGGER set_vehicle_maintenance_records_updated_at
    BEFORE UPDATE ON public.vehicle_maintenance_records
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

    ALTER TABLE public.vehicle_maintenance_records
    ADD CONSTRAINT vehicle_maintenance_records_id_vehicle_school_unique
    UNIQUE (id, vehicle_id, driving_school_id);

CREATE TABLE public.vehicle_availability_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    vehicle_id UUID NOT NULL,
    driving_school_id UUID NOT NULL,
    maintenance_record_id UUID,

    availability_status public.vehicle_availability_status NOT NULL,

    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,

    reason TEXT,
    notes TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT vehicle_availability_periods_id_school_unique
        UNIQUE (id, driving_school_id),

    CONSTRAINT vehicle_availability_periods_vehicle_school_fk
        FOREIGN KEY (vehicle_id, driving_school_id)
        REFERENCES public.vehicles(id, driving_school_id)
        ON DELETE CASCADE,

    CONSTRAINT vehicle_availability_periods_maintenance_fk
        FOREIGN KEY (
            maintenance_record_id,
            vehicle_id,
            driving_school_id
        )
        REFERENCES public.vehicle_maintenance_records(
            id,
            vehicle_id,
            driving_school_id
        )
        ON DELETE CASCADE,

    CONSTRAINT vehicle_availability_periods_school_fk
        FOREIGN KEY (driving_school_id)
        REFERENCES public.driving_schools(id)
        ON DELETE CASCADE,

    CONSTRAINT vehicle_availability_periods_time_check
        CHECK (
            ends_at IS NULL
            OR ends_at > starts_at
        ),

    CONSTRAINT vehicle_availability_periods_reason_check
        CHECK (
            availability_status = 'available'
            OR length(trim(COALESCE(reason, ''))) > 0
        )
);

CREATE INDEX idx_vehicle_availability_periods_vehicle
    ON public.vehicle_availability_periods(vehicle_id);

CREATE INDEX idx_vehicle_availability_periods_school
    ON public.vehicle_availability_periods(driving_school_id);

CREATE INDEX idx_vehicle_availability_periods_time
    ON public.vehicle_availability_periods(
        vehicle_id,
        starts_at,
        ends_at
    )
    WHERE is_active = TRUE;

CREATE INDEX idx_vehicle_availability_periods_status
    ON public.vehicle_availability_periods(
        driving_school_id,
        availability_status
    )
    WHERE is_active = TRUE;

CREATE INDEX idx_vehicle_availability_periods_maintenance
    ON public.vehicle_availability_periods(maintenance_record_id)
    WHERE maintenance_record_id IS NOT NULL;

CREATE TRIGGER set_vehicle_availability_periods_updated_at
    BEFORE UPDATE ON public.vehicle_availability_periods
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

    -- =========================================================
-- Row-Level Security
-- =========================================================

ALTER TABLE public.vehicles
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.vehicle_documents
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.vehicle_maintenance_records
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.vehicle_availability_periods
    ENABLE ROW LEVEL SECURITY;


-- =========================================================
-- Vehicles policies
-- =========================================================

CREATE POLICY vehicles_select_admin
    ON public.vehicles
    FOR SELECT
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );

CREATE POLICY vehicles_select_instructor
    ON public.vehicles
    FOR SELECT
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'instructor'::public.app_role
    );

CREATE POLICY vehicles_insert_admin
    ON public.vehicles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );

CREATE POLICY vehicles_update_admin
    ON public.vehicles
    FOR UPDATE
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    )
    WITH CHECK (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );


-- =========================================================
-- Vehicle-document policies
-- Administrative information: administrator only
-- =========================================================

CREATE POLICY vehicle_documents_select_admin
    ON public.vehicle_documents
    FOR SELECT
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );

CREATE POLICY vehicle_documents_insert_admin
    ON public.vehicle_documents
    FOR INSERT
    TO authenticated
    WITH CHECK (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );

CREATE POLICY vehicle_documents_update_admin
    ON public.vehicle_documents
    FOR UPDATE
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    )
    WITH CHECK (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );


-- =========================================================
-- Maintenance policies
-- Historical records cannot be deleted through normal access
-- =========================================================

CREATE POLICY vehicle_maintenance_select_admin
    ON public.vehicle_maintenance_records
    FOR SELECT
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );

CREATE POLICY vehicle_maintenance_insert_admin
    ON public.vehicle_maintenance_records
    FOR INSERT
    TO authenticated
    WITH CHECK (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );

CREATE POLICY vehicle_maintenance_update_admin
    ON public.vehicle_maintenance_records
    FOR UPDATE
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    )
    WITH CHECK (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );


-- =========================================================
-- Vehicle-availability policies
-- Administrators manage; instructors receive read-only access
-- =========================================================

CREATE POLICY vehicle_availability_select_admin
    ON public.vehicle_availability_periods
    FOR SELECT
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );

CREATE POLICY vehicle_availability_select_instructor
    ON public.vehicle_availability_periods
    FOR SELECT
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'instructor'::public.app_role
    );

CREATE POLICY vehicle_availability_insert_admin
    ON public.vehicle_availability_periods
    FOR INSERT
    TO authenticated
    WITH CHECK (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );

CREATE POLICY vehicle_availability_update_admin
    ON public.vehicle_availability_periods
    FOR UPDATE
    TO authenticated
    USING (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    )
    WITH CHECK (
        driving_school_id = private.current_driving_school_id()
        AND private.current_app_role() =
            'administrator'::public.app_role
    );


-- =========================================================
-- Table privileges
-- RLS provides the final authorization boundary
-- =========================================================

REVOKE ALL ON TABLE public.vehicles FROM anon;
REVOKE ALL ON TABLE public.vehicle_documents FROM anon;
REVOKE ALL ON TABLE public.vehicle_maintenance_records FROM anon;
REVOKE ALL ON TABLE public.vehicle_availability_periods FROM anon;

GRANT SELECT, INSERT, UPDATE
    ON TABLE public.vehicles
    TO authenticated;

GRANT SELECT, INSERT, UPDATE
    ON TABLE public.vehicle_documents
    TO authenticated;

GRANT SELECT, INSERT, UPDATE
    ON TABLE public.vehicle_maintenance_records
    TO authenticated;

GRANT SELECT, INSERT, UPDATE
    ON TABLE public.vehicle_availability_periods
    TO authenticated;