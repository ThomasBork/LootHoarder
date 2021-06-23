import { Component, Input } from "@angular/core";
import { GameTab } from "src/app/game/game/client-representation/game-tab";

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {
  @Input() 
  public tab!: GameTab;

  public isActive: boolean = false;
}
