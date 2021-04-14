import { Injectable } from '@angular/core';
import * as config from './app-config.json';

@Injectable()
export class AppConfigService {
  public readonly apiUrl: string;
  public readonly webSocketUrl: string;

  public constructor() {
    this.apiUrl = config.apiUrl;
    this.webSocketUrl = config.webSocketUrl;
  }
}
