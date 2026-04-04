import mongoose from 'mongoose';
import Task from './Task';

const daySchema = new mongoose.Schema({
    dayOfWeek: String,
    date: Date,
    events: [Object],
    tasks: [Task]
})

const Day = mongoose.model('Day', daySchema);
export default Day;