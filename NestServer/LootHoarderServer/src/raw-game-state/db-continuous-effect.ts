import { DbPassiveAbility } from "./db-passive-ability";

export interface DbContinuousEffect {
  id: number;
  typeKey: string;
  lastsIndefinitely: boolean;
  timeRemaining: number;
  abilities: DbPassiveAbility[];
}
