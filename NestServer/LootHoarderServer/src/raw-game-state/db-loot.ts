import { DbItem } from "./db-item";

export interface DbLoot {
  items: DbItem[];
  gold: number;
}