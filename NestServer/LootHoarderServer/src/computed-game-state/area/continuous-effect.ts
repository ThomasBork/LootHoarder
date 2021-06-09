import { Subject } from "rxjs";
import { DbContinuousEffect } from "src/raw-game-state/db-continuous-effect";
import { StaticGameContentService } from "src/services/static-game-content-service";
import { PassiveAbility } from "../passive-ability";
import { ContinuousEffectType } from "./continuous-effect-type";
import { ContractContinuousEffect } from "src/loot-hoarder-contract/server-actions/combat-messages/contract-continuous-effect";

export class ContinuousEffect {
  private dbModel: DbContinuousEffect;

  public type: ContinuousEffectType;
  public abilities: PassiveAbility[];

  public onExpire: Subject<void>;

  public constructor(
    dbModel: DbContinuousEffect,
    type: ContinuousEffectType,
    abilities: PassiveAbility[]
  ) {
    this.dbModel = dbModel;
    this.type = type;
    this.abilities = abilities;
    this.onExpire = new Subject();
  }

  public get id(): number { return this.dbModel.id; }
  public get timeRemaining(): number { return this.dbModel.timeRemaining; }
  public get lastsIndefinitely(): boolean { return this.dbModel.lastsIndefinitely; }

  public set timeRemaining(newValue: number) {
    if (newValue < 0) {
      newValue = 0;
      this.dbModel.timeRemaining = 0;
      this.onExpire.next();
    } else {
      this.dbModel.timeRemaining = newValue;
    }
  }

  public toContractModel(): ContractContinuousEffect {
    return {
      id: this.id,
      typeKey: this.type.key,
      abilities: this.abilities.map(ability => ability.toContractModel()),
      timeRemaining: this.timeRemaining,
      lastsIndefinitely: this.lastsIndefinitely
    }
  }

  public static load(dbModel: DbContinuousEffect): ContinuousEffect {
    const type = StaticGameContentService.instance.getContinuousEffectType(dbModel.typeKey);
    const passiveAbilities = dbModel.abilities.map(dbPassiveAbility => PassiveAbility.load(dbPassiveAbility));
    const continuousEffect = new ContinuousEffect(dbModel, type, passiveAbilities);
    return continuousEffect;
  }
}
