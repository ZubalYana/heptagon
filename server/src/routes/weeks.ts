import express from 'express';
import { getWeekNumber } from '../utils/weekHelpers';
import { getOrCreateWeek } from '../services/weekService';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware)

router.get('/current', async (req,res)=>{
    try{
        const {year, weekNumber} = getWeekNumber(new Date());
        const week = await getOrCreateWeek(year, weekNumber - 1, req.user.id);
        res.json(week);
    }catch(err){
        res.status(500).json({ message: (err as Error).message })
    }
})

router.get('/:year/:weekNumber', async (req,res)=>{
    try{
        const year = parseInt(req.params.year);
        const weekNumber = parseInt(req.params.weekNumber);
        const week = await getOrCreateWeek(year, weekNumber, req.user.id);
        res.json(week);
    }catch(err){
        res.status(500).json({ message: (err as Error).message })
    }
})

export default router;