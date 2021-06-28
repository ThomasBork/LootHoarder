import { ContractCharacterBehaviorAction } from "./contract-character-behavior-action";

export interface ContractCharacterBehavior {
  id: number;
  name: string;
  prioritizedActions: ContractCharacterBehaviorAction[];
}