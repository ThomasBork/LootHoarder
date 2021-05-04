import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SetSetting } from "./set-setting";

@CommandHandler(SetSetting)
export class SetSettingHandler implements ICommandHandler<SetSetting> {
  public async execute(command: SetSetting): Promise<void> {
    command.game.settings.setSetting(command.type, command.value);
  }
}
