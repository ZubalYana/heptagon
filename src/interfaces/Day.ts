import type Task from "./Task"
export default interface Day{
    _id: string,
    dayOfWeek: string,
    date: Date,
    events: [],
    tasks: Task[]
}