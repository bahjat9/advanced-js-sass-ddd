import * as readline from "readline"
import { createStudentId, createCourseCode, createEmail, createCredits, createSemester, createEnrollmentId } from "./src/domain/types"
import { Student, Course, Enrollment } from "./src/domain/entities"
import { enrollStudent, cancelEnrollment } from "./src/domain/logic"
import { domainEvents, consoleLoggerObserver } from "./src/infrastructure/observer"

domainEvents.subscribe(consoleLoggerObserver)

const students: Student[] = [
    { id: createStudentId("STU111111"), email: createEmail("alice@university.edu") },
    { id: createStudentId("STU222222"), email: createEmail("bob@university.edu") },
    { id: createStudentId("STU333333"), email: createEmail("charlie@university.edu") }
]

const courses: Course[] = [
    { code: createCourseCode("CS101"), credits: createCredits(3), capacity: 2 }, 
    { code: createCourseCode("MATH202"), credits: createCredits(4), capacity: 5 } 
]

let enrollments: Enrollment[] = []

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function showMenu() {
    console.log("\n--- 🎓 University Enrollment CLI ---")
    console.log("1. View Students & Courses")
    console.log("2. Enroll Student")
    console.log("3. Cancel Enrollment")
    console.log("4. View Active Enrollments")
    console.log("5. Exit")
    rl.question("Choose an option: ", handleMenu)
}

function handleMenu(choice: string) {
    switch (choice) {
        case "1":
            console.log("\n[STUDENTS]:")
            students.forEach(s => console.log(`- ${s.id}`))
            console.log("\n[COURSES]:")
            courses.forEach(c => console.log(`- ${c.code} (Cap: ${c.capacity})`))
            showMenu()
            break
        case "2":
            rl.question("Student ID (e.g., STU111111): ", (sId) => {
                rl.question("Course Code (e.g., CS101): ", (cCode) => {
                    try {
                        const student = students.find(s => s.id === createStudentId(sId))
                        const course = courses.find(c => c.code === createCourseCode(cCode))
                        if (!student || !course) throw new Error("Student or Course not found.")
                        
                        const newEnr = enrollStudent(student, course, createSemester("Fall2024"), enrollments, courses)
                        enrollments.push(newEnr)
                    } catch (e: any) { console.log(`\n❌ ERROR: ${e.message}`) }
                    showMenu()
                })
            })
            break
        case "3":
            rl.question("Enter Enrollment ID to cancel (e.g., ENR-...): ", (id) => {
                try {
                    enrollments = cancelEnrollment(createEnrollmentId(id), enrollments)
                } catch (e: any) { console.log(`\n❌ ERROR: ${e.message}`) }
                showMenu()
            })
            break
        case "4":
            console.log("\n--- Enrollments ---")
            enrollments.forEach(e => console.log(`[${e.id}] ${e.studentId} -> ${e.courseCode}`))
            showMenu()
            break
        case "5":
            console.log("Goodbye!")
            rl.close()
            break
        default:
            showMenu()
    }
}

showMenu()