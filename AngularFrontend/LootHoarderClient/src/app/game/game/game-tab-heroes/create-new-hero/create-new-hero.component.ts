import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebSocketService } from 'src/app/game/web-socket/web-socket.service';
import { AssetManagerService } from '../../client-representation/asset-manager.service';
import { HeroType } from '../../client-representation/hero-type';
import { ContractCreateHeroMessage } from 'src/loot-hoarder-contract/client-actions/contract-create-hero-message'
import { Hero } from '../../client-representation/hero';
import { AttributeSet } from '../../client-representation/attribute-set';
import { Inventory } from '../../client-representation/inventory';
import { Item } from '../../client-representation/item';
import { ContractInventoryPosition } from 'src/loot-hoarder-contract/contract-inventory-position';
import { HeroSkillTreeStatus } from '../../client-representation/hero-skill-tree-status';

@Component({
  selector: 'app-create-new-hero',
  templateUrl: './create-new-hero.component.html',
  styleUrls: ['./create-new-hero.component.scss']
})
export class CreateNewHeroComponent implements OnInit {
  @Output()
  public createHero: EventEmitter<void> = new EventEmitter();
  @Output()
  public cancel: EventEmitter<void> = new EventEmitter();

  public heroTypes!: HeroType[];
  public selectedHeroType!: HeroType;

  public heroName: string = 'John';
  public eyesId: number = 1;
  public noseId: number = 1;
  public mouthId: number = 1;
  public eyesCount: number = 5;
  public noseCount: number = 8;
  public mouthCount: number = 6;

  public temporaryHero!: Hero;

  private selectedHeroTypeIndex!: number;

  public constructor(
    private readonly assetManagerService: AssetManagerService,
    private readonly webSocketService: WebSocketService
  ) {}

  public ngOnInit(): void {
    this.heroTypes = this.assetManagerService.getAllHeroTypes();
    this.selectedHeroTypeIndex = 0;
    this.selectedHeroType = this.heroTypes[this.selectedHeroTypeIndex];
    this.initializeTemporaryHero();
    this.randomizeFace();
    this.updatedSelectedHeroType();
  }

  public exit(): void {
    this.cancel.emit();
  }

  public randomizeFace(): void {
    this.eyesId = Math.ceil(Math.random() * this.eyesCount);
    this.noseId = Math.ceil(Math.random() * this.noseCount);
    this.mouthId = Math.ceil(Math.random() * this.mouthCount);
    this.temporaryHero.eyesId = this.eyesId;
    this.temporaryHero.noseId = this.noseId;
    this.temporaryHero.mouthId = this.mouthId;
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

  public choosePreviousEyes(): void {
    this.eyesId--;
    if (this.eyesId <= 0) {
      this.eyesId = this.eyesCount;
    }
    this.temporaryHero.eyesId = this.eyesId;
  }

  public chooseNextEyes(): void {
    this.eyesId++;
    if (this.eyesId > this.eyesCount) {
      this.eyesId = 1;
    }
    this.temporaryHero.eyesId = this.eyesId;
  }

  public choosePreviousNose(): void {
    this.noseId--;
    if (this.noseId <= 0) {
      this.noseId = this.noseCount;
    }
    this.temporaryHero.noseId = this.noseId;
  }

  public chooseNextNose(): void {
    this.noseId++;
    if (this.noseId > this.noseCount) {
      this.noseId = 1;
    }
    this.temporaryHero.noseId = this.noseId;
  }

  public choosePreviousMouth(): void {
    this.mouthId--;
    if (this.mouthId <= 0) {
      this.mouthId = this.mouthCount;
    }
    this.temporaryHero.mouthId = this.mouthId;
  }

  public chooseNextMouth(): void {
    this.mouthId++;
    if (this.mouthId > this.mouthCount) {
      this.mouthId = 1;
    }
    this.temporaryHero.mouthId = this.mouthId;
  }

  public createNewHero(): void {
    const message = new ContractCreateHeroMessage(
      this.selectedHeroType.key, 
      this.heroName,
      this.eyesId,
      this.noseId,
      this.mouthId
    );
    this.webSocketService.send(message);
    this.createHero.emit();
  }

  private updatedSelectedHeroType(): void {
    this.selectedHeroType = this.heroTypes[this.selectedHeroTypeIndex];
    this.temporaryHero.type = this.selectedHeroType;
    const startingItem = new Item(
      -1, 
      this.temporaryHero.type.startingWeaponType,
      [],
      []
    );
    this.temporaryHero.equipItem(startingItem, ContractInventoryPosition.leftHand);
  }

  private initializeTemporaryHero(): void {
    this.temporaryHero = new Hero(
      -1,
      this.selectedHeroType,
      this.heroName,
      1,
      0,
      new AttributeSet([]),
      new Inventory(undefined, undefined, undefined, undefined, undefined, undefined, undefined),
      this.eyesId,
      this.noseId,
      this.mouthId,
      0,
      new HeroSkillTreeStatus([], [])
    );
  }
}
