import { Injectable } from "@angular/core";
import { AbilityType } from "./ability-type";
import { HeroType } from "./hero-type";
import HeroTypes from 'src/loot-hoarder-static-content/hero-types.json';
import AbilityTypes from 'src/loot-hoarder-static-content/ability-types.json';
import AreaTypes from 'src/loot-hoarder-static-content/area-types.json';
import AreaTypeTransitions from 'src/loot-hoarder-static-content/area-type-transitions.json';
import ItemTypes from 'src/loot-hoarder-static-content/item-types.json';
import ItemAbilityTypes from 'src/loot-hoarder-static-content/item-ability-types.json';
import { AreaType } from "./area-type";
import { ItemType } from "./item-type";
import { ContractItemCategory } from "src/loot-hoarder-contract/contract-item-category";
import { ItemAbilityType } from "./item-ability-type";

@Injectable()
export class AssetManagerService {
  private abilityTypes: AbilityType[] = [];
  private heroTypes: HeroType[] = [];
  private areaTypes: AreaType[] = [];
  private itemTypes!: ItemType[];
  private itemAbilityTypes!: ItemAbilityType[];

  public loadAssets(): void {
    console.log("Loading assets");
    this.loadAbilityTypes();
    this.loadHeroTypes();
    this.loadAreaTypes();
    this.loadItemAbilityTypes();
    this.loadItemTypes();
    console.log("Done loading assets");
  }

  public getAbilityType(key: string): AbilityType {
    const result = this.abilityTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Ability type with key = '${key}' not found.`);
    }
    return result;
  }

  public getAllAbilityTypes(): AbilityType[] {
    return [...this.abilityTypes];
  }

  public getHeroType(key: string): HeroType {
    const result = this.heroTypes.find(x => x.key === key);
    if (!result) {
      throw Error (`Hero type with key = '${key}' not found.`);
    }
    return result;
  }

  public getAllHeroTypes(): HeroType[] {
    return [...this.heroTypes];
  }

  public getAreaType(key: string): AreaType {
    const areaType = this.areaTypes.find(x => x.key === key);
    if (!areaType) {
      throw Error (`Area type '${key}' not found.`);
    }
    return areaType;
  }

  public getAllAreaTypes(): AreaType[] {
    return [...this.areaTypes];
  }

  public getItemAbilityType(key: string): ItemAbilityType {
    const itemAbilityType = this.itemAbilityTypes.find(x => x.key === key);
    if (!itemAbilityType) {
      throw Error (`Item ability type '${key}' not found.`);
    }
    return itemAbilityType;
  }

  public getItemType(key: string): ItemType {
    const itemType = this.itemTypes.find(x => x.key === key);
    if (!itemType) {
      throw Error (`Item type '${key}' not found.`);
    }
    return itemType;
  }

  private loadAbilityTypes(): void {
    this.abilityTypes = AbilityTypes.map(abilityType => 
      new AbilityType(
        abilityType.key, 
        abilityType.name, 
        abilityType.description, 
        abilityType.tags
      )
    );
  }

  private loadHeroTypes(): void {
    this.heroTypes = HeroTypes.map(heroType => 
      new HeroType(
        heroType.key,
        heroType.name,
        heroType.description,
        heroType.abilityTypes.map(abilityTypeKey => this.getAbilityType(abilityTypeKey))
      )
    )
  }

  private loadAreaTypes(): void {
    this.areaTypes = AreaTypes.map(a => new AreaType(
      a.key,
      a.name,
      a.description,
      a.level,
      a.x,
      a.y
    ));

    for(let transition of AreaTypeTransitions) {
      const areaType1 = this.getAreaType(transition[0]);
      const areaType2 = this.getAreaType(transition[1]);
      areaType1.adjacentAreaTypes.push(areaType2);
      areaType2.adjacentAreaTypes.push(areaType1);
    }
  }

  private loadItemTypes(): void {
    this.itemTypes = ItemTypes.map(itemType => new ItemType(
      itemType.key,
      itemType.name,
      itemType.category as ContractItemCategory,
      itemType.image.fixtureLeft,
      itemType.image.fixtureTop,
      itemType.image.widthInPercent,
    ));
  }

  private loadItemAbilityTypes(): void {
    this.itemAbilityTypes = ItemAbilityTypes.map(itemAbilityType => new ItemAbilityType(
      itemAbilityType.key,
      itemAbilityType.parameters
    ));
  }
}
