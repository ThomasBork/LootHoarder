import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AuthController } from './controllers/auth/auth.controller';
import { GameController } from './controllers/game/game.controller';
import { DbGameRepository } from './persistence/db-game-repository';
import { DbLoginRepository } from './persistence/db-login-repository';
import { DbUserLoader } from './persistence/db-user-loader';
import { DbQueryHelper } from './persistence/db-query-helper';
import { DbUserRepository } from './persistence/db-user-repository';
import { AuthService } from './services/auth-service';
import { ConnectionsManager } from './services/connections-manager';
import { GameService } from './services/game-service';
import { GamesManager } from './services/games-manager';
import { UserService } from './services/user-service';
import { StaticGameContentService } from './static-game-content/static-game-content-service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateHeroHandler } from './game-message-handlers/from-client/create-hero-handler';
import { HeroAddedHandler } from './game-message-handlers/from-server/hero-added-handler';
import { AreaCreatedHandler } from './game-message-handlers/from-server/area-created-handler';
import { EnterAreaTypeHandler } from './game-message-handlers/from-client/enter-area-type-handler';
import { CombatUpdaterService } from './services/combat-updater-service';
import { CombatCharacterCurrentHealthChangedHandler } from './game-message-handlers/from-server/combat-character-current-health-changed-handler';

export const CommandHandlers = [EnterAreaTypeHandler, CreateHeroHandler];
export const EventHandlers =  [AreaCreatedHandler, HeroAddedHandler, CombatCharacterCurrentHealthChangedHandler];

@Module({
  imports: [CqrsModule],
  controllers: [
    AppController,
    AuthController,
    GameController
  ],
  providers: [
    AppGateway,
    AuthService,
    CombatUpdaterService,
    ConnectionsManager,
    DbGameRepository,
    DbLoginRepository,
    DbUserLoader,
    DbQueryHelper,
    DbUserRepository,
    GameService,
    GamesManager,
    StaticGameContentService,
    UserService,
    ...CommandHandlers,
    ...EventHandlers
  ],
})
export class AppModule {}
