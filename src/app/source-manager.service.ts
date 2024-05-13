import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SourceManagerService {
  private readonly Keyword = 'BannedSources';

  constructor() {}

  getBannedSources(): string[] {
    let jsonString: string | null = localStorage.getItem(this.Keyword);

    let bannedSourcesList: string[] = [];

    if (jsonString !== null) {
      bannedSourcesList = JSON.parse(jsonString);
    }

    return bannedSourcesList;
  }

  banSource(sourceName: string): void {
    let jsonString: string | null = localStorage.getItem(this.Keyword);

    let bannedSourcesList: string[] = [];

    if (jsonString !== null) {
      bannedSourcesList = JSON.parse(jsonString);
    }

    bannedSourcesList.push(sourceName);

    localStorage.setItem(this.Keyword, JSON.stringify(bannedSourcesList));
  }

  unbanSource(sourceName: string): boolean {
    let jsonString: string | null = localStorage.getItem(this.Keyword);

    if (jsonString !== null) {
      let bannedSourcesList: string[] = JSON.parse(jsonString);

      const indexToRemove = bannedSourcesList.indexOf(sourceName);

      if (indexToRemove !== -1) {
        bannedSourcesList.splice(indexToRemove, 1);
        localStorage.setItem(this.Keyword, JSON.stringify(bannedSourcesList));
        return true;
      }
    }

    return false;
  }
}
