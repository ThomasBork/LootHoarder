import { Component, Input, OnInit } from '@angular/core';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { Area } from '../client-representation/area';
import { Game } from '../client-representation/game';
import { AreaType } from '../client-representation/area-type';
import { ContractEnterAreaMessage } from 'src/loot-hoarder-contract/client-actions/contract-enter-area-message';

@Component({
  selector: 'app-game-tab-world',
  templateUrl: './game-tab-world.component.html',
  styleUrls: ['./game-tab-world.component.scss']
})
export class GameTabWorldComponent {
  @Input()
  public game!: Game;

  public constructor(
    private readonly webSocketService: WebSocketService
  ) {}

  public get areaTypes(): AreaType[] {
    return this.game.availableAreaType;
  }

  public enterAreaType(areaType: AreaType): void {
    const message = new ContractEnterAreaMessage(areaType.key, [this.game.heroes[0].id]);
    this.webSocketService.send(message);
  }

  public getAreasWithType(areaType: AreaType): Area[] {
    return this.game.areas.filter(area => area.type === areaType);
  }
}
