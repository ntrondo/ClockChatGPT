import React from "react"
import { useMemo } from "react";
/** 
 * Returns an array of vertices [[x1, y1], [x2, y2],...] 
 * Where both xN and yN are in [0,1].
*/
const calculatePolygon = (date)=>{
    const coll = [];
    coll.push([0,0]);
    coll.push([0.25,0.35]);
    coll.push([0.5,0.5]);
    coll.push([0.75,0.35]);
    coll.push([1,0]);
    return coll;
}
const calculateStyles = (plg)=>{    
    const vertexToString = (v)=>{
        return (v[0]*100).toString() + "% "+ (v[1]*100).toString() + "%";
    }
    const plgStr = plg.map(vertexToString).join(",");
    return{
        clipPath: "polygon(" + plgStr + ")"
    }
}

export default function WorldMapImage({src, date}) {
    const polygon = useMemo(()=> calculatePolygon(date),[date]);
    const styles1 = useMemo(()=> calculateStyles(polygon), [polygon]);
    return(
        <img src={src} style={styles1} alt="World Map" />
    );
}