import { useEffect, useState } from 'react'
import StudentForm from '../components/StudentForm'
import StudentLicenceEnrolment from '../components/StudentLicenceEnrolment'
import StudentTable from '../components/StudentTable'
import {
  createStudent,
  getStudents,
  setStudentActiveStatus,
} from '../services/studentService'
import type {
  CreateStudentInput,
  Student,
} from '../types/student'

interface StudentManagementPageProps {
  drivingSchoolId: string
}

function StudentManagementPage({
  drivingSchoolId,
}: StudentManagementPageProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [enrolmentStudent, setEnrolmentStudent] =
    useState<Student | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  )

  const [successMessage, setSuccessMessage] = useState<
    string | null
  >(null)

  useEffect(() => {
    let isCancelled = false

    getStudents()
      .then((data) => {
        if (isCancelled) {
          return
        }

        setStudents(data)
        setErrorMessage(null)
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return
        }

        console.error(error)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load students.',
        )
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  async function handleCreateStudent(
    input: CreateStudentInput,
  ) {
    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      const createdStudent = await createStudent(input)

      setStudents((current) =>
        [...current, createdStudent].sort((a, b) =>
          a.full_name.localeCompare(b.full_name),
        ),
      )

      setSuccessMessage('Student registered successfully.')
      setIsFormOpen(false)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to register student.'

      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleStatus(student: Student) {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      const updatedStudent = await setStudentActiveStatus(
        student.id,
        !student.is_active,
      )

      setStudents((current) =>
        current.map((item) =>
          item.id === updatedStudent.id
            ? updatedStudent
            : item,
        ),
      )

      setSuccessMessage(
        updatedStudent.is_active
          ? 'Student activated successfully.'
          : 'Student deactivated successfully.',
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to change student status.'

      setErrorMessage(message)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Student Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Register, view, search, and manage driving school
              students.
            </p>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null)
                setSuccessMessage(null)
                setEnrolmentStudent(null)
                setIsFormOpen(true)
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Student
            </button>
          )}
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {successMessage}
          </div>
        )}

        {isFormOpen && (
          <StudentForm
            drivingSchoolId={drivingSchoolId}
            isSubmitting={isSubmitting}
            onSubmit={handleCreateStudent}
            onCancel={() => {
              setIsFormOpen(false)
              setErrorMessage(null)
            }}
          />
        )}

        {enrolmentStudent && (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Managing licence categories for
                </p>

                <h2 className="text-lg font-semibold text-slate-900">
                  {enrolmentStudent.full_name}
                </h2>

                {enrolmentStudent.student_code && (
                  <p className="mt-1 text-sm text-slate-500">
                    Student Code: {enrolmentStudent.student_code}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setEnrolmentStudent(null)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <StudentLicenceEnrolment
              studentId={enrolmentStudent.id}
              drivingSchoolId={drivingSchoolId}
            />
          </section>
        )}
        <StudentTable
          students={students}
          isLoading={isLoading}
          onManageEnrolment={(student) => {
            setIsFormOpen(false)
            setErrorMessage(null)
            setSuccessMessage(null)
            setEnrolmentStudent(student)
          }}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </main>
  )
}

export default StudentManagementPage