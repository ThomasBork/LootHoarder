import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import { AuthService } from "src/app/auth/service/auth.service";
import { WebSocketMessage } from "./web-socket-message";

@Injectable() 
export class WebSocketService {
  public onMessage: Subject<WebSocketMessage>;
  public isAuthenticated: boolean = false;

  private ws?: WebSocket; 

  public constructor(
    private readonly appConfigService: AppConfigService,
    private readonly authService: AuthService
  ) {
    this.onMessage = new Subject();
  }

  public connect(): Promise<void> {
    this.isAuthenticated = false;
    this.ws = undefined;

    const promise = new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(this.appConfigService.webSocketUrl);
  
      this.ws.onopen = (event: Event) => {
        if (!this.ws) {
          reject('Connection was aborted.');
          return;
        }
  
        const authToken = this.authService.getAuthToken();
  
        if (!authToken) {
          reject('Cannot connect to web socket without an auth token.');
          return;
        }
  
        this.ws.send(authToken);
      };
    
      this.ws.onmessage = (message: MessageEvent<string>) => {
        console.log('Message received:', message);
        const messageAsObject = JSON.parse(message.data);
        if (messageAsObject.typeKey === 'authentication-response') {
          if (messageAsObject.data.success) {
            this.isAuthenticated = true;
            resolve();
          } else {
            reject(messageAsObject.data.error);
          }
        }
        this.onMessage.next(messageAsObject);
      };
    });

    return promise;
  }

  public disconnect(): void {
    this.ws?.close();
    this.ws = undefined;
    this.isAuthenticated = false;
    this.onMessage = new Subject();
  }

  public send(message: WebSocketMessage): void {
    if (!this.ws) {
      throw Error ('Cannot send a message when the web socket is not connected.');
    }

    const jsonMessage = JSON.stringify(message);

    this.ws.send(jsonMessage);
  }
}
