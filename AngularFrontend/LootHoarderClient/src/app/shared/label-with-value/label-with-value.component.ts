import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-with-value',
  templateUrl: './label-with-value.component.html',
  styleUrls: ['./label-with-value.component.scss']
})
export class LabelWithValueComponent {
  @Input()
  public label!: string;
  @Input()
  public value!: string | number;
}