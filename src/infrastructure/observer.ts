import { DomainEvent } from "../domain/events"

export type Observer = (event: DomainEvent) => void

export class EventEmitter {
    private observers: Observer[] = []

    subscribe(observer: Observer): void {
        this.observers.push(observer)
    }

    unsubscribe(observerToRemove: Observer): void {
        this.observers = this.observers.filter(obs => obs !== observerToRemove)
    }

    emit(event: DomainEvent): void {
        this.observers.forEach(observer => observer(event))
    }
}

export const domainEvents = new EventEmitter()

export const consoleLoggerObserver: Observer = (event) => {
    console.log(`\n🔔 [EVENT EMITTED]: ${event.type}`)
    console.log(event)
}