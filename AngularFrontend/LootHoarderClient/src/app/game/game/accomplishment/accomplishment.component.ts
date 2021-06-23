import { Component, Input } from "@angular/core";
import { ContractGameTabKey } from "src/loot-hoarder-contract/contract-game-tab-key";
import { Accomplishment } from "../client-representation/accomplishment";
import { AreaType } from "../client-representation/area-type";
import { UIStateManager } from "../ui-state-manager";

@Component({
  selector: 'app-accomplishment',
  templateUrl: './accomplishment.component.html',
  styleUrls: ['./accomplishment.component.scss']
})
export class AccomplishmentComponent {
  @Input()
  public accomplishment!: Accomplishment;

  public constructor(private readonly uiStateManager: UIStateManager) {}

  public goToAreaType(areaType: AreaType): void {
    const gameAreaType = this.uiStateManager.state.game.getGameAreaType(areaType.key);
    if (gameAreaType.isAvailable) {
      this.uiStateManager.state.worldTab.selectedAreaType = gameAreaType;
      this.uiStateManager.state.worldTab.centerOnAreaType(gameAreaType);
    } else {
      this.uiStateManager.state.worldTab.selectedAreaType = undefined;
    }
    this.uiStateManager.state.selectTab(ContractGameTabKey.world);
  }
}