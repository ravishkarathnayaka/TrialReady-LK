-- ============================================================================
-- TrialReady LK - Comprehensive Cloud Database Seed Script
-- Driving Academy: Royal Driving Academy (Pvt) Ltd (DS-WP-2026-0042)
-- ============================================================================

-- 1. Driving School
INSERT INTO public.driving_schools (id, name, registration_number, email, phone, address, is_active)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Royal Driving Academy (Pvt) Ltd',
    'DS-WP-2026-0042',
    'info@royaldriving.lk',
    '+94 11 281 9000',
    'No. 142 High Level Road, Nugegoda, Colombo',
    true
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Branches
INSERT INTO public.branches (id, driving_school_id, name, phone, address, is_active)
VALUES 
(
    'ba111111-1111-1111-1111-111111111111',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Colombo Central (Nugegoda)',
    '+94 11 281 9001',
    'No. 142 High Level Road, Nugegoda',
    true
),
(
    'ba222222-2222-2222-2222-222222222222',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Gampaha Branch (Yakkala)',
    '+94 33 222 4110',
    'No. 88 Kandy Road, Yakkala, Gampaha',
    true
),
(
    'ba333333-3333-3333-3333-333333333333',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Kandy City Branch (Peradeniya)',
    '+94 81 238 7200',
    'No. 204 Peradeniya Road, Kandy',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 3. Licence Categories
INSERT INTO public.licence_categories (id, driving_school_id, code, name, description, is_active)
VALUES
(
    'ca111111-1111-1111-1111-111111111111',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'B',
    'Dual Purpose / Light Motor Car (Auto & Manual)',
    'Motor vehicles with seating capacity not exceeding 9 persons and gross weight up to 3,500 kg',
    true
),
(
    'ca222222-2222-2222-2222-222222222222',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'B1',
    'Light Motor Cycle & Three Wheeler',
    'Motor tricycles and light motorcycles',
    true
),
(
    'ca333333-3333-3333-3333-333333333333',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'A',
    'Heavy Motor Cycle (> 250cc)',
    'Motorcycles with engine capacity exceeding 250cc',
    true
),
(
    'ca444444-4444-4444-4444-444444444444',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'C',
    'Dual Control Heavy Commercial Truck',
    'Heavy motor lorries with gross vehicle weight exceeding 3,500 kg',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 4. Instructors
INSERT INTO public.instructors (id, driving_school_id, branch_id, employee_code, full_name, nic, phone, email, is_active)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba111111-1111-1111-1111-111111111111',
    'INS-WP-001',
    'Nimal Jayawardena',
    '197814209812',
    '+94 77 123 4567',
    'nimal@royaldriving.lk',
    true
),
(
    '11111111-1111-1111-1111-222222222222',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba111111-1111-1111-1111-111111111111',
    'Sunil Shantha',
    '198223104928',
    '+94 71 987 6543',
    'sunil@royaldriving.lk',
    true
),
(
    '11111111-1111-1111-1111-333333333333',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba222222-2222-2222-2222-222222222222',
    'Kasun Perera',
    '198934102914',
    '+94 76 543 2198',
    'kasun@royaldriving.lk',
    true
),
(
    '11111111-1111-1111-1111-444444444444',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba333333-3333-3333-3333-333333333333',
    'Mohamed Rizwan',
    '198512304910',
    '+94 72 345 6789',
    'rizwan@royaldriving.lk',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 5. Training Vehicles
INSERT INTO public.vehicles (id, driving_school_id, branch_id, licence_category_id, registration_number, display_name, manufacturer, model, year_of_manufacture, transmission_type, fuel_type, operational_status)
VALUES
(
    '22222222-2222-2222-2222-111111111111',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba111111-1111-1111-1111-111111111111',
    'ca111111-1111-1111-1111-111111111111',
    'WP CAB-4921',
    'Toyota Vitz Dual-Control',
    'Toyota',
    'Vitz Dual-Control',
    2018,
    'manual',
    'petrol',
    'active'
),
(
    '22222222-2222-2222-2222-222222222222',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba111111-1111-1111-1111-111111111111',
    'ca111111-1111-1111-1111-111111111111',
    'WP CBC-8821',
    'Suzuki Swift Auto Dual-Control',
    'Suzuki',
    'Swift Auto Dual-Control',
    2019,
    'automatic',
    'petrol',
    'active'
),
(
    '22222222-2222-2222-2222-333333333333',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba111111-1111-1111-1111-111111111111',
    'ca333333-3333-3333-3333-333333333333',
    'CP BC-3042',
    'Yamaha FZ 150 Training Bike',
    'Yamaha',
    'FZ 150 Training Bike',
    2020,
    'manual',
    'petrol',
    'active'
),
(
    '22222222-2222-2222-2222-444444444444',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba222222-2222-2222-2222-222222222222',
    'ca111111-1111-1111-1111-111111111111',
    'WP NA-1120',
    'Toyota HiAce Dual-Purpose Van',
    'Toyota',
    'HiAce Dual-Purpose Van',
    2017,
    'manual',
    'diesel',
    'active'
),
(
    '22222222-2222-2222-2222-555555555555',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba333333-3333-3333-3333-333333333333',
    'ca444444-4444-4444-4444-444444444444',
    'WP PB-6031',
    'Isuzu ELF Heavy Truck',
    'Isuzu',
    'ELF Heavy Dual-Control Truck',
    2016,
    'manual',
    'diesel',
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Students (5 Distinct DMT Readiness Personas)
INSERT INTO public.students (id, driving_school_id, branch_id, student_code, full_name, nic, phone, email, registration_date, is_active)
VALUES
(
    '33333333-3333-3333-3333-111111111111',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba111111-1111-1111-1111-111111111111',
    'ADM-2026-0101',
    'Amaya Fernando',
    '200178401923',
    '+94 77 456 7890',
    'amaya.fernando@gmail.com',
    '2026-05-10',
    true
),
(
    '33333333-3333-3333-3333-222222222222',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba111111-1111-1111-1111-111111111111',
    'ADM-2026-0102',
    'Ravindu Rathnayaka',
    '199923405812',
    '+94 71 234 5678',
    'ravindu.rathnayaka@gmail.com',
    '2026-06-01',
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba111111-1111-1111-1111-111111111111',
    'ADM-2026-0103',
    'Sanduni Wickramasinghe',
    '200265109432',
    '+94 76 890 1234',
    'sanduni.w@gmail.com',
    '2026-07-15',
    true
),
(
    '33333333-3333-3333-3333-444444444444',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba222222-2222-2222-2222-222222222222',
    'ADM-2026-0104',
    'Dinesh Perera',
    '199834208914',
    '+94 75 678 9012',
    'dinesh.perera@gmail.com',
    '2026-03-20',
    true
),
(
    '33333333-3333-3333-3333-555555555555',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ba333333-3333-3333-3333-333333333333',
    'ADM-2026-0105',
    'Kavindi Silva',
    '200384102941',
    '+94 78 901 2345',
    'kavindi.silva@gmail.com',
    '2026-08-20',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 7. Learner Permits (6-Month DMT Countdown)
INSERT INTO public.student_permits (driving_school_id, student_id, permit_number, issue_date, expiry_date, status, is_current)
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-111111111111', 'WP-992140', '2026-05-15', '2026-11-15', 'active', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-222222222222', 'WP-884102', '2026-06-05', '2026-12-05', 'active', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-333333333333', 'WP-772109', '2026-07-20', '2027-01-20', 'active', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-444444444444', 'WP-661203', '2026-03-25', '2026-09-17', 'active', true);

-- 8. NTMI Medical Fitness Records
INSERT INTO public.student_medical_records (driving_school_id, student_id, certificate_number, issued_date, expiry_date, ntmi_branch, status)
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-111111111111', 'MED-NTMI-9812', '2026-05-02', '2026-11-02', 'NTMI Nugegoda', 'passed'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-222222222222', 'MED-NTMI-8411', '2026-05-28', '2026-11-28', 'NTMI Werahera', 'passed'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-333333333333', 'MED-NTMI-7712', '2026-07-10', '2027-01-10', 'NTMI Colombo', 'passed'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-444444444444', 'MED-NTMI-6601', '2026-03-15', '2026-09-15', 'NTMI Gampaha', 'passed');

-- 9. Exam Trials (Theory & Practical)
INSERT INTO public.student_exam_trials (driving_school_id, student_id, exam_type, attempt_number, scheduled_date, status, score, location)
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-111111111111', 'theory', 1, '2026-05-20', 'passed', 92, 'DMT Werahera'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-222222222222', 'theory', 1, '2026-06-12', 'passed', 85, 'DMT Werahera'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-333333333333', 'theory', 1, '2026-07-25', 'passed', 78, 'DMT Werahera'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-444444444444', 'theory', 1, '2026-04-02', 'passed', 75, 'DMT Gampaha');

-- 10. Course Packages
INSERT INTO public.packages (id, driving_school_id, name, code, description, fee, practical_hours_included, theory_classes_included, is_active)
VALUES
(
    '44444444-4444-4444-4444-111111111111',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Comprehensive Dual-Control Car (Auto + Manual)',
    'PKG-CAR-01',
    'Full DMT syllabus, 15 on-road sessions, hill start, reverse S-bend, and trial day car provision',
    45000.00,
    15,
    5,
    true
),
(
    '44444444-4444-4444-4444-222222222222',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Motorcycle & Three-Wheeler Combo',
    'PKG-BIKE-02',
    'Complete training for Class A & B1 licences including slalom track practice',
    25000.00,
    10,
    3,
    true
),
(
    '44444444-4444-4444-4444-333333333333',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Commercial Heavy Vehicle Pro (Class C)',
    'PKG-HEAVY-03',
    'Dual control lorry training for heavy vehicle driver certification',
    65000.00,
    20,
    5,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 11. Student Package Enrolments
INSERT INTO public.student_package_enrolments (id, driving_school_id, student_id, package_id, agreed_total_fee, enrolled_date, status)
VALUES
('ea111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-111111111111', '44444444-4444-4444-4444-111111111111', 45000.00, '2026-05-10', 'active'),
('ea222222-2222-2222-2222-222222222222', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-222222222222', '44444444-4444-4444-4444-111111111111', 45000.00, '2026-06-01', 'active'),
('ea333333-3333-3333-3333-333333333333', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-111111111111', 45000.00, '2026-07-15', 'active'),
('ea444444-4444-4444-4444-444444444444', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-444444444444', '44444444-4444-4444-4444-111111111111', 45000.00, '2026-03-20', 'active')
ON CONFLICT (id) DO NOTHING;

-- 12. Student Payments & Receipts
INSERT INTO public.student_payments (driving_school_id, student_id, enrolment_id, amount, payment_date, payment_method, receipt_number, notes)
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-111111111111', 'ea111111-1111-1111-1111-111111111111', 25000.00, '2026-05-10', 'bank_transfer', 'REC-20260510-0101', 'Initial Registration & Medical Fee'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-111111111111', 'ea111111-1111-1111-1111-111111111111', 20000.00, '2026-07-15', 'cash', 'REC-20260715-0102', 'Final Settlement (Fully Paid)'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-222222222222', 'ea222222-2222-2222-2222-222222222222', 30000.00, '2026-06-01', 'card', 'REC-20260601-0201', '1st & 2nd Instalment'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-333333333333', 'ea333333-3333-3333-3333-333333333333', 20000.00, '2026-07-15', 'cash', 'REC-20260715-0301', 'Advance Fee Payment'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33333333-3333-3333-3333-444444444444', 'ea444444-4444-4444-4444-444444444444', 10000.00, '2026-03-20', 'cash', 'REC-20260320-0401', 'Initial Registration (Overdue balance)');

-- 13. Practical Driving Sessions
INSERT INTO public.practical_sessions (driving_school_id, branch_id, student_id, instructor_id, vehicle_id, licence_category_id, session_date, start_time, end_time, status, attendance_status, student_rating, skills_covered)
VALUES
-- Amaya (16 completed sessions, all maneuvers mastered)
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ba111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'ca111111-1111-1111-1111-111111111111', '2026-08-10', '08:00:00', '09:15:00', 'completed', 'present', 5, ARRAY['Clutch Control & Gears', 'Hill Start / Gradient']),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ba111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'ca111111-1111-1111-1111-111111111111', '2026-08-14', '08:00:00', '09:15:00', 'completed', 'present', 5, ARRAY['Parallel Parking', '3-Point Turn']),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ba111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'ca111111-1111-1111-1111-111111111111', '2026-08-18', '08:00:00', '09:15:00', 'completed', 'present', 5, ARRAY['Reverse S-Bend', 'Emergency Braking', 'Highway & City Traffic']),

-- Ravindu (12 completed sessions)
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ba111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-222222222222', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'ca111111-1111-1111-1111-111111111111', '2026-08-12', '10:00:00', '11:15:00', 'completed', 'present', 4, ARRAY['Hill Start / Gradient', 'Parallel Parking']),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ba111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-222222222222', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'ca111111-1111-1111-1111-111111111111', '2026-08-16', '10:00:00', '11:15:00', 'completed', 'present', 4, ARRAY['3-Point Turn', 'Lane Discipline & Roundabouts']),

-- Sanduni (6 completed sessions)
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ba111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'ca111111-1111-1111-1111-111111111111', '2026-08-20', '14:00:00', '15:15:00', 'completed', 'present', 4, ARRAY['Clutch Control & Gears', 'Road Signs & Signals']),

-- Today's Scheduled Sessions for Instructor Portal
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ba111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-111111111111', 'ca111111-1111-1111-1111-111111111111', CURRENT_DATE, '08:30:00', '09:45:00', 'scheduled', 'unmarked', NULL, ARRAY['Mock DMT Trial Simulation']),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ba111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-222222222222', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'ca111111-1111-1111-1111-111111111111', CURRENT_DATE, '10:00:00', '11:15:00', 'scheduled', 'unmarked', NULL, ARRAY['Reverse S-Bend', 'Hill Start / Gradient']),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ba111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-222222222222', '22222222-2222-2222-2222-222222222222', 'ca111111-1111-1111-1111-111111111111', CURRENT_DATE, '14:00:00', '15:15:00', 'scheduled', 'unmarked', NULL, ARRAY['Parallel Parking', '3-Point Turn']);

-- 14. Academy Announcements
INSERT INTO public.academy_announcements (driving_school_id, title, content, target_audience, is_pinned, author_name)
VALUES
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'DMT Werahera Practical Trial Ground Schedule',
    'Notice to all DMT practical driving candidates: Trial sessions at Werahera ground will proceed as scheduled on Tuesday and Thursday mornings. All candidates must present original NIC, DMT Permit, and NTMI medical slips.',
    'all',
    true,
    'Principal Instructor Nimal'
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Weekend Computerized Theory Mock Test Workshop',
    'Intensive Sri Lanka Highway Code practice sessions will be held every Saturday from 09:00 AM in the main audio-visual training hall.',
    'students',
    false,
    'Chief Theory Instructor'
);
