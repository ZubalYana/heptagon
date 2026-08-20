import mongoose from 'mongoose';
import '../tasks/taskSchema';

const daySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    dayOfWeek: String,
    date: Date,
    events: [Object],
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
})

const Day = mongoose.model('Day', daySchema);
export default Day;