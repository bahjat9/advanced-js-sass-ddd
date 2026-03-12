export type Brand<K, T> = K & { __brand: T }

export type StudentId = Brand<string, "StudentId">
export type CourseCode = Brand<string, "CourseCode">
export type Email = Brand<string, "Email">
export type Credits = Brand<number, "Credits">
export type Semester = Brand<string, "Semester">
export type EnrollmentId = Brand<string, "EnrollmentId">


export function createStudentId(id: string): StudentId {
    if (!/^STU\d{6}$/.test(id)) {
        throw new Error("Invalid StudentId: Must be 'STU' followed by exactly 6 digits (e.g., STU123456).")
    }
    return id as StudentId
}

export function createCourseCode(code: string): CourseCode {
    if (!/^[A-Za-z]{2,4}\d{3}$/.test(code)) {
        throw new Error("Invalid CourseCode: Must be 2-4 letters followed by 3 digits (e.g., CS101).")
    }
    return code as CourseCode
}

export function createEmail(email: string): Email {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid Email: Must be a properly formatted email address.")
    }
    return email as Email
}

export function createCredits(credits: number): Credits {
    if (![1, 2, 3, 4, 6].includes(credits)) {
        throw new Error("Invalid Credits: Course credits can only be 1, 2, 3, 4, or 6.")
    }
    return credits as Credits
}

export function createSemester(semester: string): Semester {
    if (!/^(Fall|Spring|Summer)\d{4}$/.test(semester)) {
        throw new Error("Invalid Semester: Must be Fall, Spring, or Summer followed by a 4-digit year (e.g., Fall2024).")
    }
    return semester as Semester
}

export function createEnrollmentId(id: string): EnrollmentId {
    if (!id.startsWith("ENR")) {
        throw new Error("Invalid EnrollmentId: Must start with 'ENR'.")
    }
    return id as EnrollmentId
}