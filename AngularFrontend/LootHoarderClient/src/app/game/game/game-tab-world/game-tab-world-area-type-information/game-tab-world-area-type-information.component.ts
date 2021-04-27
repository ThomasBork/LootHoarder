import { Component, Input, OnInit } from "@angular/core";
import { WebSocketService } from "src/app/game/web-socket/web-socket.service";
import { ContractEnterAreaMessage } from "src/loot-hoarder-contract/client-actions/contract-enter-area-message";
import { Area } from "../../client-representation/area";
import { AreaType } from "../../client-representation/area-type";
import { Game } from "../../client-representation/game";
import { GameAreaType } from "../../client-representation/game-area-type";
import { Hero } from "../../client-representation/hero";

@Component({
  selector: 'app-game-tab-world-area-type-information',
  templateUrl: './game-tab-world-area-type-information.component.html',
  styleUrls: ['./game-tab-world-area-type-information.component.scss']
})
export class GameTabWorldAreaTypeInformationComponent implements OnInit {
  @Input()
  public game!: Game;
  @Input()
  public gameAreaType!: GameAreaType;

  public selectedHeroes: Hero[] = [];

  public constructor(
    private readonly webSocketService: WebSocketService
  ) {}

  public ngOnInit(): void {
    this.resetSelectedHeroes();

    // Automatically select the hero, if there is only one hero.
    if (this.game.heroes.length === 1 && this.isHeroAvailable(this.game.heroes[0])) {
      this.selectedHeroes.push(this.game.heroes[0]);
    }
  }

  public enterAreaType(areaType: AreaType): void {
    const message = new ContractEnterAreaMessage(areaType.key, [this.game.heroes[0].id]);
    this.webSocketService.send(message);
  }

  public isHeroSelected(hero: Hero): boolean {
    return this.selectedHeroes.includes(hero);
  }

  public isHeroAvailable(hero: Hero): boolean {
    return !hero.areaHero;
  }

  public toggleHeroSelected(hero: Hero): void {
    if (!this.isHeroAvailable(hero)) {
      return;
    }

    if (this.isHeroSelected(hero)) {
      this.selectedHeroes = this.selectedHeroes.filter(h => h !== hero);
    } else {
      this.selectedHeroes.push(hero);
    }
  }

  public startNewInstance(): void {
    const areaTypeKey = this.gameAreaType.type.key;
    const heroIds = this.selectedHeroes.map(h => h.id);
    this.webSocketService.send(new ContractEnterAreaMessage(areaTypeKey, heroIds));
    this.resetSelectedHeroes();
  }

  private resetSelectedHeroes(): void {
    this.selectedHeroes = [];
  }
}
