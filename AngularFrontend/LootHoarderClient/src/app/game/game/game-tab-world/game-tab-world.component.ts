import { Component, Input } from '@angular/core';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { Area } from '../client-representation/area';
import { Game } from '../client-representation/game';
import { AreaType } from '../client-representation/area-type';
import { ContractEnterAreaMessage } from 'src/loot-hoarder-contract/client-actions/contract-enter-area-message';
import { WorldTab } from '../client-representation/world-tab';
import { GameAreaType } from '../client-representation/game-area-type';
import { UIStateManager } from '../ui-state-manager';

@Component({
  selector: 'app-game-tab-world',
  templateUrl: './game-tab-world.component.html',
  styleUrls: ['./game-tab-world.component.scss']
})
export class GameTabWorldComponent {
  public selectedGameAreaType?: GameAreaType;

  private dragStartX?: number;
  private dragStartY?: number;

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

  public startDragging(mouseEvent: MouseEvent): void {
    this.dragStartX = mouseEvent.clientX;
    this.dragStartY = mouseEvent.clientY;
  }

  public handleWorldMouseMove(mouseEvent: MouseEvent): void {
    if (this.dragStartX && this.dragStartY) {
      mouseEvent.preventDefault();

      const newDragStartX = mouseEvent.clientX;
      const newDragStartY = mouseEvent.clientY;
      const deltaX = (newDragStartX - this.dragStartX) / this.zoom;
      const deltaY = (newDragStartY - this.dragStartY) / this.zoom;
      let newX = this.x + deltaX;
      let newY = this.y + deltaY;
      const browserElement = mouseEvent.currentTarget as Element;
      const worldMapHeight = this.worldMapHeight * this.zoom;
      const worldMapWidth = this.worldMapWidth * this.zoom;
      const minX = browserElement.clientWidth - worldMapWidth;
      const minY = browserElement.clientHeight - worldMapHeight;
      if (newX < minX) {
        newX = minX;
      }
      if (newY < minY) {
        newY = minY;
      }
      this.setXWithinElementBoundaries(newX, browserElement);
      this.setYWithinElementBoundaries(newY, browserElement);
      this.dragStartX = newDragStartX;
      this.dragStartY = newDragStartY;
    }
  }

  public stopDragging(mouseEvent: MouseEvent): void {
    this.dragStartX = undefined;
    this.dragStartY = undefined;
  }

  public handleWorldMouseScroll(mouseEvent: WheelEvent): void {
    mouseEvent.preventDefault();

    const scrollSpeed = mouseEvent.deltaY;
    const zoomChangeExponent = -scrollSpeed / 100;
    const zoomChangeBase = 1.1;
    const zoomChangeFactor = Math.pow(zoomChangeBase, zoomChangeExponent);
    const oldZoom = this.zoom;
    const newZoom = this.zoom * zoomChangeFactor;

    const browserElement = mouseEvent.currentTarget as Element;

    const mapHeightWithNewZoom = newZoom * this.worldMapHeight;
    const mapWidthWithNewZoom = newZoom * this.worldMapWidth;
    if (
      browserElement.clientWidth > mapWidthWithNewZoom
      || browserElement.clientHeight > mapHeightWithNewZoom
    ) {
      return;
    }

    const browserElementX = mouseEvent.clientX - browserElement.clientLeft;
    const browserElementY = mouseEvent.clientY - browserElement.clientTop;
    const worldX = -this.x + browserElementX / oldZoom;
    const worldY = -this.y + browserElementY / oldZoom;
    const newX = -worldX + browserElementX / newZoom;
    const newY = -worldY + browserElementY / newZoom;

    this.setXWithinElementBoundaries(newX, browserElement);
    this.setYWithinElementBoundaries(newY, browserElement);
    this.zoom = newZoom;
  }

  private setXWithinElementBoundaries(newValue: number, browserElement: Element): void {
    if (newValue > 0) {
      newValue = 0;
    } else {
      const worldMapWidth = this.worldMapWidth * this.zoom;
      const minValue = browserElement.clientWidth - worldMapWidth;
      if (newValue < minValue) {
        newValue = minValue;
      }
    }

    this.x = newValue;
  }

  private setYWithinElementBoundaries(newValue: number, browserElement: Element): void {
    if (newValue > 0) {
      newValue = 0;
    } else {
      const worldMapHeight = this.worldMapHeight * this.zoom;
      const minValue = browserElement.clientHeight - worldMapHeight;
      if (newValue < minValue) {
        newValue = minValue;
      }
    }

    this.y = newValue;
  }
}
