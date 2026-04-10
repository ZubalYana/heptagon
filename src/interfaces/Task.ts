export default interface Task{
    _id: string,
    text: string
    priority: string,
    completed: boolean,
    subtasks: { _id: string; text: string; completed: boolean }[];
}