import mongoose from 'mongoose';

const weekSchema = new mongoose.Schema({
    weekNumber: Number,
    year: Number,
    startDate: Date,
    endDate: Date,
    days: [{type: mongoose.Schema.Types.ObjectId, ref: 'Day'}]
});

const Week = mongoose.model('Week', weekSchema);
export default Week;