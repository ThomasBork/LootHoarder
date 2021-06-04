export class SendChatMessage {
  public constructor(
    public readonly userId: number,
    public readonly userName: string,
    public readonly messageContent: string
  ){}
}