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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TakeHeroSkillNodeHandler } from './game-message-handlers/from-client/take-hero-skill-node-handler';
import { SendChatMessageHandler } from './game-message-handlers/from-client/send-chat-message-handler';
import { DeleteHeroHandler } from './game-message-handlers/from-client/delete-hero-handler';
import { CreateHeroBehaviorHandler } from './game-message-handlers/from-client/create-hero-behavior-handler';
import { UpdateHeroBehaviorHandler } from './game-message-handlers/from-client/update-hero-behavior-handler';
import { SetCurrentHeroBehaviorHandler } from './game-message-handlers/from-client/set-current-hero-behavior-handler';
import { CharacterBehaviorValueEvaluator } from './services/character-behavior-value-evaluator';
import { CharacterBehaviorPredicateEvaluator } from './services/character-behavior-predicate-evaluator';
import { CharacterBehaviorTargetEvaluator } from './services/character-behavior-target-evaluator';

export const CommandHandlers = [
  CreateHeroHandler,
  CreateHeroBehaviorHandler,
  DeleteHeroHandler,
  EnterAreaTypeHandler, 
  EquipItemHandler,
  GoToNextCombatHandler,
  LeaveAreaCombatHandler,
  SendChatMessageHandler,
  SetCurrentHeroBehaviorHandler,
  SetSettingHandler,
  TakeHeroSkillNodeHandler,
  UpdateHeroBehaviorHandler,
];

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../AngularFrontend/LootHoarderClient/dist', 'LootHoarderClient'),
      exclude: ['/api*'],
    }),
    CqrsModule
  ],
  controllers: [
    AppController,
    AuthController,
    GameController
  ],
  providers: [
    AppGateway,
    AuthService,
    CharacterBehaviorPredicateEvaluator,
    CharacterBehaviorTargetEvaluator,
    CharacterBehaviorValueEvaluator,
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
