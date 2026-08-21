import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    feedbackText: { type: String, required: true, trim: true, maxlength: 2000 },
    submitionDate: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;