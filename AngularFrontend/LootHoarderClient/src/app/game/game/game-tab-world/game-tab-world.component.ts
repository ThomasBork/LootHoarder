import { Component, Input } from '@angular/core';
import { GameAreaType } from '../client-representation/game-area-type';
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-world',
  templateUrl: './game-tab-world.component.html',
  styleUrls: ['./game-tab-world.component.scss']
})
export class GameTabWorldComponent {
  public selectedGameAreaType?: GameAreaType;

  public constructor(
    private readonly uiStateManager: UIStateManager
  ) {}

  public get allAreaTypes(): GameAreaType[] {
    return this.uiStateManager.state.game.allAreaTypes;
  }

  public get x(): number { return this.uiStateManager.state.worldTab.worldMapX; }
  public set x(newValue: number) { this.uiStateManager.state.worldTab.worldMapX = newValue; }
  public get y(): number { return this.uiStateManager.state.worldTab.worldMapY; }
  public set y(newValue: number) { this.uiStateManager.state.worldTab.worldMapY = newValue; }
  public get zoom(): number { return this.uiStateManager.state.worldTab.worldMapZoom; }
  public set zoom(newValue: number) { this.uiStateManager.state.worldTab.worldMapZoom = newValue; }
  public get worldMapWidth(): number { return this.uiStateManager.state.worldTab.worldMapWidth; }
  public get worldMapHeight(): number { return this.uiStateManager.state.worldTab.worldMapHeight; }
  public get worldMapFixtureX(): number { return this.uiStateManager.state.worldTab.worldMapFixtureX; }
  public get worldMapFixtureY(): number { return this.uiStateManager.state.worldTab.worldMapFixtureY; }

  public selectGameAreaType(areaType: GameAreaType): void {
    if (!areaType.isAvailable) {
      return;
    }
    this.selectedGameAreaType = areaType;
  }

  public isGameAreaTypeDiscovered(areaType: GameAreaType): boolean {
    return areaType.isAvailable || areaType.isCompleted;
  }

  public getGameAreaTypeLeft(areaType: GameAreaType): string {
    return (areaType.type.x + this.worldMapFixtureX) + 'px';
  }

  public getGameAreaTypeTop(areaType: GameAreaType): string {
    return (areaType.type.y + this.worldMapFixtureY - 30) + 'px';
  }
}
