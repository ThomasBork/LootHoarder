import { ContractContinuousEffect } from "./contract-continuous-effect";

export interface ContractContinuousEffectAddedMessageContent {
  combatCharacterId: number;
  continuousEffect: ContractContinuousEffect;
}
