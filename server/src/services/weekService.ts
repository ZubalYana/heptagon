import Week from "../models/Week";
import Day from "../models/Day";
import "../models/Task";
import { getStartOfWeek } from "../utils/weekHelpers";

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export async function getOrCreateWeek(year: number, weekNumber: number){
    let week = await Week.findOne({year, weekNumber})
    .populate({
        path: 'days',
        populate: {path: 'tasks'}
    });

    if(week) return week;

    const startDate = getStartOfWeek(year, weekNumber);

    const days = await Promise.all(
        DAY_NAMES.map((name, i)=>{
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            return Day.create({
                dayOfWeek: name,
                date,
                tasks: [],
                events: []
            });
        })
    )

    week = await Week.create({
        year,
        weekNumber,
        startDate,
        endDate: days[6].date,
        days: days.map(d=>d._id)
    });

    return week.populate({
        path: 'days',
        populate: {path: 'tasks'}
    });
}