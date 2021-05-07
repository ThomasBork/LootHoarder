import { ContractInventoryPosition } from '../contract-inventory-position';
import { ContractClientMessageType } from './contract-client-message-type';
import { ContractClientWebSocketMessage } from './contract-client-web-socket-message';
import { ContractEquipItemMessageContent } from './contract-equip-item-message-content';

export class ContractEquipItemMessage implements ContractClientWebSocketMessage<ContractEquipItemMessageContent> {
  public typeKey: ContractClientMessageType;
  public data: ContractEquipItemMessageContent;
  public constructor(heroId: number, itemId: number, inventoryPosition: ContractInventoryPosition) {
    this.typeKey = ContractClientMessageType.equipItem;
    this.data = { heroId, itemId, inventoryPosition };
  }
}
