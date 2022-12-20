import { CartesianCoordinates2D } from "./Coordinates";

export class MercatorProjector {
    constructor(sourceSystem, targetSystem) {
        this.SourceSystem = sourceSystem;
        this.TargetSystem = targetSystem;
    }
    Project(coordinates) {
        const innerProject = (sValue, sMin, sMax, tMin, tMax) => {
            const sRange = sMax - sMin;
            const uVal = (sValue - sMin) / sRange;
            const tRange = tMax - tMin;
            return uVal * tRange + tMin;
        };
        const x = innerProject(
            coordinates.Azimuth,
            this.SourceSystem.Minimum.Azimuth,
            this.SourceSystem.Maximum.Azimuth,
            this.TargetSystem.Minimum.X,
            this.TargetSystem.Maximum.X
        );
        const y = innerProject(
            coordinates.Inclination,
            this.SourceSystem.Minimum.Inclination,
            this.SourceSystem.Maximum.Inclination,
            this.TargetSystem.Minimum.Y,
            this.TargetSystem.Maximum.Y
        );
        return new CartesianCoordinates2D(x, y);
    }
}