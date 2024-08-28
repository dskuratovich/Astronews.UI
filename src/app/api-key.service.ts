import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {

  private config: { [key: string]: string };
  //private apiKey: string = environment.secrets.api_key;
  constructor() {
    this.config = window['__env'] || {};
  }

  /*setApiKey(key: string): void {
    this.apiKey = key;
  }*/

  getApiKey(): string {
    return this.config['NASA_API_KEY'] || '';
  }

  /*getApiKey(): string {
    return this.apiKey || '';
  }*/
}
