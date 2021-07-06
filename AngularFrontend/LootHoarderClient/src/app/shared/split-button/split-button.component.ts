import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-split-button',
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.scss']
})
export class SplitButtonComponent {
  @Input()
  public title!: string;
  @Input()
  public anchorToRightSide: boolean;

  public isOpen: boolean;

  public constructor() {
    this.isOpen = false;
    this.anchorToRightSide = false;
  }

  public toggleIsOpen(): void {
    this.isOpen = !this.isOpen;
  }
}
