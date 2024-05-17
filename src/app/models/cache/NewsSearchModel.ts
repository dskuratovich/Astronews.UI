import { NewsModel } from "../news.model";

export interface NewsSearchModel {
    searchTerm: string;
    created: Date;
    data: NewsModel[];
}