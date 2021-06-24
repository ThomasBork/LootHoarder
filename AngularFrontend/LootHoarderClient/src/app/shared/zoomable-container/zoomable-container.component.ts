import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: 'app-zoomable-container',
    templateUrl: './zoomable-container.component.html',
    styleUrls: ['./zoomable-container.component.scss']
})
export class ZoomableContainerComponent implements AfterViewInit, OnChanges {
  @ViewChild('container') private containerElementRef!: ElementRef;

  @Input() public centerX?: number;
  @Input() public centerY?: number;
  @Input() public viewPortX: number = 0;
  @Input() public viewPortY: number = 0;
  @Input() public zoom: number = 1;
  @Input() public minX?: number;
  @Input() public minY?: number;
  @Input() public maxX?: number;
  @Input() public maxY?: number;
  @Input() public centerChanged?: Subject<void>;

  public dragStartX?: number;
  public dragStartY?: number;
  
  public ngAfterViewInit(): void {
    setTimeout(() => this.setViewPortCoordinatesBasedOnCenterCoordinates(), 0);
    if (this.centerChanged) {
      this.centerChanged.subscribe(() => 
        setTimeout(() => this.setViewPortCoordinatesBasedOnCenterCoordinates(), 0)
      );
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.centerX || changes.centerY) {
      setTimeout(() => this.setViewPortCoordinatesBasedOnCenterCoordinates(), 0);
    }
  }

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
      mouseEvent.buttons
      const newDragStartX = mouseEvent.clientX;
      const newDragStartY = mouseEvent.clientY;
      const deltaX = (newDragStartX - this.dragStartX) / this.zoom;
      const deltaY = (newDragStartY - this.dragStartY) / this.zoom;
      let newX = this.viewPortX + deltaX;
      let newY = this.viewPortY + deltaY;

      this.restrictAndSetValues(newX, newY, this.zoom);
      this.dragStartX = newDragStartX;
      this.dragStartY = newDragStartY;
    } else {
      // Left mouse is pressed
      if (mouseEvent.buttons === 1) {
        this.dragStartX = mouseEvent.clientX;
        this.dragStartY = mouseEvent.clientY;
      }
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
    const browserElementCoordinates = browserElement.getBoundingClientRect();
    const browserElementX = mouseEvent.clientX - browserElementCoordinates.x;
    const browserElementY = mouseEvent.clientY - browserElementCoordinates.y;

    const contentX = browserElementX / oldZoom - this.viewPortX;
    const contentY = browserElementY / oldZoom - this.viewPortY;

    const newX = browserElementX / newZoom - contentX;
    const newY = browserElementY / newZoom - contentY;

    this.restrictAndSetValues(newX, newY, newZoom);
  }

  private restrictAndSetValues(x: number, y: number, zoom: number): void {
    if (
      this.minX === undefined
      || this.minY === undefined
      || this.maxX === undefined
      || this.maxY === undefined
    ) {
      this.viewPortX = x;
      this.viewPortY = y;
      this.zoom = zoom;
      return;
    }

    const maxWidth = this.maxX - this.minX;
    const maxHeight = this.maxY - this.minY;

    const containerElement = this.containerElementRef.nativeElement as HTMLElement;
    const elementWidth = containerElement.clientWidth;
    const elementHeight = containerElement.clientHeight;

    const minZoomForWidth = elementWidth / maxWidth;
    const minZoomForHeight = elementHeight / maxHeight;

    const newZoom = Math.max(zoom, minZoomForWidth, minZoomForHeight);

    const wasZoomPreventedFromChanging = newZoom !== zoom && newZoom === this.zoom;
    if (wasZoomPreventedFromChanging) {
      return;
    }

    const minViewPortX = -this.maxX + elementWidth / newZoom;
    const minViewPortY = -this.maxY + elementHeight / newZoom;
    const maxViewPortX = -this.minX;
    const maxViewPortY = -this.minY;

    let newX = x;
    let newY = y;

    if (x < minViewPortX) {
      newX = minViewPortX;
    } else if (x > maxViewPortX) {
      newX = maxViewPortX;
    }

    if (y < minViewPortY) {
      newY = minViewPortY;
    } else if (y > maxViewPortY) {
      newY = maxViewPortY;
    }

    this.viewPortX = newX;
    this.viewPortY = newY;
    this.zoom = newZoom;
  }

  private setViewPortCoordinatesBasedOnCenterCoordinates(): void {
    if (this.centerX && this.centerY) {
      const containerElement = this.containerElementRef.nativeElement as HTMLElement;
      const elementWidth = containerElement.clientWidth;
      const elementHeight = containerElement.clientHeight;

      const viewPortWidth = elementWidth / this.zoom;
      const viewPortHeight = elementHeight / this.zoom;

      this.viewPortX = -this.centerX + viewPortWidth / 2;
      this.viewPortY = -this.centerY + viewPortHeight / 2;
    }
    this.restrictAndSetValues(this.viewPortX, this.viewPortY, this.zoom);
  }
}
