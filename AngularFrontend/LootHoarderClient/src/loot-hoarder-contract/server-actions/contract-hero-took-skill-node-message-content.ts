import { ContractSkillNodeLocation } from "../contract-skill-node-location";

export interface ContractHeroTookSkillNodeMessageContent {
  heroId: number,
  nodeX: number,
  nodeY: number,
  newAvailableSkillNodes: ContractSkillNodeLocation[]
}
