import { ContractGameTabKey } from "./contract-game-tab-key";

export interface ContractGameTab {
  parentTabKey: ContractGameTabKey;
  childTabKey: string | undefined;
}
