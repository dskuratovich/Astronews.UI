import { CameraModel } from "./mars-submodels/camera.model";
import { RoverModel } from "./mars-submodels/rover.model";

export interface MarsModel{
    id: number;
    sol: number;
    camera: CameraModel;
    imgSrc: string;
    earthDate: string;
    rover: RoverModel;
}