import { DbCharacterBehavior } from "./db-character-behavior";
import { DbHeroAbility } from "./db-hero-ability";
import { DbHeroCosmetics } from "./db-hero-cosmetics";
import { DbInventory } from "./db-inventory";
import { DbSkillNodeLocation } from "./db-skill-node-location";

export interface DbHero {
  id: number;
  typeKey: string;
  name: string;
  level: number;
  experience: number;
  inventory: DbInventory;
  cosmetics: DbHeroCosmetics;
  skillNodesLocations: DbSkillNodeLocation[];
  abilities: DbHeroAbility[];
  nextAbilityId: number;
  behaviors: DbCharacterBehavior[];
  currentBehaviorId?: number;
}
