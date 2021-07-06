import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent {
  @Input()
  public checked!: boolean;

  @Input()
  public disabled?: boolean;

  @Output()
  public checkedChange: EventEmitter<boolean>;

  public constructor() {
    this.checkedChange = new EventEmitter();
  }

  public toggle(): void {
    this.setChecked(!this.checked);
  }

  private setChecked(newValue: boolean): void {
    if(this.checked !== newValue) {
      this.checked = newValue;
      this.checkedChange.emit(newValue);
    }
  }
}