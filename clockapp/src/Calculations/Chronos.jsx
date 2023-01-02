const oneDay = 1000 * 60 * 60 * 24;
const oneHour = 1000 * 60 * 60;
const oneMin = 1000 * 60;
export const calculateDayOfYear = (date) => {
    console.log("Chronos.jsx calculateDayOfYear(date) date:", date);
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    
    const day = Math.floor(diff / oneDay);
    console.log("Chronos.jsx calculateDayOfYear(date) day:", day);
    return day;
}
export const moveDateToDayOfYear = (date, dayOfYear)=>{
    const start = new Date(date.getFullYear(), 0, 1);    
    const yearsTime = start.getTime()
    const offSet = (date.getTimezoneOffset() - start.getTimezoneOffset()) * oneMin;
    const daysTime = oneDay * dayOfYear;
    const hoursTime = oneHour * date.getHours();
    const minutesTime = date.getMinutes() * oneMin;
    const time = offSet + yearsTime + daysTime + hoursTime + minutesTime;
    return new Date(time);
}
export const moveDateToHourOfDay = (date, hour) =>{
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());    
    const offSet = (date.getTimezoneOffset() - start.getTimezoneOffset()) * oneMin;
    const hoursTime = oneHour * hour;
    const minutesTime = date.getMinutes() * oneMin;
    const time = offSet + start.getTime() + hoursTime + minutesTime;
    return new Date(time);
}
export const moveDateToMinuteOfDay = (date, minute) =>{    
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());    
    const offSet = (date.getTimezoneOffset() - start.getTimezoneOffset()) * oneMin;
    const minutesTime = minute * oneMin;
    const time = offSet + start.getTime() + minutesTime;
    return new Date(time);
}
export const IncrementDate = (date, seconds) => {
    const newDateObj = new Date(date.getTime() + seconds * 1000);
    return newDateObj;
  }