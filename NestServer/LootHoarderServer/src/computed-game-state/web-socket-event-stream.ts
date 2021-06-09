import { ContractServerWebSocketMessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-message";
import { ContractServerWebSocketMultimessage } from "src/loot-hoarder-contract/server-actions/contract-server-web-socket-multimessage";
import { EventStream } from "./event-stream";

export class WebSocketEventStream extends EventStream<ContractServerWebSocketMessage> {
  public constructor() {
    super();
  }

  public flushEventBucketAsMultimessage(): ContractServerWebSocketMultimessage {
    const messages = this.flushEventBucket();
    return new ContractServerWebSocketMultimessage(messages);
  }

  public flushEventBucketAndSendTheResultAsMultimessage(): void {
    const message = this.flushEventBucketAsMultimessage();
    this.next(message);
  }
}
