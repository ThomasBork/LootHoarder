import { Component } from '@angular/core';
import { AuthService } from './auth/service/auth.service';
import { AppConfigService } from './app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  messages: string[] = [];
  //ws: WebSocket; 

  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService
  ) {
    // this.ws = new WebSocket(appConfigService.webSocketUrl);

    // this.ws.onopen = (event: Event) => {
    //   this.ws.send(JSON.stringify({ type: 'bonjour', data: 'chat message hello' }));
    // };
  
    // this.ws.onmessage = (message) => {
    //   this.messages.push(message.data);
    //   console.log(message);
    //   this.ws.send(JSON.stringify({ type: 'bonjour', data: 'hello' }));
    // };
  }
}
