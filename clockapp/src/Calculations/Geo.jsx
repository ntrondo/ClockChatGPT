import { calculateDayOfYear } from "./Chronos";
import { SphericalCoordinates } from "./Coordinates";
const radiansPerDay = 2 * Math.PI / 365;
/**Solar declination can also be defined as the angle between the line joining the centers of the Sun 
 * and the Earth and its projection on the equatorial plane. The solar declination changes mainly 
 * due to the rotation of Earth about an axis. Its maximum value is 23.45° on 21 December and 
 * the minimum is – 23.45° on 21 June. */
const calculateSolarDeclination = (dayOfYearUTC) => {
    console.log("Geo.jsx calculateSolarDeclination(dayOfYearUTC), dayOfYearUTC:", dayOfYearUTC);
    // Calculate the solar declination using the formula:
    //declination = 23.45 * sin(360 * (284 + n) / 365)
    //const declination = 23.45 * Math.sin(360 * (284 + dayOfYearUTC) / 365);
    //https://stackoverflow.com/questions/62184648/how-to-calculate-the-latitude-of-the-subsolar-point-ie-solar-declination-usin
    //const declination = -23.44 * Math.sin( (360 / 365.25) * dayOfYearUTC * Math.PI/180 )
    //δ=−23.45°×cos(360/365×(d+10))
    //https://sinovoltaics.com/learning-center/basics/declination-angle/#:~:text=The%20following%20equation%20can%20be,hemisphere%20and%20negative%20during%20winter

    const dayOfSolarYear = dayOfYearUTC + 10;
    const declination = -23.45 * Math.cos(radiansPerDay * dayOfSolarYear);
    console.log("Geo.jsx calculateSolarDeclination(dayOfYearUTC), declination:", declination);
    return declination;
}

export const calculatePositionOfSun = (date) => {
    console.log("Geo.jsx calculatePositionOfSun(date), date:", date);
    // Get the day of the year and time of day for the given date
    const dayOfYear = calculateDayOfYear(date);
    const timeOfDay = date.getUTCHours() + date.getMinutes() / 60;

    // Calculate the sun's longitude
    //Positive longitudes are east of the prime meridian, and negative ones are west.
    const longitude = 360 * (12 - timeOfDay) / 24;

    // Calculate the sun's latitude
    const declination = calculateSolarDeclination(dayOfYear);
    const latitude = declination;

    const position = new SphericalCoordinates(longitude, latitude);
    console.log("Geo.jsx calculatePositionOfSun(date), position:", position);
    return position;
}
/**
 * 
 * @param { [-180, 180] degrees} longitude 
 * @param { [-90, 90] degrees} latitude 
 * @param { [-360, 360] degrees} arcLength 
 * @param { (-360, 360) degrees} angle 
 * @returns 
 */
export const getTargetCoordinates = (longitude, latitude, arcLength, angle) => {
    // Check input
    if (Math.abs(longitude) > 180 || Math.abs(latitude) > 90) {
        console.log("Geo.jsx getTargetCoordinates(longitude, latitude, arcLength, angle), invalid input coordinates", [longitude, latitude]);
        return [0, 0];
    }
    if (Math.abs(arcLength) > 360) {
        console.log("Geo.jsx getTargetCoordinates(longitude, latitude, arcLength, angle), invalid arc length", arcLength);
        return [0, 0];
    }
    if (Math.abs(angle) >= 360) {
        console.log("Geo.jsx getTargetCoordinates(longitude, latitude, arcLength, angle), invalid angle", angle);
        return [0, 0];
    }

    // Convert the angle from degrees to radians
    const radians = angle * (Math.PI / 180);

    // Calculate the target longitude and latitude
    const targetLongitude = longitude + arcLength * Math.sin(radians);
    const targetLatitude = latitude + arcLength * Math.cos(radians);

    const targetCoordinates = normalize([targetLongitude, targetLatitude]);
    console.log("Geo.jsx getTargetCoordinates(longitude, latitude, arcLength, angle), targetCoordinates:", targetCoordinates);
    return targetCoordinates;
}

  
const normalize = (vertex) => {
    let x = vertex[0];
    let y = vertex[1];

    while (Math.abs(y) >= 360)
        y = y - (Math.sign(y) * 360);
    if(Math.abs(y) >= 180){
        throw new Error("Not implemented");
    }
    if(Math.abs(y) > 90){
        let signy = Math.sign(y);
        let overshoot = Math.abs(y) - 90;
        y = signy * (90 - overshoot);
        x += 180;
    }    
    while (Math.abs(x) > 180)
        x = x - Math.sign(x) * 360;
    return [x, y];
}
const calculateMercatorProjection = (longitude, latitude) => {
    // Convert the longitude and latitude to radians
    const lonRadians = longitude * (Math.PI / 180);
    const latRadians = latitude * (Math.PI / 180);

    // Calculate the projected coordinates
    const x = lonRadians;
    const y = Math.log(Math.tan(latRadians / 2 + Math.PI / 4));

    return [x, y];
}

