import { Component, Input } from '@angular/core';
import { WebSocketService } from '../../web-socket/web-socket.service';
import { Area } from '../client-representation/area';
import { Game } from '../client-representation/game';
import { AreaType } from '../client-representation/area-type';
import { ContractEnterAreaMessage } from 'src/loot-hoarder-contract/client-actions/contract-enter-area-message';
import { WorldTab } from '../client-representation/world-tab';
import { GameAreaType } from '../client-representation/game-area-type';

@Component({
  selector: 'app-game-tab-world',
  templateUrl: './game-tab-world.component.html',
  styleUrls: ['./game-tab-world.component.scss']
})
export class GameTabWorldComponent {
  @Input()
  public game!: Game;
  @Input()
  public worldTab!: WorldTab;

  public selectedGameAreaType?: GameAreaType;

  private dragStartX?: number;
  private dragStartY?: number;
  private readonly worldMapWidth = 8000;
  private readonly worldMapHeight = 4000;

  public get areaTypes(): AreaType[] {
    return this.game.availableAreaType;
  }

  public get x(): number { return this.worldTab.worldMapX; }
  public set x(newValue: number) { this.worldTab.worldMapX = newValue; }
  public get y(): number { return this.worldTab.worldMapY; }
  public set y(newValue: number) { this.worldTab.worldMapY = newValue; }
  public get zoom(): number { return this.worldTab.worldMapZoom; }
  public set zoom(newValue: number) { this.worldTab.worldMapZoom = newValue; }

  public selectGameAreaType(areaType: GameAreaType): void {
    if (!areaType.isAvailable) {
      return;
    }
    this.selectedGameAreaType = areaType;
  }

  public getGameAreaTypeLeft(areaType: GameAreaType): string {
    return areaType.type.x - 30 + 'px';
  }

  public getGameAreaTypeTop(areaType: GameAreaType): string {
    return areaType.type.y - 85 + 'px';
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
      const deltaX = newDragStartX - this.dragStartX;
      const deltaY = newDragStartY - this.dragStartY;
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
