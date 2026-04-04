import express from 'express';
import { getWeekNumber } from '../utils/weekHelpers';
import { getOrCreateWeek } from '../services/weekService';

const router = express.Router();

router.get('/current', async (req,res)=>{
    try{
        const {year, weekNumber} = getWeekNumber(new Date());
        const week = await getOrCreateWeek(year, weekNumber);
        res.json(week);
    }catch(err){
        res.status(500).json({ message: (err as Error).message })
    }
})

router.get('/:year/:weekNumber', async (req,res)=>{
    try{
        const year = parseInt(req.params.year);
        const weekNumber = parseInt(req.params.weekNumber);
        const week = await getOrCreateWeek(year, weekNumber);
        res.json(week);
    }catch(err){
        res.status(500).json({ message: (err as Error).message })
    }
})

export default router;