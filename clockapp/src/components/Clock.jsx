import { useMemo, useState, useEffect } from "react";
import { calculateDayOfYear, moveDateToDayOfYear, IncrementDate, moveDateToMinuteOfDay } from "../Calculations/Chronos";
const timeFormatter = (date) => {
    console.log("Clock.timeFormatter()", date);
    const str = date.toString();
    return str;
}
export default function Clock({ date, setDate }) {
    const timeStr = useMemo(() => {
        return timeFormatter(date);
    })
    const [day] = useState(() => calculateDayOfYear(date), [date, setDate]);
    const [min] = useState(() => { return date.getHours() * 60 }, [date]);
    const registerTimeSliderInput = (event) => {
        const value = event.target.value;
        const newDate = moveDateToMinuteOfDay(date, event.target.value);
        console.log("registerTimeSliderInput newDate:", newDate);
        setDate(newDate);
    };
    const registerDateSliderInput = (event) => {
        const newDate = moveDateToDayOfYear(date, event.target.value);
        console.log("registerDateSliderInput newDate:", newDate);
        setDate(newDate);
    };
    const [useRealTime, setUseRealTime] = useState(() => true, []);
    const toggleRealTime = (event) => {
        setUseRealTime(!useRealTime);
        setDate(new Date());
    };
    useEffect(() => {
        if (!useRealTime)
            return;
        const interval = setTimeout(() => {
            const newDate = IncrementDate(date, 10);
            setDate(newDate);
        }, 10 * 1000);
        return () => { clearInterval(interval); };
    }, [date]);


    return (
        <>
            <div className="isRow isContentCentered">
                <h2 className="isFlex">{timeStr}</h2>
                <div className="isFlex isItemsAllignedCenter">
                    <input type="checkbox" id="realTimeToggle" name="realTimeToggle" value="realTime" checked={useRealTime} onChange={toggleRealTime} />
                    <label for="realTimeToggle"> Use real-time</label>
                </div>

            </div>
            {!useRealTime &&
                <>
                    <div className="isRow">
                        <span>Time of day:</span>
                        <input className="isFlex isFlexGrow1" type="range" min="0" max="1439" defaultValue={min} onInput={registerTimeSliderInput} />
                    </div>
                    <div className="isRow">
                        <span>Date of year:</span>
                        <input className="isFlex isFlexGrow1" type="range" min="0" max="364" defaultValue={day} onInput={registerDateSliderInput} />
                    </div>
                </>
            }
        </>
    );
}