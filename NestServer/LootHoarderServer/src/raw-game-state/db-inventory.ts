import { DbItem } from "./db-item";

export interface DbInventory {
  head?: DbItem;
  leftHand?: DbItem;
  rightHand?: DbItem;
  chest?: DbItem;
  legs?: DbItem;
  leftFoot?: DbItem;
  rightFoot?: DbItem;
}