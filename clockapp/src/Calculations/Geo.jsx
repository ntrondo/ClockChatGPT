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