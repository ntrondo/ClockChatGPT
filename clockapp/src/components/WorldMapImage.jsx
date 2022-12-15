import React from "react"
import { useMemo } from "react";
import { calculatePositionOfSun, getTargetCoordinates } from '../Calculations/Geo';
import {projectVertex, projectVertices} from '../Calculations/EquiRectangular';
import { getSmallest, removeItem} from '../Calculations/Array';

const calculateTerminatorPolygon = (sunPolarCoordinates) => {
    console.log("WorldMapImage.calculateTerminatorPolygon(sunPolarCoordinates), sunPolarCoordinates:", sunPolarCoordinates);
    const resolution = 100;
    const increment = 360 / resolution;
    let polygon = [];
    for(var i = 0; i < resolution;i++){
        polygon.push(getTargetCoordinates(sunPolarCoordinates[0], sunPolarCoordinates[1], 90, increment * i));
    }
    console.log("WorldMapImage.calculateTerminatorPolygon(sunPolarCoordinates), polygon:", polygon);
    polygon = projectVertices(polygon);
    polygon = sortToCurve(polygon);
    console.log("WorldMapImage.calculateTerminatorPolygon(sunPolarCoordinates), polygon:", polygon);
    return polygon;
}
const sortToCurve = (vertices)=>{
    const sorted = [];
    var evaluator = (v)=>v[0];
    let vertex = getSmallest(vertices, evaluator);
    sorted.push(vertex);
    removeItem(vertices, vertex);
    while(vertices.length > 0){
        evaluator = (v)=> calculateCartesianDistance(v, vertex);
        vertex = getSmallest(vertices, evaluator);
        sorted.push(vertex);
        removeItem(vertices, vertex);
    }
    return sorted;
}
const calculateCartesianDistance = (a,b)=>{
    const v = [a[0] - b[0], a[1] - b[1]];
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}
/** 
 * Returns an array of vertices [[x1, y1], [x2, y2],...] 
 * Where both xN and yN are in [0,1].
*/
const calculateUpperPolygon = (innerPolygon) => {
    console.log("WorldMapImage.calculateUpperPolygon() innerPolygon", innerPolygon);
    const first = innerPolygon[0];
    const last = innerPolygon[innerPolygon.length - 1];
    const polygon = [[0,1],[0,first[1]],...innerPolygon, [1, last[1]],[1,1]];
    console.log("WorldMapImage.calculateUpperPolygon() polygon", polygon);
    return polygon;
}
const calculateLowerPolygon = (upperPolygon) => {
    console.log("WorldMapImage.invertPolygon()", upperPolygon);
    return [[0,0],[0, 1], ...upperPolygon, [1, 1],[1,0]];
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
        width: "100%",
        ...calculateClipPathStyle(upperPolygon)
    }
}
const calculateLowerStyle = (lowerPolygon) => {
    return {
        filter: "brightness(50%)",
        position: "absolute",
        width: "100%",
        ...calculateClipPathStyle(lowerPolygon)
    }
}
const calculateSunWrapperStyle = (vertex)=>{
    console.log("WorldMapImage.calculateSunWrapperStyle(vertex) vertex:", vertex);
    return {
        position: "relative",
        left: (vertex[0] * 100).toString() + "%",  
        top:  (vertex[1] * 100).toString() + "%",        
        width: "4%"
    }
}
const calculateSunStyle = (date) => {
    return {
        width: "100%",
        marginTop:"-50%",
        marginLeft:"-100%"
    }
}

export default function WorldMapImage({ earth, sun, date }) {
    const sunPolarCoordinates = useMemo(()=>calculatePositionOfSun(date), [date]);
    const sunCoordinates = useMemo(()=>projectVertex(sunPolarCoordinates),[sunPolarCoordinates]);
    const sunWrapperStyle = useMemo(() => calculateSunWrapperStyle(sunCoordinates), [sunCoordinates]);

    const polygon = useMemo(()=> calculateTerminatorPolygon(sunPolarCoordinates))
    const upperPolygon = useMemo(() => calculateUpperPolygon(polygon), [polygon]);
    const lowerPolygon = useMemo(() => calculateLowerPolygon(upperPolygon), [upperPolygon]);
    const upperstyle = useMemo(() => calculateUpperStyle(upperPolygon), [upperPolygon]);
    const lowerStyle = useMemo(() => calculateLowerStyle(lowerPolygon), [lowerPolygon]);

    
    const sunStyle = useMemo(() => calculateSunStyle(date), [date]);
    return (
        <div className="isPositionRelative">
            <div className="isRow isContentCentered">
                <img src={earth} style={upperstyle} alt="World Map" />
                <img src={earth} style={lowerStyle} alt="World Map" />
                <div style={{ width: "100%", height: "100%", position: "absolute" }}>
                    <div style={sunWrapperStyle}>
                    <img style={sunStyle} src={sun}  alt="Sun" />
                    </div>
                    
                </div>
            </div>
        </div>
    );
}