import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ContractChatMessageSentMessage } from "src/loot-hoarder-contract/server-actions/contract-chat-message-sent-message";
import { ContractServerChatMessageType } from "src/loot-hoarder-contract/server-actions/contract-server-chat-message-type";
import { ConnectionsManager } from "src/services/connections-manager";
import { SendChatMessage } from "./send-chat-message";

@CommandHandler(SendChatMessage)
export class SendChatMessageHandler implements ICommandHandler<SendChatMessage> {
  public constructor(
    private readonly connectionsManager: ConnectionsManager
  ) {

  }

  public async execute(command: SendChatMessage): Promise<void> {
    const message = new ContractChatMessageSentMessage(command.userId, command.userName, command.messageContent, ContractServerChatMessageType.userMessage);
    this.connectionsManager.sendMessageToAll(message);
  }
}
