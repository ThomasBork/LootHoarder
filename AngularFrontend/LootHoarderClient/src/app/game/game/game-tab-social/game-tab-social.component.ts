import { Component, Input } from '@angular/core';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { UIStateManager } from '../ui-state-manager';
import { ChatMessage } from '../client-representation/chat-message';
import { ContractSendChatMessageMessage } from 'src/loot-hoarder-contract/client-actions/contract-send-chat-message-message';
import { User } from '../client-representation/user';

@Component({
  selector: 'app-game-tab-social',
  templateUrl: './game-tab-social.component.html',
  styleUrls: ['./game-tab-social.component.scss']
})
export class GameTabSocialComponent {
  public newChatMessageContent: string = '';

  public constructor (
    private readonly webSocketService: WebSocketService,
    private readonly uiStateManager: UIStateManager
  ) {

  }

  public get chatMessages(): ChatMessage[] { return this.uiStateManager.state.socialTab.chatMessages; }

  public get connectedUsers(): User[] {
    return this.uiStateManager.state.socialTab.connectedUsers;
  }

  public handleKeyPressInNewChatMessageInput(keyboardEvent: KeyboardEvent): void {
    if (keyboardEvent.key === 'Enter') {
      this.sendMessage();
    }
  }

  public sendMessage(): void {
    if (this.newChatMessageContent.trim().length > 0) {
      const message = new ContractSendChatMessageMessage(this.newChatMessageContent);
      this.webSocketService.send(message);
      this.newChatMessageContent = '';
    }
  }
}
