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

  public zoom: number = 1.0;
  public x: number = 0;
  public y: number = 0;

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


  public handleWorldKeyDown(keyEvent: KeyboardEvent): void {
    switch(keyEvent.key) {
      case 'ArrowLeft': {
        this.x--;
      }
      break;
      case 'ArrowRight': {
        this.x++;
      }
      break;
      case 'ArrowUp': {
        this.y--;
      }
      break;
      case 'ArrowDown': {
        this.y++;
      }
      break;
    }
  }

  public handleWorldMouseDown(mouseEvent: MouseEvent): void {
    const worldX = mouseEvent.x;
    const worldY = mouseEvent.y;
    
  }

  public handleWorldMouseScroll(mouseEvent: WheelEvent): void {
    const scrollSpeed = mouseEvent.deltaY;
    const exponent = -scrollSpeed / 100;
    const base = 1.1;
    const changeFactor = Math.pow(base, exponent);
    this.zoom *= changeFactor;
    mouseEvent.preventDefault();
  }
}
