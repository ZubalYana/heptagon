import type Day from "./Day"
export default interface Week{
    _id: string,
    weekNumber: number,
    year: number,
    startDate: string,
    endDate: string,
    days: [Day]
}