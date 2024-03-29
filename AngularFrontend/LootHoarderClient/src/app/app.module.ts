import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/service/auth.service';
import { AppConfigService } from './app-config.service';
import { LoginComponent } from './auth/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateUserComponent } from './auth/create-user/create-user.component';
import { FormsModule } from '@angular/forms';
import { GamesComponent } from './game/games/games.component';
import { GameComponent } from './game/game/game.component';
import { AuthGuard } from './auth/auth.guard';
import { GameService } from './game/service/game.service';
import { WebSocketService } from './game/web-socket/web-socket.service';
import { LabelWithValueComponent } from './shared/label-with-value/label-with-value.component';
import { AssetManagerService } from './game/game/asset-manager.service';
import { GameTabMenuComponent } from './game/game/game-tab-menu/game-tab-menu.component';
import { GameTabHeroesComponent } from './game/game/game-tab-heroes/game-tab-heroes.component';
import { CreateNewHeroComponent } from './game/game/game-tab-heroes/create-new-hero/create-new-hero.component';
import { GameTabWorldComponent } from './game/game/game-tab-world/game-tab-world.component';
import { GameStateMapper } from './game/game/game-state-mapper';
import { GameTabCombatComponent } from './game/game/game-tab-combat/game-tab-combat.component';
import { CombatComponent } from './game/game/game-tab-combat/combat/combat.component';
import { CombatCharacterComponent } from './game/game/game-tab-combat/combat/combat-character/combat-character.component';
import { CombatMessageHandler } from './game/game/combat-message-handler';
import { ProgressBarComponent } from './shared/progress-bar/progress-bar.component';
import { PrettyNumberPipe } from './shared/pretty-number-pipe/pretty-number.pipe';
import { GameTabWorldAreaTypeInformationComponent } from './game/game/game-tab-world/game-tab-world-area-type-information/game-tab-world-area-type-information.component';
import { UIStateMapper } from './game/game/ui-state-mapper';
import { UIStateAdvancer } from './game/game/ui-state-advancer';
import { HeroInformationComponent } from './game/game/game-tab-heroes/hero-information/hero-information.component';
import { GameTabSettingsComponent } from './game/game/game-tab-settings/game-tab-settings.component';
import { GameTabItemsComponent } from './game/game/game-tab-items/game-tab-items.component';
import { HeroWithItemsComponent } from './game/game/game-tab-heroes/hero-with-items/hero-with-items.component';
import { HeroWithItemsItemComponent } from './game/game/game-tab-heroes/hero-with-items/hero-with-items-item/hero-with-items-item.component';
import { ItemComponent } from './game/game/item/item.component';
import { ItemPreviewComponent } from './game/game/item-preview/item-preview.component';
import { SelectedHeroTabMenuComponent } from './game/game/game-tab-heroes/selected-hero-tab-menu/selected-hero-tab-menu.component';
import { SelectedHeroAbilitiesTabComponent } from './game/game/game-tab-heroes/selected-hero-abilities-tab/selected-hero-abilities-tab.component';
import { SelectedHeroItemsTabComponent } from './game/game/game-tab-heroes/selected-hero-items-tab/selected-hero-items-tab.component';
import { SelectedHeroPassivesTabComponent } from './game/game/game-tab-heroes/selected-hero-passives-tab/selected-hero-passives-tab.component';
import { UIStateManager } from './game/game/ui-state-manager';
import { GameTabWorldActiveAreaCharacterListComponent } from './game/game/game-tab-world/game-tab-world-area-type-information/game-tab-world-active-area-character-list/game-tab-world-active-area-character-list.component';
import { ZoomableContainerComponent } from './shared/zoomable-container/zoomable-container.component';
import { NotificationBubbleComponent } from './shared/notification-bubble/notification-bubble.component';
import { GameTabSocialComponent } from './game/game/game-tab-social/game-tab-social.component';
import { SelectedHeroManagementTabComponent } from './game/game/game-tab-heroes/selected-hero-management-tab/selected-hero-management-tab.component';
import { AbilityTagService } from './shared/ability-tag.service';
import { GameTabAchievementsComponent } from './game/game/game-tab-achievements/game-tab-achievements.component';
import { GameTabQuestsComponent } from './game/game/game-tab-quests/game-tab-quests.component';
import { TabMenuComponent } from './shared/tab-menu/tab-menu.component';
import { TabComponent } from './shared/tab-menu/tab/tab.component';
import { AccomplishmentComponent } from './game/game/accomplishment/accomplishment.component';
import { SelectedHeroBehaviorsTabComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/selected-hero-behaviors-tab.component';
import { BehaviorActionComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-action/behavior-action.component';
import { SplitButtonComponent } from './shared/split-button/split-button.component';
import { SplitButtonItemComponent } from './shared/split-button/split-button-item/split-button-item.component';
import { BehaviorTargetComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-target/behavior-target.component';
import { BehaviorTargetRandomCharacterComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-target/behavior-target-random-character/behavior-target-random-character.component';
import { BehaviorTargetRandomCharacterMatchingPredicateComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-target/behavior-target-random-character-matching-predicate/behavior-target-random-character-matching-predicate.component';
import { BehaviorPredicateComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-predicate/behavior-predicate.component';
import { BehaviorPredicateAbilityReadyComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-predicate/behavior-predicate-ability-ready/behavior-predicate-ability-ready.component';
import { HeroAbilityPickerComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/hero-ability-picker/hero-ability-picker.component';
import { BehaviorPredicateHasContinuousEffectComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-predicate/behavior-predicate-has-continuous-effect/behavior-predicate-has-continuous-effect.component';
import { BehaviorPredicateAndComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-predicate/behavior-predicate-and/behavior-predicate-and.component';
import { BehaviorPredicateOrComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-predicate/behavior-predicate-or/behavior-predicate-or.component';
import { BehaviorPredicateNotComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-predicate/behavior-predicate-not/behavior-predicate-not.component';
import { BehaviorTargetSpecificHeroComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-target/behavior-target-specific-hero/behavior-target-specific-hero.component';
import { BehaviorPredicateRelativeValuesComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-predicate/behavior-predicate-relative-values/behavior-predicate-relative-values.component';
import { BehaviorValueComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-value/behavior-value.component';
import { BehaviorValueNumberComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-value/behavior-value-number/behavior-value-number.component';
import { BehaviorValueRemainingCooldownOfAbilityComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-value/behavior-value-remaining-cooldown-of-ability/behavior-value-remaining-cooldown-of-ability.component';
import { BehaviorTargetCharacterWithExtremeValueComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-target/behavior-target-character-with-extreme-value/behavior-target-character-with-extreme-value.component';
import { BehaviorValueAttributeComponent } from './game/game/game-tab-heroes/selected-hero-behaviors-tab/behavior-value/behavior-value-attribute/behavior-value-attribute.component';
import { AbilityTagComponent } from './game/game/ability-tag/ability-tag.component';
import { CheckBoxComponent } from './shared/check-box/check-box.component';
import { AbilityTextService } from './game/game/ability-text-service';
import { AbilityTypePreviewComponent } from './game/game/ability-type-preview/ability-type-preview.component';

@NgModule({
  declarations: [
    AbilityTagComponent,
    AbilityTypePreviewComponent,
    AccomplishmentComponent,
    AppComponent,
    CheckBoxComponent,
    CreateNewHeroComponent,
    LabelWithValueComponent,
    LoginComponent,
    CreateUserComponent,
    GamesComponent,
    GameComponent,
    GameTabCombatComponent,
    CombatComponent,
    CombatCharacterComponent,
    GameTabHeroesComponent,
    SelectedHeroTabMenuComponent,
    SelectedHeroAbilitiesTabComponent,
    SelectedHeroItemsTabComponent,
    SelectedHeroPassivesTabComponent,
    SelectedHeroBehaviorsTabComponent,
    SelectedHeroManagementTabComponent,
    HeroInformationComponent,
    HeroWithItemsComponent,
    HeroWithItemsItemComponent,
    ItemComponent,
    ItemPreviewComponent,
    GameTabMenuComponent,
    GameTabWorldAreaTypeInformationComponent,
    GameTabWorldActiveAreaCharacterListComponent,
    GameTabWorldComponent,
    GameTabSettingsComponent,
    GameTabItemsComponent,
    GameTabSocialComponent,
    GameTabAchievementsComponent,
    GameTabQuestsComponent,
    PrettyNumberPipe,
    ProgressBarComponent,
    ZoomableContainerComponent,
    NotificationBubbleComponent,
    TabMenuComponent,
    TabComponent,
    HeroAbilityPickerComponent,
    BehaviorActionComponent,
    BehaviorPredicateComponent,
    BehaviorPredicateAbilityReadyComponent,
    BehaviorPredicateHasContinuousEffectComponent,
    BehaviorPredicateAndComponent,
    BehaviorPredicateOrComponent,
    BehaviorPredicateNotComponent,
    BehaviorPredicateRelativeValuesComponent,
    BehaviorTargetComponent,
    BehaviorTargetRandomCharacterComponent,
    BehaviorTargetRandomCharacterMatchingPredicateComponent,
    BehaviorTargetSpecificHeroComponent,
    BehaviorTargetCharacterWithExtremeValueComponent,
    BehaviorValueComponent,
    BehaviorValueNumberComponent,
    BehaviorValueRemainingCooldownOfAbilityComponent,
    BehaviorValueAttributeComponent,
    SplitButtonComponent,
    SplitButtonItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    AbilityTagService,
    AbilityTextService,
    AssetManagerService,
    AuthGuard,
    AuthService,
    AppConfigService,
    CombatMessageHandler,
    GameService,
    GameStateMapper,
    UIStateAdvancer,
    UIStateManager,
    UIStateMapper,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
