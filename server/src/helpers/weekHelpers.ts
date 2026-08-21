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

export function getStartOfWeek(year: number, weekNumber: number): Date {
  const jan1 = new Date(year, 0, 1);
  const jan1Day = jan1.getDay() || 7; 
  const week1Monday = new Date(year, 0, 1 - (jan1Day - 1));

  const startDate = new Date(week1Monday);
  startDate.setDate(week1Monday.getDate() + (weekNumber - 1) * 7);
  return startDate;
}