import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth';

const app = express();
app.use(express.json());
dotenv.config();

const router = express.Router();
app.use(router);
app.use('/auth', authRouter)

mongoose.connect(process.env.MONGO_URL || '')
.then(()=>{
    console.log('MongoDB connected.');
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on PORT: ${process.env.PORT}`)
})