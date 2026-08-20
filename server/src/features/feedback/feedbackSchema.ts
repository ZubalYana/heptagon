import mongoose from 'mongoose';

const feedbackSheme = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    feedbackText: { type: String, required: true, trim: true, maxlength: 2000 },
    submitionDate: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSheme);
export default Feedback;