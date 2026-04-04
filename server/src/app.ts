import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import authRouter from './routes/auth';
import weeksRouter from './routes/weeks'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/weeks', weeksRouter);

mongoose.connect(process.env.MONGO_URL || '')
.then(()=>{
    console.log('MongoDB connected.');
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on PORT: ${process.env.PORT}`)
})