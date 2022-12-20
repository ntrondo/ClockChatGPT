import { CartesianCoordinates2D } from "./Coordinates";

export class CartesianSphereSystem {
    constructor(min, max) {
        this.Minimum = min;
        this.Maximum = max;

        this.XRange = this.Maximum.X - this.Minimum.X;
        this.HalfXRange = this.XRange / 2;

        this.YRange = this.Maximum.Y - this.Minimum.Y;
        this.HalfYRange = this.YRange / 2;
        this.DoubleYRange = this.YRange * 2;
    }
    Normalize(vertex) {
        let x = vertex.X;
        let y = vertex.Y;


        while (y > this.Minimum.Y + this.DoubleYRange)
            y -= this.DoubleYRange;
        if (y > this.Maximum.Y) {
            y -= 2 * (y - this.Maximum.Y);
            x += this.HalfXRange;
        }

        while (y < (this.Maximum.Y - this.DoubleYRange))
            y += this.DoubleYRange;
        if (y < this.Minimum.Y) {
            y += 2 * (this.Minimum.Y - y);
            x += this.HalfXRange;
        }

        while (x > this.Maximum.X)
            x -= this.XRange;
        while (x < this.Minimum.X)
            x += this.XRange;
            
        return new CartesianCoordinates2D(x, y);
    }
}