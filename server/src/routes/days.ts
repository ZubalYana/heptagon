import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Day from '../models/Day';

const router = express.Router();
router.use(authMiddleware);

router.get('/:id', async (req,res)=>{
    try{
        const {id} = req.params;
        const day = await Day.findById(id).populate('tasks');
        if(!day) return res.status(404).json({message: 'Day not found'});
        return res.status(200).json(day);
    }catch(err){
        return res.status(500).json({message: 'Day not found', err});
    }
})

export default router;