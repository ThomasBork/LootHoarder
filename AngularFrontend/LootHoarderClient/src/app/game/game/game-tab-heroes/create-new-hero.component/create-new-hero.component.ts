import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateHeroMessage } from 'src/app/game/web-socket/create-hero-message';
import { WebSocketService } from 'src/app/game/web-socket/web-socket.service';
import { AssetManagerService } from '../../client-representation/asset-manager.service';
import { HeroType } from '../../client-representation/hero-type';

@Component({
  selector: 'app-create-new-hero',
  templateUrl: './create-new-hero.component.html',
  styleUrls: ['./create-new-hero.component.scss']
})
export class CreateNewHeroComponent implements OnInit {
  @Output()
  public createHero: EventEmitter<void> = new EventEmitter();

  public heroTypes!: HeroType[];
  public selectedHeroType!: HeroType;

  public heroName: string = '';

  private selectedHeroTypeIndex!: number;

  public constructor(
    private readonly assetManagerService: AssetManagerService,
    private readonly webSocketService: WebSocketService
  ) {}

  public ngOnInit(): void {
    this.heroTypes = this.assetManagerService.getAllHeroTypes();
    this.selectedHeroTypeIndex = 0;
    this.updatedSelectedHeroType();
  }

  public choosePreviousHeroType(): void {
    this.selectedHeroTypeIndex--;
    if (this.selectedHeroTypeIndex < 0) {
      this.selectedHeroTypeIndex = this.heroTypes.length - 1;
    }
    this.updatedSelectedHeroType();
  }

  public chooseNextHeroType(): void {
    this.selectedHeroTypeIndex++;
    if (this.selectedHeroTypeIndex >= this.heroTypes.length) {
      this.selectedHeroTypeIndex = 0;
    }
    this.updatedSelectedHeroType();
  }

  public createNewHero(): void {
    const message = new CreateHeroMessage(this.selectedHeroType.key, this.heroName);
    this.webSocketService.send(message);
    this.createHero.emit();
  }

  private updatedSelectedHeroType(): void {
    this.selectedHeroType = this.heroTypes[this.selectedHeroTypeIndex];
  }
}
