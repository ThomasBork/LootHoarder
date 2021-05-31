import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TakeHeroSkillNode } from "./take-hero-skill-node";

@CommandHandler(TakeHeroSkillNode)
export class TakeHeroSkillNodeHandler implements ICommandHandler<TakeHeroSkillNode> {
  public constructor(
  ) {}

  public async execute(command: TakeHeroSkillNode): Promise<void> {
    const game = command.game;
    const hero = game.heroes.find(h => h.id === command.heroId);

    if (!hero) {
      throw Error (`Could not find hero with id: ${command.heroId}`);
    }

    hero.takeSkillNode(command.nodeX, command.nodeY);
  }
}
