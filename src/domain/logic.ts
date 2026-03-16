import { Student, Course, Enrollment } from "./entities"
import { Semester, createEnrollmentId, EnrollmentId } from "./types"
import { domainEvents } from "../infrastructure/observer"

export function enrollStudent(
    student: Student,
    course: Course,
    semester: Semester,
    allEnrollments: Enrollment[],
    allCourses: Course[]
): Enrollment {
    const alreadyEnrolled = allEnrollments.some(
        e => e.studentId === student.id && e.courseCode === course.code && e.semester === semester
    )
    if (alreadyEnrolled) throw new Error(`Duplicate Rule: Student ${student.id} is already enrolled in ${course.code}.`)

    const courseEnrollments = allEnrollments.filter(e => e.courseCode === course.code && e.semester === semester)
    const currentCount = courseEnrollments.length
    if (currentCount >= course.capacity) throw new Error(`Capacity Rule: Course ${course.code} is full!`)

    const studentEnrollmentsThisSemester = allEnrollments.filter(e => e.studentId === student.id && e.semester === semester)
    let totalCredits: number = course.credits 
    for (const enrollment of studentEnrollmentsThisSemester) {
        const enrolledCourse = allCourses.find(c => c.code === enrollment.courseCode)
        if (enrolledCourse) totalCredits += enrolledCourse.credits
    }
    if (totalCredits > 18) throw new Error(`Credit Limit Rule: Adding ${course.credits} credits exceeds the 18-credit maximum.`)

    const newEnrollment: Enrollment = {
        id: createEnrollmentId(`ENR-${Date.now()}`),
        studentId: student.id,
        courseCode: course.code,
        semester: semester
    }

    domainEvents.emit({ type: "StudentEnrolled", studentId: student.id, courseCode: course.code, semester: semester })

    const newCount = currentCount + 1
    if (newCount === course.capacity) {
        domainEvents.emit({ type: "CourseFull", courseCode: course.code })
    } else if (newCount / course.capacity >= 0.8) {
        domainEvents.emit({ type: "CourseCapacityReached", courseCode: course.code })
    }

    return newEnrollment
}

export function cancelEnrollment(enrollmentId: EnrollmentId, allEnrollments: Enrollment[]): Enrollment[] {
    const exists = allEnrollments.some(e => e.id === enrollmentId)
    if (!exists) throw new Error(`Cancel Failed: Enrollment ${enrollmentId} not found.`)
    
    domainEvents.emit({ type: "EnrollmentCancelled", enrollmentId })
    return allEnrollments.filter(e => e.id !== enrollmentId)
}