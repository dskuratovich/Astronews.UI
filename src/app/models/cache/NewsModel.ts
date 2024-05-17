import { NewsModel } from "../news.model";

export interface NewsCacheModel {
    created: Date;
    data: NewsModel[];
}