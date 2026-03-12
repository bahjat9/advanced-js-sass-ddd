import { Student, Course, Enrollment } from "./entities"
import { Semester, createEnrollmentId } from "./types"
import { observers } from "../infrastructure/observer"

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
    if (alreadyEnrolled) {
        throw new Error(`Duplicate Rule: Student ${student.id} is already enrolled in ${course.code}.`)
    }

    const courseEnrollmentCount = allEnrollments.filter(
        e => e.courseCode === course.code && e.semester === semester
    ).length
    if (courseEnrollmentCount >= course.capacity) {
        throw new Error(`Capacity Rule: Course ${course.code} is full!`)
    }

    const studentEnrollmentsThisSemester = allEnrollments.filter(
        e => e.studentId === student.id && e.semester === semester
    )
    
    let totalCredits: number = course.credits 
    for (const enrollment of studentEnrollmentsThisSemester) {
        const enrolledCourse = allCourses.find(c => c.code === enrollment.courseCode)
        if (enrolledCourse) {
            totalCredits += enrolledCourse.credits 
        }
    }
    
    if (totalCredits > 18) {
        throw new Error(`Credit Limit Rule: Adding ${course.credits} credits exceeds the 18-credit maximum.`)
    }

    const newEnrollment: Enrollment = {
        id: createEnrollmentId(`ENR${Date.now()}`), 
        studentId: student.id,
        courseCode: course.code,
        semester: semester
    }

    observers.forEach(observer => observer({
        type: "StudentEnrolled",
        studentId: student.id,
        courseCode: course.code,
        semester: semester
    }))

    return newEnrollment
}