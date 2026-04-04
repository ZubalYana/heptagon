import mongoose from 'mongoose';
import './Task';

const daySchema = new mongoose.Schema({
    dayOfWeek: String,
    date: Date,
    events: [Object],
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
})

const Day = mongoose.model('Day', daySchema);
export default Day;