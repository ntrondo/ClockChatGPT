import { CartesianCoordinates2D } from "./Coordinates";

export class VerticalInverter{
    constructor(sourceSystem, targetSystem) {
        this.SourceSystem = sourceSystem;
        this.TargetSystem = targetSystem;
    }
    Project(coordinates) {
        const y = this.SourceSystem.Maximum.Y - coordinates.Y;
        return new CartesianCoordinates2D(coordinates.X, y);
    }
}