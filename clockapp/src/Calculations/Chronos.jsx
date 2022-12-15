export const calculateDayOfYear = (date) => {
    console.log("Chronos.jsx calculateDayOfYear(date) date:", date);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    console.log("Chronos.jsx calculateDayOfYear(date) day:", day);
    return day;
}