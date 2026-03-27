import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
dotenv.config();

mongoose.connect(process.env.MONGO_URL || '')
.then(()=>{
    console.log('MongoDB connected.');
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on PORT: ${process.env.PORT}`)
})