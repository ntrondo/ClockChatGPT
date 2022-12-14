import React from "react"
import { useMemo } from "react";
const calculateDayOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    //console.log('Day of year: ' + day);
    return day;
}
/**Solar declination can also be defined as the angle between the line joining the centers of the Sun 
 * and the Earth and its projection on the equatorial plane. The solar declination changes mainly 
 * due to the rotation of Earth about an axis. Its maximum value is 23.45° on 21 December and 
 * the minimum is – 23.45° on 21 June. */
const calculateSolarDeclination = (date) => {
    // Calculate the number of days since the start of the year
    const dayOfYear = calculateDayOfYear(date);

    // Calculate the solar declination using the formula:
    //declination = 23.45 * sin(360 * (284 + n) / 365)
    const declination = 23.45 * Math.sin(360 * (284 + dayOfYear) / 365);
    //console.log("calculateSolarDeclination", declination);
    return declination;
}
const addOrSubtractOneHalf = (value) => {
    if (value <= 0.5)
        return value + 0.5;
    return value - 0.5;
}
const calculateOtherSideOfPlanet = (v) => {
    return v.map(addOrSubtractOneHalf);
}

/** 
 * Returns an array of vertices [[x1, y1], [x2, y2],...] 
 * Where both xN and yN are in [0,1].
*/
const calculateUpperPolygon = (date) => {
    console.log("WorldMapImage.calculatePolygon()", date);
    const sun = [1 - (date.getUTCHours() + date.getUTCMinutes() / 60) / 24, (90 + calculateSolarDeclination(date)) / 180];
    console.log("The sun is currently at ", sun);



    let coll = [];
    //Add known vertices on suns latitude
    coll.push([sun[0] - 0.75, sun[1]]);
    coll.push([sun[0] - 0.25, sun[1]]);
    coll.push([sun[0] + 0.25, sun[1]]);
    coll.push([sun[0] + 0.75, sun[1]]);



    //Add known vertices on suns longtitude
    coll.push([sun[0], addOrSubtractOneHalf(sun[1])]);



    coll.push([0, 0]);
    coll.push([1, 0]);
    //Select only valid values
    coll = coll.filter((v) => { return v[0] >= 0 && v[0] <= 1 && v[1] >= 0 && v[1] <= 1 });
    //Order by x
    coll.sort((a, b) => { return a[0] - b[0] });
    return coll;
}
const calculateLowerPolygon = (upperPolygon) => {
    console.log("WorldMapImage.invertPolygon()", upperPolygon);
    return [[0, 1], ...upperPolygon, [1, 1]];
}
const calculateClipPathStyle = (polygon) => {
    console.log("WorldMapImage.calculateClipPathStyle()", polygon);
    const vertexToString = (v) => {
        return (v[0] * 100).toString() + "% " + (v[1] * 100).toString() + "%";
    }
    const plgStr = polygon.map(vertexToString).join(",");
    return {
        clipPath: "polygon(" + plgStr + ")"
    }
}
const calculateUpperStyle = (upperPolygon) => {
    return {
        filter: "brightness(50%)",
        ...calculateClipPathStyle(upperPolygon)
    }
}
const calculateLowerStyle = (lowerPolygon) => {
    return {
        position: "absolute",

        ...calculateClipPathStyle(lowerPolygon)
    }
}

export default function WorldMapImage({ src, date }) {
    calculateSolarDeclination(date);
    const upperPolygon = useMemo(() => calculateUpperPolygon(date), [date]);
    const lowerPolygon = useMemo(() => calculateLowerPolygon(upperPolygon), [upperPolygon]);
    const upperstyle = useMemo(() => calculateUpperStyle(upperPolygon), [upperPolygon]);
    const lowerStyle = useMemo(() => calculateLowerStyle(lowerPolygon), [lowerPolygon]);
    return (
        <div className="isRow isContentCentered">
            <img src={src} style={upperstyle} alt="World Map" />
            <img src={src} style={lowerStyle} alt="World Map" />
        </div>
    );
}