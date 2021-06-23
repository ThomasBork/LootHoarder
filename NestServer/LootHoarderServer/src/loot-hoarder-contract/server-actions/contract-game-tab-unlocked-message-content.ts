import { ContractGameTabKey } from "../contract-game-tab-key";

export interface ContractGameTabUnlockedMessageContent {
  parentTabKey: ContractGameTabKey;
  childTabKey: string | undefined;
}
