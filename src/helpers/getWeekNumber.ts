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
