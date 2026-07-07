interface Subtask{
    text: string,
    completed: boolean
}

export interface Repetition{
    frequency: string,
    interval: number,
    daysOfWeek: [number],
    startDate: Date,
    endDate: Date,
}

export default interface Task{
    text: string;
    priority: string;
    date: Date;
    completed: boolean;
    completedDates: [string];
    subtasks: [Subtask];
    repetition: Repetition
}