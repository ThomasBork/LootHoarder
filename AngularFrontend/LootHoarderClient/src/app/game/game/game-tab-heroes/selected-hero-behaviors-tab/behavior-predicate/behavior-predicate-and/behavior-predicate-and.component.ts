import { Component, Input } from '@angular/core';
import { AssetManagerService } from 'src/app/game/game/asset-manager.service';
import { CharacterBehaviorPredicate } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate';
import { CharacterBehaviorPredicateAnd } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate-and';
import { CharacterBehaviorPredicateHasContinuousEffect } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate-has-continuous-effect';
import { Hero } from 'src/app/game/game/client-representation/hero';

@Component({
  selector: 'app-behavior-predicate-and',
  templateUrl: './behavior-predicate-and.component.html',
  styleUrls: ['./behavior-predicate-and.component.scss']
})
export class BehaviorPredicateAndComponent {
  @Input()
  public predicate!: CharacterBehaviorPredicateAnd;

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
