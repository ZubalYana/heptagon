import mongoose from 'mongoose';
import { toCalendarDate } from '../../helpers/calendarDate';

const weekSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekNumber: Number,
    year: Number,
    startDate: { type: String, set: (value: Date | string) => toCalendarDate(value) },
    endDate: { type: String, set: (value: Date | string) => toCalendarDate(value) },
    days: [{type: mongoose.Schema.Types.ObjectId, ref: 'Day'}]
});

weekSchema.index({ userId: 1, year: 1, weekNumber: 1 }, { unique: true }); 

const Week = mongoose.model('Week', weekSchema);
export default Week;