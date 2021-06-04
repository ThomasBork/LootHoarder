import { ChatMessage } from "./chat-message";
import { User } from "./user";

export class SocialTab {
  public chatMessages: ChatMessage[];
  
  private _connectedUsers: User[];

  public constructor() {
    this.chatMessages = [];
    this._connectedUsers = [];
  }

  public get connectedUsers(): User[] { return this._connectedUsers; }

  public set connectedUsers(newValue: User[]) {
    this._connectedUsers = newValue;
    this.sortConnectedUsers();
  }

  public addConnectedUser(user: User): void {
    if (this._connectedUsers.some(u => u.id === user.id)) {
      return;
    }
    this._connectedUsers.push(user);
    this.sortConnectedUsers();
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