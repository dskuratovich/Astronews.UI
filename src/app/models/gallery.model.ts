import { DataModel } from "./gallery-submodels/data.model";
import { LinkModel } from "./gallery-submodels/link.model";

export interface GalleryModel {
    assets: string[];
    data: DataModel[];
    links: LinkModel[];
}