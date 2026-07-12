export interface Repetition{
    frequency: string,
    interval: number,
    daysOfWeek: number[],
    startDate: Date,
    endDate?: Date | null,
}

export default interface Task{
    _id: string,
    text: string
    priority: string,
    completed: boolean,
    subtasks: { _id: string; text: string; completed: boolean }[];
    repetition?: Repetition | null; 
}