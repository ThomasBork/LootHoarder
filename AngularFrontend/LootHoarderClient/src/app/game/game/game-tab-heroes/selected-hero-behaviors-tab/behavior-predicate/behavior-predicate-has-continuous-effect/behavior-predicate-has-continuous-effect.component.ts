import { Component, Input } from '@angular/core';
import { AssetManagerService } from 'src/app/game/game/asset-manager.service';
import { CharacterBehaviorPredicateHasContinuousEffect } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate-has-continuous-effect';
import { ContinuousEffectType } from 'src/app/game/game/client-representation/continuous-effect-type';

@Component({
  selector: 'app-behavior-predicate-has-continuous-effect',
  templateUrl: './behavior-predicate-has-continuous-effect.component.html',
  styleUrls: ['./behavior-predicate-has-continuous-effect.component.scss']
})
export class BehaviorPredicateHasContinuousEffectComponent {
  @Input()
  public predicate!: CharacterBehaviorPredicateHasContinuousEffect;

  public allContinuousEffectTypes: ContinuousEffectType[];

  public constructor(private readonly assetManagerService: AssetManagerService) {
    this.allContinuousEffectTypes = this.assetManagerService.getAllContinuousEffectTypes();
  }

  public get continuousEffectType(): ContinuousEffectType { return this.predicate.continuousEffectType; }

  public selectContinuousEffectType(continuousEffectType: ContinuousEffectType): void {
    this.predicate.continuousEffectType = continuousEffectType;
  }
}
