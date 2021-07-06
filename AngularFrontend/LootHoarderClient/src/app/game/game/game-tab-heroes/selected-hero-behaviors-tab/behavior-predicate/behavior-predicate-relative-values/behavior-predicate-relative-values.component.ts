import { Component, Input } from '@angular/core';
import { CharacterBehaviorPredicateRelativeValues } from 'src/app/game/game/client-representation/character-behavior/character-behavior-predicate-relative-values';
import { Hero } from 'src/app/game/game/client-representation/hero';
import { ContractCharacterBehaviorValueRelation } from 'src/loot-hoarder-contract/contract-character-behavior-value-relation';

@Component({
  selector: 'app-behavior-predicate-relative-values',
  templateUrl: './behavior-predicate-relative-values.component.html',
  styleUrls: ['./behavior-predicate-relative-values.component.scss']
})
export class BehaviorPredicateRelativeValuesComponent {
  @Input()
  public predicate!: CharacterBehaviorPredicateRelativeValues;

  @Input()
  public hero!: Hero;

  public allPossibleValueRelations: ContractCharacterBehaviorValueRelation[];

  public constructor() {
    this.allPossibleValueRelations = Object.values(ContractCharacterBehaviorValueRelation);
  }

  public translateValueRelation(valueRelation: ContractCharacterBehaviorValueRelation): string {
    switch(valueRelation) {
      case ContractCharacterBehaviorValueRelation.equal: return 'equal to';
      case ContractCharacterBehaviorValueRelation.notEqual: return 'not equal to';
      case ContractCharacterBehaviorValueRelation.greaterThan: return 'greater than';
      case ContractCharacterBehaviorValueRelation.greaterThanOrEqual: return 'greater than or equal to';
      case ContractCharacterBehaviorValueRelation.lessThan: return 'less than';
      case ContractCharacterBehaviorValueRelation.lessThanOrEqual: return 'less than or equal to';
      default: throw Error (`Unhandled value relation: ${valueRelation}`);
    }
  }

  public selectValueRelation(valueRelation: ContractCharacterBehaviorValueRelation): void {
    this.predicate.valueRelation = valueRelation;
  }
}
