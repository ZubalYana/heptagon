interface Subtask{
    text: string,
    completed: boolean
}

interface Repetition{
    frequency: string,
    interval: number,
    days: [number],
    startDate: Date,
    endDate: Date,
    occurrences: number
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