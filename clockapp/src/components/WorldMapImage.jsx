import React from "react"
import { useMemo } from "react";
import { calculatePositionOfSun } from '../Calculations/Geo';
import { SphericalSystem } from "../Calculations/SphericalSystem";
import { CartesianCoordinates2D, SphericalCoordinates } from "../Calculations/Coordinates";
import { MercatorProjector } from "../Calculations/MercatorProjector";
import { CartesianSphereSystem } from "../Calculations/CartesianSphereSystem";
import { VerticalInverter } from "../Calculations/VerticalInverter";

const polarSystem = new SphericalSystem(360, new SphericalCoordinates(0, 0));
const cartesianSystem = new CartesianSphereSystem(
    new CartesianCoordinates2D(0, 0),
    new CartesianCoordinates2D(1, 1)
);
const projector = new MercatorProjector(polarSystem, cartesianSystem);
const inverter = new VerticalInverter(cartesianSystem);
const resolution = 100;
const calculateTerminatorPolygon = (sunPolarCoordinates) => {
    //console.log("WorldMapImage.calculateTerminatorPolygon(sunPolarCoordinates), sunPolarCoordinates:", sunPolarCoordinates);
    const polarPolygon = polarSystem.GenerateCircle(sunPolarCoordinates, 90, resolution);
    //console.log("WorldMapImage.calculateTerminatorPolygon(sunPolarCoordinates), polarPolygon:", polarPolygon);
    const cartesianPolygon = polarPolygon.map((v) => { return projector.Project(v); });
    const sortedPolygon = cartesianSystem.Order(cartesianPolygon);
    //console.log("WorldMapImage.calculateTerminatorPolygon(sunPolarCoordinates), sortedPolygon:", sortedPolygon);
    const invertedPolygon = sortedPolygon.map((v) => { return inverter.Project(v); });
    //console.log("WorldMapImage.calculateTerminatorPolygon(sunPolarCoordinates), invertedPolygon:", invertedPolygon);
    return invertedPolygon;
}
/** 
 * Returns an array of vertices [[x1, y1], [x2, y2],...] 
 * Where both xN and yN are in [0,1].
*/
const calculateUpperPolygon = (innerPolygon) => {
    //console.log("WorldMapImage.calculateUpperPolygon() innerPolygon", innerPolygon);
    const first = innerPolygon[0];
    const last = innerPolygon[innerPolygon.length - 1];
    const polygon = [
        new CartesianCoordinates2D(0, 1),
        new CartesianCoordinates2D(0, first.Y),
        ...innerPolygon,
        new CartesianCoordinates2D(1, last.Y),
        new CartesianCoordinates2D(1, 1)
    ];
    //console.log("WorldMapImage.calculateUpperPolygon() polygon", polygon);
    return polygon;
}
const calculateLowerPolygon = (upperPolygon) => {
    //console.log("WorldMapImage.invertPolygon()", upperPolygon);
    return [
        new CartesianCoordinates2D(0, 0),
        new CartesianCoordinates2D(0, 1),
        ...upperPolygon,
        new CartesianCoordinates2D(1, 1),
        new CartesianCoordinates2D(1, 0)
    ];
}
const calculateClipPathStyle = (polygon) => {
    //console.log("WorldMapImage.calculateClipPathStyle()", polygon);
    const vertexToString = (v) => {
        return (v.X * 100).toString() + "% " + (v.Y * 100).toString() + "%";
    }
    const plgStr = polygon.map(vertexToString).join(",");
    return {
        clipPath: "polygon(" + plgStr + ")"
    }
}
const baseMapStyle = {width: "100%"};
const lowerMapStyle = {position: "absolute"};
const nightMapStyle = {filter: "brightness(50%)"};
const calculateMapStyle = (polygon, sunCoordinates, isUpper)=>{
    var style = baseMapStyle;
    if(!isUpper)
        style = {...style, ...lowerMapStyle};
    const isNight = (isUpper && sunCoordinates.Y <= 0.5) || (!isUpper && sunCoordinates.Y >= 0.5);
    if(isNight)
        style = {...style, ...nightMapStyle}
        return {
            ...style,
            ...calculateClipPathStyle(polygon)
        }
}

const calculateSunWrapperStyle = (vertex) => {
    //console.log("WorldMapImage.calculateSunWrapperStyle(vertex) vertex:", vertex);
    return {
        position: "relative",
        left: (vertex.X * 100).toString() + "%",
        top: (vertex.Y * 100).toString() + "%",
        width: "4%"
    }
}
const calculateSunStyle = (date) => {
    return {
        width: "100%",
        marginTop: "-50%",
        marginLeft: "-100%"
    }
}

export default function WorldMapImage({ earth, sun, date }) {
    const sunPolarCoordinates = useMemo(() => calculatePositionOfSun(date), [date]);
    const sunCoordinates = useMemo(() => inverter.Project(projector.Project(sunPolarCoordinates)), [sunPolarCoordinates]);
    const sunWrapperStyle = useMemo(() => calculateSunWrapperStyle(sunCoordinates), [sunCoordinates]);

    const polygon = useMemo(() => calculateTerminatorPolygon(sunPolarCoordinates), [sunPolarCoordinates]);
    const upperPolygon = useMemo(() => calculateUpperPolygon(polygon), [polygon]);
    const lowerPolygon = useMemo(() => calculateLowerPolygon(upperPolygon), [upperPolygon]);
    const upperstyle = useMemo(() => calculateMapStyle(upperPolygon, sunCoordinates, true), [upperPolygon, sunCoordinates]);
    const lowerStyle = useMemo(() => calculateMapStyle(lowerPolygon, sunCoordinates, false), [lowerPolygon, sunCoordinates]);

    const sunStyle = useMemo(() => calculateSunStyle(date), [date]);
    return (
        <div className="isPositionRelative mt10">
            <div className="isRow isContentCentered">
                <img src={earth} style={upperstyle} alt="World Map" />
                <img src={earth} style={lowerStyle} alt="World Map" />
                <div style={{ width: "100%", height: "100%", position: "absolute" }}>
                    <div style={sunWrapperStyle}>
                        <img style={sunStyle} src={sun} alt="Sun" />
                    </div>

                </div>
            </div>
        </div>
    );
}