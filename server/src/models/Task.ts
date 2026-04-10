import mongoose from 'mongoose'

const subtaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
})

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'optional'] },
  completed: { type: Boolean, default: false },
  subtasks: { type: [subtaskSchema], default: [] },
})

const Task = mongoose.model('Task', taskSchema);
export default Task;