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
import { HeroListComponent } from './game/game/game-tab-heroes/hero-list/hero-list.component';
import { LabelWithValueComponent } from './shared/label-with-value/label-with-value.component';
import { AssetManagerService } from './game/game/client-representation/asset-manager.service';
import { GameTabMenuComponent } from './game/game/game-tab-menu/game-tab-menu.component';
import { GameTabHeroesComponent } from './game/game/game-tab-heroes/game-tab-heroes.component';
import { CreateNewHeroComponent } from './game/game/game-tab-heroes/create-new-hero.component/create-new-hero.component';
import { GameTabWorldComponent } from './game/game/game-tab-world/game-tab-world.component';
import { GameStateMapper } from './game/game/game-state-mapper';
import { GameTabCombatComponent } from './game/game/game-tab-combat/game-tab-combat.component';
import { CombatComponent } from './game/game/game-tab-combat/combat/combat.component';
import { CombatCharacterComponent } from './game/game/game-tab-combat/combat/combat-character/combat-character.component';
import { CombatMessageHandler } from './game/game/combat-message-handler';

@NgModule({
  declarations: [
    AppComponent,
    CreateNewHeroComponent,
    HeroListComponent,
    LabelWithValueComponent,
    LoginComponent,
    CreateUserComponent,
    GamesComponent,
    GameComponent,
    GameTabCombatComponent,
    CombatComponent,
    CombatCharacterComponent,
    GameTabHeroesComponent,
    GameTabMenuComponent,
    GameTabWorldComponent
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
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
