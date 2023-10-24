import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {

  private apiKey: string = '0fu6kxm8VJ28tAbk0iRAfazBSiqBW5v344fYDIiR';

  constructor() { }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  getApiKey(): string {
    return this.apiKey;
  }
}
