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

export interface CreateTaskInput {
  userId: string;
  text: string;
  priority: Priority;
  regular: boolean;
  frequency?: string;
  interval?: number;
  daysOfWeek?: number[];
  startDate?: string;
  endDate?: string;
  dayId?: string;
}

export interface EditTaskInput {
    userId: string,
    taskId: string,
    text: string,
    priority: Priority,
    repetition: Repetition
}