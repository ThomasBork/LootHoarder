import { ContractAttribute } from "./contract-attribute";
import { ContractInventory } from "./contract-inventory";
import { ContractHeroCosmetics } from "./contract-hero-cosmetics";
import { ContractSkillNodeLocation } from "./contract-skill-node-location";

export interface ContractHero {
  id: number;
  typeKey: string;
  name: string;
  level: number;
  experience: number;
  attributes: ContractAttribute[];
  inventory: ContractInventory;
  cosmetics: ContractHeroCosmetics;
  unspentSkillPoints: number;
  takenSkillNodes: ContractSkillNodeLocation[];
  availableSkillNodes: ContractSkillNodeLocation[];
}
