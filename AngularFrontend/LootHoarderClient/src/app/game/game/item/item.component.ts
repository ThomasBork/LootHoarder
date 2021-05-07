import { Component, Input } from "@angular/core";
import { Item } from "../client-representation/item";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input()
  public item!: Item;

  public isDragging: boolean = false;
}