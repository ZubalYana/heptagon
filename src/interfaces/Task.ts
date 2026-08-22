export interface Repetition{
    frequency: string,
    interval: number,
    daysOfWeek: number[],
    dayOfMonth?: number | null,
    monthOfYear?: number | null,
    startDate: string,
    endDate?: string | null,
}

export default interface Task{
    _id: string,
    text: string
    priority: string,
    completed: boolean,
    subtasks: { _id: string; text: string; completed: boolean, completedDates?: string[] }[];
    completedDates: string[];
    repetition?: Repetition | null; 
}