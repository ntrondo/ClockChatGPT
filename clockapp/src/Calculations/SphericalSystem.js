import { SphericalCoordinates } from "./Coordinates";
import { SphericalSurfaceVector } from "./Vector";
const RadialCircumferance = 2 * Math.PI;
export class SphericalSystem {
    
    constructor(circumferance, normalMiddle) {
        this.Circumferance = circumferance;
        this.HalfCircumferance = this.Circumferance / 2;
        this.QuarterCircumferance = this.HalfCircumferance / 2;
        this.Minimum = new SphericalCoordinates(normalMiddle.Azimuth - this.HalfCircumferance, normalMiddle.Inclination - this.QuarterCircumferance);
        this.Maximum = new SphericalCoordinates(normalMiddle.Azimuth + this.HalfCircumferance, normalMiddle.Inclination + this.QuarterCircumferance);
    }
    CalculateCoordinates(start, vector) {    
        if(vector.Direction == 0){
            const d = start.Inclination + vector.Distance;
            const end = new SphericalCoordinates(start.Azimuth, d);            
            return this.NormalizeCoordinates(end);
        }
        const B = this.ConvertToRadians(vector.Direction);
        const a = this.ConvertToRadians(vector.Distance);

        const c = this.ConvertToRadians(this.ConvertToCoLatitude(start.Inclination));
        const cosb = Math.cos(a) * Math.cos(c) + Math.sin(c) * Math.cos(B);
        const b = Math.acos(cosb);

        let cosA = (Math.cos(a) - Math.cos(b) * Math.cos(c)) / (Math.sin(b) * Math.sin(c));
        if(Math.abs(cosA) > 1)
            cosA = Math.sign(cosA);   
        const aFactor = this.pointsWest(vector) ? -1 : 1;     
        const A = aFactor * Math.acos(cosA);

        const i = this.ConvertFromCoLatitude(this.ConvertFromRadians(b));
        const azimuthRad = this.ConvertToRadians(start.Azimuth) + A;
        const azimuth = this.ConvertFromRadians(azimuthRad);

        return this.NormalizeCoordinates(new SphericalCoordinates(azimuth, i));
    }
    pointsWest(vector) {
        let isNegativeDistance = vector.Distance < 0;
        let isDirectionWest = vector.Direction > this.HalfCircumferance && vector.Distance < this.HalfCircumferance;
        if (isNegativeDistance && isDirectionWest)
            return false;
        return isNegativeDistance || isDirectionWest;
    }
    ConvertFromCoLatitude(coLatitude) {
        return -coLatitude - this.Minimum.Inclination;
    }
    ConvertToCoLatitude(inclination) {
        return -inclination - this.Minimum.Inclination;
    }
    GenerateCircle(center, radius, resolution) {
        //Calculate initial direction.
        var initialDirection = 0;
        const middleInclination = (this.Maximum.Inclination - this.Minimum.Inclination) / 2;
        if(center.Inclination > middleInclination)
            initialDirection = 0;
        if(center.Inclination < middleInclination)
            initialDirection = this.HalfCircumferance;
        //Add one degree to avoid polar effect
        initialDirection += this.Circumferance / 360;

        let increment = this.Circumferance / resolution;
        let polygon = [];
        var vector, vertex;
        for (var i = 0; i < resolution; i++){
            vector = new SphericalSurfaceVector(initialDirection + i * increment, radius);
            vector = this.NormalizeVector(vector);
            vertex = this.CalculateCoordinates(center, vector);
            polygon.push(vertex);
        }      
        return polygon;
    }
    NormalizeCoordinates(vertex) {
        let a = vertex.Azimuth;
        let i = vertex.Inclination;

        //Calculate normal ranges
        const nra = this.Circumferance;
        const nraHalf = this.HalfCircumferance;
        const nri = this.HalfCircumferance;
        const nriHalf = this.QuarterCircumferance;

        while (i < this.Minimum.Inclination - nri)
            i += this.Circumferance;
        while (i < this.Minimum.Inclination) {
            i = 2 * this.Minimum.Inclination - i;
            a += nraHalf;
        }
        while (i >= this.Maximum.Inclination + nri)
            i -= this.Circumferance;
        while (i > this.Maximum.Inclination) {
            i = 2 * this.Maximum.Inclination - i;
            a += nraHalf;
        }

        while (a < this.Minimum.Azimuth)
            a += nra;
        while (a >= this.Maximum.Azimuth)
            a -= nra;
        return new SphericalCoordinates(a, i);
    }
    NormalizeVector(vector) {
        let dist = vector.Distance;
        let dir = vector.Direction;

        while (dist < 0)
            dist += this.Circumferance;
        while (dist > this.Circumferance)
            dist -= this.Circumferance;

        if (dist > this.HalfCircumferance) {
            dist = this.Circumferance - dist;
            dir += this.HalfCircumferance;
        }

        while (dir < 0)
            dir += this.Circumferance
        while (dir >= this.Circumferance)
            dir -= this.Circumferance;

            return new SphericalSurfaceVector(dir, dist);
    }
    ConvertToRadians(value){
        const isNumber = typeof(value) === "number";
        if(isNumber)
        return (value * RadialCircumferance) / this.Circumferance;
        const isObject = typeof(value) === "object";
        if(isObject){
            const ar = this.ConvertToRadians(value.Azimuth);
            const ir = this.ConvertToRadians(value.Inclination);
            return new SphericalCoordinates(ar, ir);
        }
        throw new Error("Unsupported type:" +  typeof(value));
    }
    ConvertFromRadians(value){
        const isNumber = typeof(value) === "number";
        if(isNumber)
        return (value / RadialCircumferance) * this.Circumferance;
        const isObject = typeof(value) === "object";
        if(isObject){
            const ar = this.ConvertToRadians(value.Azimuth);
            const ir = this.ConvertToRadians(value.Inclination);
            return new SphericalCoordinates(ar, ir);
        }
        throw new Error("Unsupported type:" +  typeof(value));
    }
}