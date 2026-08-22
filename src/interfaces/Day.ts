import type Task from "./Task"
export default interface Day{
    _id: string,
    dayOfWeek: string,
    date: string,
    events: [],
    tasks: Task[]
}