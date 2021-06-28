
import { ContractCharacterBehavior } from "../contract-character-behavior";

export interface ContractUpdateHeroBehaviorMessageContent {
  heroId: number;
  behavior: ContractCharacterBehavior;
}