import { Component, Input } from "@angular/core";
import { CombatCharacter } from "../../../client-representation/combat-character";
@Component({
  selector: 'app-game-tab-world-active-area-character-list',
  templateUrl: './game-tab-world-active-area-character-list.component.html',
  styleUrls: ['./game-tab-world-active-area-character-list.component.scss']
})
export class GameTabWorldActiveAreaCharacterListComponent {
  @Input()
  public combatCharacters!: CombatCharacter[];

}
