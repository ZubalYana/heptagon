import express from 'express';
import Feedback from '../models/Feedback';
import { verifyAdmin } from '../middleware/verifyAdmin';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/create', authMiddleware, async (req,res)=>{
    try{
        const {userName, userEmail, feedbackText} = req.body;
        if(!userName || !userEmail || !feedbackText){
            res.status(400).json({message: 'Missing credentials.'})
        }
        const feedback = await Feedback.create({userName, userEmail, feedbackText})
        res.status(201).json({feedback});
    }catch(err){
        res.status(500).json({message: 'Error creating feedback. Contact our support.'})
    }
})

router.get('/all', verifyAdmin, async (req,res)=>{
    try{
        const feedback = Feedback.find();
        if(!feedback){
            res.status(404).json({message: 'Feedback not found'});
        }
        res.status(200).json({feedback});
    }catch(err){
        res.status(500).json({message: 'Error getting feedback.'})
    }
})

export default router;