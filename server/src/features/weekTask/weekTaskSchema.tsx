import mongoose from "mongoose"; 

const weekTaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    priority: { type: String, enum: ['high', 'medium', 'optional'], required: true},
    text: { type: String, required: true },
    year: { type: Number, required: true},
    week: { type: Number, required: true},
    targetCount: { type: Number, min: 1, required: true },
    completedCount: { type: Number, min: 0, required: true } 
})

const weekTask = mongoose.model("WeekTask", weekTaskSchema)
export default weekTask;