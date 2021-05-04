import { Subject } from 'rxjs';
import { ContractCombatCharacterCurrentHealthChangedMessage } from 'src/loot-hoarder-contract/server-actions/combat-messages/contract-combat-character-current-health-changed-message';
import { ContractCombatEndedMessage } from 'src/loot-hoarder-contract/server-actions/combat-messages/contract-combat-ended-message';
import { ContractCombat } from 'src/loot-hoarder-contract/contract-combat';
import { ContractCombatWebSocketInnerMessage } from 'src/loot-hoarder-contract/server-actions/contract-combat-web-socket-inner-message';
import { DbCombat } from 'src/raw-game-state/db-combat';
import { EventStream } from '../message-bucket';
import { Ability } from './ability';
import { CombatCharacter } from './combat-character';

export class Combat {
  public team1: CombatCharacter[];
  public team2: CombatCharacter[];
  public onCombatEvent: EventStream<ContractCombatWebSocketInnerMessage>;
  public onCombatEnded: Subject<void>;
  public dbModel: DbCombat;

  private constructor(
    dbModel: DbCombat,
    team1: CombatCharacter[],
    team2: CombatCharacter[],
  ) {
    this.dbModel = dbModel;
    this.team1 = team1;
    this.team2 = team2;
    this.onCombatEvent = new EventStream();
    this.onCombatEnded = new Subject();
    this.setUpEventListeners();
  }

  public get id(): number { return this.dbModel.id; }
  public get hasEnded(): boolean { return this.dbModel.hasEnded; }
  public get didTeam1Win(): boolean | undefined { return this.dbModel.didTeam1Win; }

  public getUIState(): ContractCombat {
    return {
      id: this.dbModel.id,
      hasEnded: this.dbModel.hasEnded,
      didTeam1Win: this.dbModel.didTeam1Win,
      team1: this.team1.map(c => c.getUIState()),
      team2: this.team2.map(c => c.getUIState()),
    };
  }

  public getLegalTargets(character: CombatCharacter, ability: Ability, includeDeadTargets: boolean): CombatCharacter[] {
    const isTeam1 = this.team1.some(t1c => t1c === character);
    const isTeam2 = this.team2.some(t2c => t2c === character);

    if (!isTeam1 && !isTeam2) {
      throw Error ('Character is not in either team.');
    }

    let targets = [];
    if (ability.type.canTargetAllies) {
      const allies = isTeam1 ? this.team1 : this.team2;
      targets.push(...allies);
    }
    if (ability.type.canTargetEnemies) {
      const enemies = isTeam1 ? this.team2 : this.team1;
      targets.push(...enemies);
    }

    if (!includeDeadTargets) {
      targets = targets.filter(c => c.isAlive);
    }

    return targets;
  }

  public getAllies(character: CombatCharacter): CombatCharacter[] {
    const isTeam1 = this.team1.some(t1c => t1c === character);
    const isTeam2 = this.team2.some(t2c => t2c === character);

    if (!isTeam1 && !isTeam2) {
      throw Error ('Character is not in either team.');
    }

    if (isTeam1) {
      return [...this.team1];
    }
    return [...this.team2];
  }

  public getEnemies(character: CombatCharacter): CombatCharacter[] {
    const isTeam1 = this.team1.some(t1c => t1c === character);
    const isTeam2 = this.team2.some(t2c => t2c === character);

    if (!isTeam1 && !isTeam2) {
      throw Error ('Character is not in either team.');
    }

    if (isTeam1) {
      return [...this.team2];
    }
    return [...this.team1];
  }

  private updateHasEnded(): void {
    if (this.hasEnded) {
      return;
    }
    const team1Alive = this.team1.some(c => c.isAlive);
    const team2Alive = this.team2.some(c => c.isAlive);
    const hasEnded = !team1Alive || !team2Alive;
    if (hasEnded) {
      const didTeam1Win = team1Alive;
      this.dbModel.hasEnded = hasEnded;
      this.dbModel.didTeam1Win = didTeam1Win;
      this.onCombatEvent.next(new ContractCombatEndedMessage(didTeam1Win));
      this.onCombatEnded.next();
    }
  }

  private setUpEventListeners(): void {
    const allCharacters = this.team1.concat(this.team2);
    for(const character of allCharacters) {
      character.onCurrentHealthChanged.subscribe(newCurrentHealth => {
        this.onCombatEvent.next(new ContractCombatCharacterCurrentHealthChangedMessage(character.id, newCurrentHealth));
        this.updateHasEnded();
      });
    }
  }

  public static load(dbModel: DbCombat): Combat {
    const team1 = dbModel.team1.map(CombatCharacter.load);
    const team2 = dbModel.team2.map(CombatCharacter.load);
    
    const allCharacters = team1.concat(team2);
    for(const character of allCharacters) {
      if (character.dbModel.idOfTargetOfAbilityBeingUsed) {
        character.targetOfAbilityBeingUsed = allCharacters.find(c => c.id === character.dbModel.idOfTargetOfAbilityBeingUsed);
      }
    }

    const combat = new Combat(dbModel, team1, team2);
    return combat;
  }
}
