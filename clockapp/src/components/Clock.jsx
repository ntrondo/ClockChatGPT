import { useMemo } from "react";
const timeFormatter = (date)=>{
    console.log("Clock.timeFormatter()", date);
    const str = date.toString();
    return str;
}
export default function Clock({date}) {
    const timeStr =  useMemo(()=>{
        return timeFormatter(date);
    }) 
    return (
        <h2>{timeStr}</h2>
    );
}