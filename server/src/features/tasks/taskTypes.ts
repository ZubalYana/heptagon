interface Subtask{
    text: string,
    completed: boolean
}

export type Priority = 'high' | 'medium' | 'optional';

export interface Repetition{
    frequency: string,
    interval: number,
    daysOfWeek: number[],
    startDate: Date,
    endDate?: Date | null,
}

export default interface Task{
    text: string;
    priority: Priority;
    date?: Date | null;
    completed: boolean;
    completedDates: string[];
    subtasks: Subtask[];
    repetition?: Repetition | null;
}