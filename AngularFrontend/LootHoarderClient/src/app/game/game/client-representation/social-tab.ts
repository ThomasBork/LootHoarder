import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { ChatMessage } from "./chat-message";
import { GameTab } from "./game-tab";
import { User } from "./user";

export class SocialTab extends GameTab {
  public chatMessages: ChatMessage[];
  
  private _connectedUsers: User[];

  public constructor() {
    super(undefined, ContractGameTabKey.social, 'Social');
    this.chatMessages = [];
    this._connectedUsers = [];
    
    this.onOpen.subscribe(() => {
      this.chatMessages.forEach(m => m.isRead = true);
      this.updateNotificationAmount();
    });
  }

  public get connectedUsers(): User[] { return this._connectedUsers; }

  public set connectedUsers(newValue: User[]) {
    this._connectedUsers = newValue;
    this.sortConnectedUsers();
  }


  public updateNotificationAmount(): void {
    const amountOfUnreadMessages = this.chatMessages.filter(message => !message.isRead).length;
    this.notificationAmount = amountOfUnreadMessages;
  }

  public addConnectedUser(user: User): void {
    if (this._connectedUsers.some(u => u.id === user.id)) {
      return;
    }
    this._connectedUsers.push(user);
    this.sortConnectedUsers();
  }

  public removeConnectedUser(userId: number): void {
    const index = this._connectedUsers.findIndex(u => u.id === userId);
    if (index >= 0) {
      this._connectedUsers.splice(index, 1);
    }
  }

  private sortConnectedUsers(): void {
    this._connectedUsers = this._connectedUsers.sort(
      (u1, u2) => 
        u1.userName > u2.userName 
        ? 1
        : -1
    );
  }
}