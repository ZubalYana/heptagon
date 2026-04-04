import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    text: String,
    priority: String,
    completed: Boolean
})

const Task = mongoose.model('Task', taskSchema);
export default Task;