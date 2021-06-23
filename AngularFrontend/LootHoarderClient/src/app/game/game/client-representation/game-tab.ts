import { Subject } from "rxjs";
import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";

export abstract class GameTab {
  public parentTab?: GameTab;
  public key: string;
  public name: string;
  public isEnabled: boolean;
  public notificationAmount: number;
  public onOpen: Subject<void>
  public constructor(
    parentTab: GameTab | undefined,
    key: string,
    name: string,
  ) {
    this.parentTab = parentTab;
    this.key = key;
    this.name = name;
    this.isEnabled = true;
    this.notificationAmount = 0;
    this.onOpen = new Subject();
  }
}