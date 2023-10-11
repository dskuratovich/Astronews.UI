import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {

  private apikey: string = '';

  constructor() { }

  setApiKey(key: string): void {
    this.apikey = key;
  }

  getApiKey(): string {
    return this.apikey;
  }
}
