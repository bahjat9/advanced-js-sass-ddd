import { DomainEvent } from "../domain/events"
export type Observer = (event: DomainEvent) => void
export const observers: Observer[] = []

export const emailStudentObserver: Observer = (event) => {
    if (event.type === "StudentEnrolled") {
        console.log(`[EMAIL SENT]: Student ${event.studentId} successfully enrolled in ${event.courseCode} for ${event.semester}!`)
    }
}