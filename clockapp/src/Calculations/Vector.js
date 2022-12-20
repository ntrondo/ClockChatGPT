export class SphericalSurfaceVector{
    constructor(direction, distance){
        this.Direction = direction;
        this.Distance = distance;
    }
}
export class CartesianVector2D{    
    constructor(a,b){
        this.X = b.X - a.X;
        this.Y = b.Y - a.Y;
    }
    getLength(){
        if(!this.IsLengthSet){
            const sum = this.X * this.X + this.Y * this.Y;
            this.Length = Math.sqrt(sum);
            this.IsLengthSet = true;
        }
        return this.Length;
    }
}