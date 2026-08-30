import { supabase } from '../../../lib/supabase'

export interface SeedProgressCallback {
  (step: string, percentage: number): void
}

export async function seedDemoAcademyData(
  drivingSchoolId: string,
  onProgress?: SeedProgressCallback,
): Promise<{ success: boolean; message: string }> {
  try {
    onProgress?.('Initializing Driving School & Branches...', 15)

    // 1. Branches
    const branches = [
      {
        id: 'b1111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        name: 'Colombo Central (Nugegoda)',
        code: 'COL-01',
        phone: '+94 11 281 9001',
        address: 'No. 142 High Level Road, Nugegoda',
        is_active: true,
      },
      {
        id: 'b2222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        name: 'Gampaha Branch (Yakkala)',
        code: 'GAM-02',
        phone: '+94 33 222 4110',
        address: 'No. 88 Kandy Road, Yakkala, Gampaha',
        is_active: true,
      },
      {
        id: 'b3333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        name: 'Kandy City Branch (Peradeniya)',
        code: 'KAN-03',
        phone: '+94 81 238 7200',
        address: 'No. 204 Peradeniya Road, Kandy',
        is_active: true,
      },
    ]

    await supabase.from('branches').upsert(branches, { onConflict: 'id' })

    onProgress?.('Seeding Licence Categories & Training Fleet...', 30)

    // 2. Licence Categories
    const categories = [
      {
        id: 'c1111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        code: 'B',
        name: 'Dual Purpose / Light Motor Car (Auto & Manual)',
        description: 'Cars up to 3,500 kg gross weight',
        is_active: true,
      },
      {
        id: 'c2222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        code: 'B1',
        name: 'Light Motor Cycle & Three Wheeler',
        description: 'Tricycles and light motor bikes',
        is_active: true,
      },
    ]
    await supabase
      .from('licence_categories')
      .upsert(categories, { onConflict: 'id' })

    // 3. Vehicles
    const vehicles = [
      {
        id: 'v1111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        branch_id: 'b1111111-1111-1111-1111-111111111111',
        registration_number: 'WP CAB-4921',
        make: 'Toyota',
        model: 'Vitz Dual-Control',
        year: 2018,
        transmission_type: 'Manual',
        fuel_type: 'Petrol',
        is_active: true,
      },
      {
        id: 'v2222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        branch_id: 'b1111111-1111-1111-1111-111111111111',
        registration_number: 'WP CBC-8821',
        make: 'Suzuki',
        model: 'Swift Auto Dual-Control',
        year: 2019,
        transmission_type: 'Automatic',
        fuel_type: 'Petrol',
        is_active: true,
      },
      {
        id: 'v3333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        branch_id: 'b1111111-1111-1111-1111-111111111111',
        registration_number: 'CP BC-3042',
        make: 'Yamaha',
        model: 'FZ 150cc Training Bike',
        year: 2020,
        transmission_type: 'Manual',
        fuel_type: 'Petrol',
        is_active: true,
      },
    ]
    await supabase.from('vehicles').upsert(vehicles, { onConflict: 'id' })

    onProgress?.('Seeding Certified Driving Instructors...', 50)

    // 4. Instructors
    const instructors = [
      {
        id: 'i1111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        branch_id: 'b1111111-1111-1111-1111-111111111111',
        full_name: 'Nimal Jayawardena',
        staff_number: 'INS-WP-001',
        nic: '197814209812',
        phone: '+94 77 123 4567',
        email: 'nimal@royaldriving.lk',
        is_active: true,
      },
      {
        id: 'i2222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        branch_id: 'b1111111-1111-1111-1111-111111111111',
        full_name: 'Sunil Shantha',
        staff_number: 'INS-WP-002',
        nic: '198223104928',
        phone: '+94 71 987 6543',
        email: 'sunil@royaldriving.lk',
        is_active: true,
      },
    ]
    await supabase.from('instructors').upsert(instructors, { onConflict: 'id' })

    onProgress?.('Creating 4 AI Readiness Student Personas...', 70)

    // 5. Students
    const students = [
      {
        id: 's1111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        branch_id: 'b1111111-1111-1111-1111-111111111111',
        full_name: 'Amaya Fernando',
        admission_number: 'ADM-2026-0101',
        nic_passport: '200178401923',
        phone: '+94 77 456 7890',
        email: 'amaya.fernando@gmail.com',
        registration_date: '2026-05-10',
        is_active: true,
      },
      {
        id: 's2222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        branch_id: 'b1111111-1111-1111-1111-111111111111',
        full_name: 'Ravindu Rathnayaka',
        admission_number: 'ADM-2026-0102',
        nic_passport: '199923405812',
        phone: '+94 71 234 5678',
        email: 'ravindu.rathnayaka@gmail.com',
        registration_date: '2026-06-01',
        is_active: true,
      },
      {
        id: 's3333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        branch_id: 'b1111111-1111-1111-1111-111111111111',
        full_name: 'Sanduni Wickramasinghe',
        admission_number: 'ADM-2026-0103',
        nic_passport: '200265109432',
        phone: '+94 76 890 1234',
        email: 'sanduni.w@gmail.com',
        registration_date: '2026-07-15',
        is_active: true,
      },
      {
        id: 's4444444-4444-4444-4444-444444444444',
        driving_school_id: drivingSchoolId,
        branch_id: 'b1111111-1111-1111-1111-111111111111',
        full_name: 'Dinesh Perera',
        admission_number: 'ADM-2026-0104',
        nic_passport: '199834208914',
        phone: '+94 75 678 9012',
        email: 'dinesh.perera@gmail.com',
        registration_date: '2026-03-20',
        is_active: true,
      },
    ]
    await supabase.from('students').upsert(students, { onConflict: 'id' })

    onProgress?.('Configuring Permits, Packages & Payments...', 90)

    // 6. Packages
    const packages = [
      {
        id: 'pkg11111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        name: 'Comprehensive Dual-Control Car (Auto + Manual)',
        description: 'Full DMT syllabus with hill start, reverse S-bend, and trial car',
        total_fee: 45000,
        practical_sessions_included: 15,
        is_active: true,
      },
    ]
    await supabase.from('packages').upsert(packages, { onConflict: 'id' })

    // 7. Enrolments & Payments
    const enrolments = [
      {
        id: 'e1111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        student_id: 's1111111-1111-1111-1111-111111111111',
        package_id: 'pkg11111-1111-1111-1111-111111111111',
        agreed_fee: 45000,
        enrolment_date: '2026-05-10',
        status: 'active',
      },
    ]
    await supabase
      .from('student_package_enrolments')
      .upsert(enrolments, { onConflict: 'id' })

    const payments = [
      {
        driving_school_id: drivingSchoolId,
        student_id: 's1111111-1111-1111-1111-111111111111',
        package_enrolment_id: 'e1111111-1111-1111-1111-111111111111',
        amount: 45000,
        payment_date: '2026-05-10',
        payment_method: 'bank_transfer',
        receipt_number: 'REC-20260510-0101',
        notes: 'Full Settlement (Fully Paid)',
      },
    ]
    await supabase.from('student_payments').insert(payments)

    onProgress?.('Done! Academy Demo Data is ready.', 100)
    return {
      success: true,
      message: 'Royal Driving Academy demo dataset successfully loaded!',
    }
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Failed to seed demo data.'
    return { success: false, message: errorMsg }
  }
}
