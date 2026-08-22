import mongoose from 'mongoose';
import '../tasks/taskSchema';
import { toCalendarDate } from '../../helpers/calendarDate';

const daySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    dayOfWeek: String,
    date: {
      type: String,
      required: true,
      set: (value: Date | string) => toCalendarDate(value),
    },
    events: [Object],
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
})

const Day = mongoose.model('Day', daySchema);
export default Day;