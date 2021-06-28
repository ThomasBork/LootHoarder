import { DbCharacterBehaviorAction } from "./db-character-behavior-action";

export interface DbCharacterBehavior {
  id: number;
  name: string;
  prioritizedActions: DbCharacterBehaviorAction[];
}