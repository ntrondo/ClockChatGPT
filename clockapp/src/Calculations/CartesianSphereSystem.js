import { removeItem , getSmallest} from "./Array";
import { CartesianCoordinates2D } from "./Coordinates";
import { CartesianVector2D } from "./Vector";

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
    /**Order vertices by distance.*/
    Order(vertices) {
        vertices = [...vertices];        
        var vertex  = getSmallest(vertices, (v)=> v.X);        
        const ordered = [];
        while(vertices.length > 0) {
            var vertex = this.GetClosest(vertices, vertex);
            ordered.push(vertex);
            removeItem(vertices, vertex);
        }
        return ordered;
    }
    GetClosest(vertices, reference) {
        if (vertices.Length == 0)
            return null;
        var closest = vertices[0];
        var vector = new CartesianVector2D(reference, closest);
        let minimum = vector.getLength();
        for (var i = 1; i < vertices.length; i++) {
            vector = new CartesianVector2D(reference, vertices[i]);
            if (vector.getLength() < minimum) {
                closest = vertices[i];
                minimum = vector.getLength();
            }
        }
        return closest;
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