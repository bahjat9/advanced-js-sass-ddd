import { StudentId, CourseCode, Semester } from "./types"

export type StudentEnrolledEvent = {
    readonly type: "StudentEnrolled"
    readonly studentId: StudentId
    readonly courseCode: CourseCode
    readonly semester: Semester
}

export type DomainEvent = StudentEnrolledEvent