import mongoose from 'mongoose';

const weekSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekNumber: Number,
    year: Number,
    startDate: Date,
    endDate: Date,
    days: [{type: mongoose.Schema.Types.ObjectId, ref: 'Day'}]
});

weekSchema.index({ userId: 1, year: 1, weekNumber: 1 }, { unique: true }); 

const Week = mongoose.model('Week', weekSchema);
export default Week;