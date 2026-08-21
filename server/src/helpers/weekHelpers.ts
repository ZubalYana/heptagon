export function getWeekNumber(date: Date): {year: number; weekNumber: number} {
    const d = new Date(date);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const year = d.getFullYear();
    const jan1 = new Date(year, 0, 1);
    const weekNumber = Math.ceil(
        ((d.getTime() - jan1.getTime())/86400000 + 1) / 7
    )
    return { year, weekNumber };
}

export function getStartOfWeek(year: number, weekNumber: number): Date{
    const jan1 = new Date(year, 0, 1);
    const dayOfWeek = jan1.getDay();
    const daysToMonday = dayOfWeek <= 1? 1-dayOfWeek : 8 - dayOfWeek;
    const firstMonday = new Date(year, 0, 1 + daysToMonday);
    const startDate = new Date(firstMonday);
    startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
    return startDate;
}