import { StudentId, CourseCode, Semester, EnrollmentId } from "./types"

export type StudentEnrolledEvent = { type: "StudentEnrolled", studentId: StudentId, courseCode: CourseCode, semester: Semester }
export type CourseCapacityReachedEvent = { type: "CourseCapacityReached", courseCode: CourseCode }
export type CourseFullEvent = { type: "CourseFull", courseCode: CourseCode }
export type EnrollmentCancelledEvent = { type: "EnrollmentCancelled", enrollmentId: EnrollmentId }

export type DomainEvent = 
    | StudentEnrolledEvent 
    | CourseCapacityReachedEvent 
    | CourseFullEvent 
    | EnrollmentCancelledEvent