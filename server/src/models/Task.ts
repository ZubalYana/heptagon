import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const repetitionSchema = new mongoose.Schema(
  {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: true,
    },
    interval: { type: Number, default: 1, min: 1 }, 
    daysOfWeek: { type: [Number], default: [] },   
    startDate: { type: Date, required: true },     
    endDate: { type: Date, default: null },    
  },
  { _id: false } 
);

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'optional'], required: true },
  date: { type: Date, default: null }, 
  completed: { type: Boolean, default: false }, 
  completedDates: { type: [String], default: [] }, 
  subtasks: { type: [subtaskSchema], default: [] },
  repetition: { type: repetitionSchema, default: null },
});

const Task = mongoose.model('Task', taskSchema);
export default Task;