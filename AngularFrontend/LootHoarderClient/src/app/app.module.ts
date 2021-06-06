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
import { AssetManagerService } from './game/game/client-representation/asset-manager.service';
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

@NgModule({
  declarations: [
    AppComponent,
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
    PrettyNumberPipe,
    ProgressBarComponent,
    ZoomableContainerComponent,
    NotificationBubbleComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
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
