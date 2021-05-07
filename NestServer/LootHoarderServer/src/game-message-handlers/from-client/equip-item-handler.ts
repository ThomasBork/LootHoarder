import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EquipItem } from "./equip-item";

@CommandHandler(EquipItem)
export class EquipItemHandler implements ICommandHandler<EquipItem> {
  public constructor(
  ) {}

  public async execute(command: EquipItem): Promise<void> {
    const game = command.game;
    const hero = game.heroes.find(h => h.id === command.heroId);
    const item = game.items.find(i => i.id === command.itemId);

    if (!hero) {
      throw Error (`Could not find hero with id: ${command.heroId}`);
    }

    if (!item) {
      throw Error (`Could not find item with id: ${command.itemId}`);
    }

    game.removeItem(item.id);
    hero.equipItem(item, command.inventoryPosition);
  }
}
