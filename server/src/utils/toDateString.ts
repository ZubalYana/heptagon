export default function toDateString(date: Date): string{
    const d = date instanceof Date? date : new Date(date)
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const formattedString = `${year}-${month}-${day}`;
    return formattedString;
}