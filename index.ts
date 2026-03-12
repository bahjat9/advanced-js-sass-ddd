import * as readline from "readline"
import { createStudentId, createCourseCode, createEmail, createCredits, createSemester } from "./src/domain/types"
import { Student, Course, Enrollment } from "./src/domain/entities"
import { enrollStudent } from "./src/domain/logic"
import { emailStudentObserver, observers } from "./src/infrastructure/observer"

observers.push(emailStudentObserver)

const students: Student[] = [
    { id: createStudentId("STU123456"), email: createEmail("alice@university.edu") },
    { id: createStudentId("STU987654"), email: createEmail("bob@university.edu") }
]

const courses: Course[] = [
    { code: createCourseCode("CS101"), credits: createCredits(3), capacity: 2 },
    { code: createCourseCode("MATH202"), credits: createCredits(4), capacity: 30 },
    { code: createCourseCode("PHYS303"), credits: createCredits(6), capacity: 20 }
]

const enrollments: Enrollment[] = []

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function showMenu() {
    console.log("\n--- 🎓 University Enrollment System ---")
    console.log("1. View Students")
    console.log("2. View Courses")
    console.log("3. Enroll Student in Course")
    console.log("4. View Enrollments")
    console.log("5. Exit")
    rl.question("Choose an option: ", handleMenu)
}

function handleMenu(choice: string) {
    switch (choice) {
        case "1":
            console.log("\n--- Students ---")
            students.forEach(s => console.log(`${s.id} - ${s.email}`))
            showMenu()
            break
        case "2":
            console.log("\n--- Courses ---")
            courses.forEach(c => console.log(`${c.code} (${c.credits} credits, Capacity: ${c.capacity})`))
            showMenu()
            break
        case "3":
            promptEnrollment()
            break
        case "4":
            console.log("\n--- Enrollments ---")
            if (enrollments.length === 0) console.log("No enrollments yet.")
            enrollments.forEach(e => console.log(`${e.id}: ${e.studentId} -> ${e.courseCode} (${e.semester})`))
            showMenu()
            break
        case "5":
            console.log("Exiting... Have a great semester!")
            rl.close()
            break
        default:
            console.log("Invalid choice. Try again.")
            showMenu()
            break
    }
}

function promptEnrollment() {
    rl.question("\nEnter Student ID (e.g., STU123456): ", (studentIdInput) => {
        rl.question("Enter Course Code (e.g., CS101): ", (courseCodeInput) => {
            rl.question("Enter Semester (e.g., Fall2024): ", (semesterInput) => {
                try {
                    const sId = createStudentId(studentIdInput)
                    const cCode = createCourseCode(courseCodeInput)
                    const sem = createSemester(semesterInput)

                    const student = students.find(s => s.id === sId)
                    const course = courses.find(c => c.code === cCode)

                    if (!student) throw new Error(`Student ${sId} not found in system.`)
                    if (!course) throw new Error(`Course ${cCode} not found in system.`)

                    const newEnrollment = enrollStudent(student, course, sem, enrollments, courses)
                    
                    enrollments.push(newEnrollment)
                    
                    console.log("\n✅ Success! Enrollment processed.")
                } catch (error) {
                    if (error instanceof Error) {
                        console.log(`\n❌ ERROR: ${error.message}`)
                    }
                }
                showMenu() 
            })
        })
    })
}

showMenu()