interface Day{
    _id: string,
    dayOfWeek: string,
    date: Date,
    events: [],
    tasks: []
}
export default interface Week{
    _id: string,
    weekNumber: number,
    year: number,
    startDate: Date,
    endDate: Date,
    days: [Day]
}