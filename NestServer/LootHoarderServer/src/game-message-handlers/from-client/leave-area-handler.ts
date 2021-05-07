import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LeaveArea } from "./leave-area";

@CommandHandler(LeaveArea)
export class LeaveAreaCombatHandler implements ICommandHandler<LeaveArea> {
  public constructor(
  ) {}

  public async execute(command: LeaveArea): Promise<void> {
    const game = command.game;
    const area = command.area;

    game.takeLootAndLeaveArea(area);
  }
}
