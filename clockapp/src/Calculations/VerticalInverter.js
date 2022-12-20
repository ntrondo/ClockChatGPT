import { CartesianCoordinates2D } from "./Coordinates";

export class VerticalInverter{
    constructor(system) {
        this.System = system;
    }
    Project(coordinates) {
        const y = this.System.Maximum.Y - coordinates.Y;
        return new CartesianCoordinates2D(coordinates.X, y);
    }
}