import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SourceManagerService } from './source-manager.service';

@Injectable({
  providedIn: 'root',
})
export class UrlBuilderService {
  constructor(private sourceManager: SourceManagerService) {}

  getNewsUrl(
    limit: number = 16,//600,
    source: string[] = [],
    published_after: string = '',
    published_before: string = '',
    title_summary: string = '',
    summary: string[] = [],
    title: string[] = []
  ): string {
    let newsUrlBase = environment.api.newsEndpoint;

    newsUrlBase += `?limit=${limit}`;

    if (source.length > 0) {
      newsUrlBase += `&news_site=${source[0]}`;

      for (let index = 1; index < source.length; index++) {
        newsUrlBase += `%2C${source[index]}`;
      }
    }

    let bannedSources = this.sourceManager.getBannedSources();

    if(bannedSources.length > 0) {
      newsUrlBase += `&news_site_exclude=${bannedSources[0]}`;

      for (let index = 1; index < bannedSources.length; index++) {
        newsUrlBase += `%2C${bannedSources[index]}`;
      }
    }

    if(this.isISO8601Date(published_after)) {
      newsUrlBase += `&published_at_gte=${published_after}`;
    }

    if(this.isISO8601Date(published_before)) {
      newsUrlBase += `&published_at_lte=${published_before}`;
    }

    if (title_summary !== '') {
      newsUrlBase += `&search=${title_summary}`;
    }

    if (summary.length > 0) {
      newsUrlBase += `&summary_contains_one=${summary[0]}`;

      for (let index = 1; index < summary.length; index++) {
        newsUrlBase += `%2C${summary[index]}`;
      }
    }

    if (title.length > 0) {
      newsUrlBase += `&title_contains_one=${title[0]}`;

      for (let index = 0; index < title.length; index++) {
        newsUrlBase += `%2C${title[index]}`;
      }
    }

    return newsUrlBase;
  }

  isISO8601Date(dateString: string): boolean {
    const iso8601Pattern = /^\d{4}-\d{2}-\d{2}$/;
  
    return iso8601Pattern.test(dateString);
  }
}
