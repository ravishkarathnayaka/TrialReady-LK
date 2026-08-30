export type TimeRangeFilter =
  | '30_days'
  | '90_days'
  | 'year_to_date'
  | 'all_time'

export interface CommonFailurePoint {
  reason: string
  count: number
  percentage: number
}

export interface DmtTrialAnalytics {
  totalTrials: number
  passedTrials: number
  failedTrials: number
  overallPassRate: number
  firstAttemptPassRate: number
  repeatAttemptPassRate: number
  commonFailurePoints: CommonFailurePoint[]
}

export interface InstructorPerformanceMetric {
  id: string
  name: string
  staffNumber: string
  assignedStudentsCount: number
  completedSessionsCount: number
  totalHoursConducted: number
  trialsPresented: number
  trialsPassed: number
  trialPassRate: number
  averageStudentRating: number
}

export interface FleetUtilizationMetric {
  id: string
  registrationNumber: string
  makeModel: string
  transmissionType: string
  completedSessionsCount: number
  totalHoursDriven: number
  utilizationRate: number
  maintenanceExpenses: number
}

export interface MonthlyRevenuePoint {
  month: string
  amount: number
}

export interface RevenueAnalytics {
  totalEnrolledFees: number
  totalRevenueCollected: number
  totalOutstandingBalance: number
  collectionEfficiencyPercentage: number
  averageRevenuePerStudent: number
  monthlyRevenue: MonthlyRevenuePoint[]
}

export interface ExecutiveKpiSummary {
  trialAnalytics: DmtTrialAnalytics
  instructors: InstructorPerformanceMetric[]
  fleet: FleetUtilizationMetric[]
  revenue: RevenueAnalytics
  activeStudentsCount: number
  totalSessionsConducted: number
}
