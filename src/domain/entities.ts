import { StudentId, CourseCode, Email, Credits, Semester, EnrollmentId } from "./types"


export type Student = {
    readonly id: StudentId
    readonly email: Email
}

export type Course = {
    readonly code: CourseCode
    readonly credits: Credits
    readonly capacity: number
}

export type Enrollment = {
    readonly id: EnrollmentId
    readonly studentId: StudentId
    readonly courseCode: CourseCode
    readonly semester: Semester
}