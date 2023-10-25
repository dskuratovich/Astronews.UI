import { CameraModel } from "./mars-submodels/camera.model";
import { RoverModel } from "./mars-submodels/rover.model";

export interface MarsRootModel {
    photos: MarsModel[];
}

export interface MarsModel{
    id: number;
    sol: number;
    camera: CameraModel;
    img_src: string;
    earth_date: string;
    rover: RoverModel;
}