import Week from "../features/weeks/weekSchema";
import Day from "../features/days/daysSchema";
import "../features/tasks/taskSchema";
import { getStartOfWeek } from "../utils/weekHelpers";

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export async function getOrCreateWeek(year: number, weekNumber: number, userId: string){
    let week = await Week.findOne({year, weekNumber, userId})
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
                userId,
                dayOfWeek: name,
                date,
                tasks: [],
                events: []
            });
        })
    )

    week = await Week.create({
        userId,
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