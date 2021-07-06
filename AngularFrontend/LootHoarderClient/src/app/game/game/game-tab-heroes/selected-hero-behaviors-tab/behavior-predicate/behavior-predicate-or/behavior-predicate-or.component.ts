import { Component, Input } from '@angular/core';
import { AssetManagerService } from 'src/app/game/game/client-representation/asset-manager.service';
import { CharacterBehaviorPredicate } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate';
import { CharacterBehaviorPredicateHasContinuousEffect } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate-has-continuous-effect';
import { CharacterBehaviorPredicateOr } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate-or';
import { Hero } from 'src/app/game/game/client-representation/hero';

@Component({
  selector: 'app-behavior-predicate-or',
  templateUrl: './behavior-predicate-or.component.html',
  styleUrls: ['./behavior-predicate-or.component.scss']
})
export class BehaviorPredicateOrComponent {
  @Input()
  public predicate!: CharacterBehaviorPredicateOr;

  @Input()
  public hero!: Hero;
  
  public constructor(private readonly assetManagerService: AssetManagerService) {}

  public removeInnerPredicate(innerPredicate: CharacterBehaviorPredicate): void {
    this.predicate.removeInnerPredicate(innerPredicate);
  }

  public addInnerPredicate(): void {
    const continuousEffects = this.assetManagerService.getAllContinuousEffectTypes();
    const newPredicate = new CharacterBehaviorPredicateHasContinuousEffect(continuousEffects[0]);
    this.predicate.addInnerPredicate(newPredicate);
  }
}
