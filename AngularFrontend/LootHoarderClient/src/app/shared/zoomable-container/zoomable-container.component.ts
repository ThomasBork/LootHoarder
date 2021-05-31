import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-zoomable-container',
    templateUrl: './zoomable-container.component.html',
    styleUrls: ['./zoomable-container.component.scss']
})
export class ZoomableContainerComponent {
  @Input() viewPortX: number = 0;
  @Input() viewPortY: number = 0;
  @Input() zoom: number = 1;

  public dragStartX?: number;
  public dragStartY?: number;
  
  
  public startDragging(mouseEvent: MouseEvent): void {
    this.dragStartX = mouseEvent.clientX;
    this.dragStartY = mouseEvent.clientY;
  }

  public stopDragging(mouseEvent: MouseEvent): void {
    this.dragStartX = undefined;
    this.dragStartY = undefined;
  }

  public handleMouseMove(mouseEvent: MouseEvent): void {
    if (this.dragStartX && this.dragStartY) {
      mouseEvent.preventDefault();

      const newDragStartX = mouseEvent.clientX;
      const newDragStartY = mouseEvent.clientY;
      const deltaX = (newDragStartX - this.dragStartX) / this.zoom;
      const deltaY = (newDragStartY - this.dragStartY) / this.zoom;
      let newX = this.viewPortX + deltaX;
      let newY = this.viewPortY + deltaY;

      this.viewPortX = newX;
      this.viewPortY = newY;
      this.dragStartX = newDragStartX;
      this.dragStartY = newDragStartY;
    }
  }

  public handleMouseScroll(mouseEvent: WheelEvent): void {
    mouseEvent.preventDefault();

    const scrollSpeed = mouseEvent.deltaY;
    const zoomChangeExponent = -scrollSpeed / 100;
    const zoomChangeBase = 1.1;
    const zoomChangeFactor = Math.pow(zoomChangeBase, zoomChangeExponent);
    const oldZoom = this.zoom;
    const newZoom = this.zoom * zoomChangeFactor;

    const browserElement = mouseEvent.currentTarget as HTMLElement;

    const browserElementX = mouseEvent.clientX - browserElement.offsetLeft;
    const browserElementY = mouseEvent.clientY - browserElement.offsetTop;

    const contentX = browserElementX / oldZoom - this.viewPortX;
    const contentY = browserElementY / oldZoom - this.viewPortY;

    const newX = browserElementX / newZoom - contentX;
    const newY = browserElementY / newZoom - contentY;
    
    console.log(
      "mouseEvent.clientX", mouseEvent.clientX, 
      "browserElement.offsetLeft", browserElement.offsetLeft, 
      "browserElementX", browserElementX, 
      "browserElementY", browserElementY, 
      "contentX", contentX, 
      "contentY", contentY
    );

    this.viewPortX = newX;
    this.viewPortY = newY;
    this.zoom = newZoom;
  }
}
