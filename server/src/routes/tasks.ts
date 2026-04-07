import express from 'express';
import Task from '../models/Task';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
router.use(authMiddleware);

router.post('/', async (req,res)=>{
    try{
        const { text, priority } = req.body;
        const task = await Task.create(text, priority);
        res.status(202).json(task);
    }catch(err){
        return res.status(500).json({message: 'Failed to create task.'});
    }
})


export default router;