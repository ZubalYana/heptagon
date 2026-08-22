import mongoose from 'mongoose';
import { toCalendarDate } from '../../helpers/calendarDate';

const subtaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedDates: { type: [String], default: []}
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
    startDate: {
      type: String,
      required: true,
      set: (value: Date | string) => toCalendarDate(value),
    },
    endDate: {
      type: String,
      default: null,
      set: (value: Date | string | null) =>
        value == null ? value : toCalendarDate(value),
    },    
  },
  { _id: false } 
);

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'optional'], required: true },
  date: {
    type: String,
    default: null,
    set: (value: Date | string | null) =>
      value == null ? value : toCalendarDate(value),
  }, 
  completed: { type: Boolean, default: false }, 
  completedDates: { type: [String], default: [] }, 
  subtasks: { type: [subtaskSchema], default: [] },
  repetition: { type: repetitionSchema, default: null },
});

const Task = mongoose.model('Task', taskSchema);
export default Task;