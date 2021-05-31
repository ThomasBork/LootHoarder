import { Injectable } from '@angular/core';
import * as developConfig from './app-config.json';
import * as productionConfig from './app-config-production.json';

@Injectable()
export class AppConfigService {
  public readonly apiUrl: string;
  public readonly webSocketUrl: string;

  public constructor() {
    this.apiUrl = developConfig.apiUrl;
    this.webSocketUrl = developConfig.webSocketUrl;
  }
}
