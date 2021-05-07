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
import { StaticGameContentService } from './services/static-game-content-service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateHeroHandler } from './game-message-handlers/from-client/create-hero-handler';
import { EnterAreaTypeHandler } from './game-message-handlers/from-client/enter-area-type-handler';
import { CombatUpdaterService } from './services/combat-updater-service';
import { RandomService } from './services/random-service';
import { MonsterSpawnerService } from './services/monster-spawner-service';
import { LeaveAreaCombatHandler } from './game-message-handlers/from-client/leave-area-handler';
import { GoToNextCombatHandler } from './game-message-handlers/from-client/go-to-next-combat-handler';
import { SetSettingHandler } from './game-message-handlers/from-client/set-setting-handler';
import { ItemSpawnerService } from './services/item-spawner-service';
import { EquipItemHandler } from './game-message-handlers/from-client/equip-item-handler';

export const CommandHandlers = [
  CreateHeroHandler,
  EnterAreaTypeHandler, 
  EquipItemHandler,
  LeaveAreaCombatHandler,
  GoToNextCombatHandler,
  SetSettingHandler
];

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
    ItemSpawnerService,
    MonsterSpawnerService,
    RandomService,
    StaticGameContentService,
    UserService,
    ...CommandHandlers
  ],
})
export class AppModule {}
