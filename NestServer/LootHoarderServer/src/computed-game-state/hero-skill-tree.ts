import { DbSkillNodeLocation } from "src/raw-game-state/db-skill-node-location";
import { HeroSkillTreeNode } from "./hero-skill-tree-node";
import { HeroSkillTreeStartingNode } from "./hero-skill-tree-starting-node";
import { HeroType } from "./hero-type";

export class HeroSkillTree {
  public nodes: HeroSkillTreeNode[];
  public constructor(
    nodes: HeroSkillTreeNode[]
  ) {
    this.nodes = nodes;
  }

  public getNode(x: number, y: number): HeroSkillTreeNode {
    const node = this.nodes.find(node => node.x === x && node.y === y);
    if (!node) {
      throw Error (`No node has the coordinates (${x}, ${y})`);
    }
    return node;
  }

  public getHeroTypeStartingPosition(heroTypeKey: string): HeroSkillTreeNode {
    const node = this.nodes.find(node => 
      node instanceof HeroSkillTreeStartingNode 
      && node.heroTypeKey === heroTypeKey
    );
    if (!node) {
      throw Error (`No starting position found for hero type: ${heroTypeKey}`);
    }
    return node;
  }

  public getTakenNodesForHero(takenNodeLocations: DbSkillNodeLocation[]): HeroSkillTreeNode[] {
    return takenNodeLocations.map(location => this.getNode(location.x, location.y));
  }

  public getAvailableNodesForHero(takenNodeLocations: DbSkillNodeLocation[]): HeroSkillTreeNode[] {
    const takenNodes = this.getTakenNodesForHero(takenNodeLocations);
    const availableSkillTreeNodes = takenNodes
      .map(node => node.neighborNodes)
      .reduce((arr1, arr2) => arr1.concat(arr2), [])
      .filter(node => !takenNodes.includes(node));
    const uniqueAvailableSkillTreeNodes = [...new Set(availableSkillTreeNodes)];
    return uniqueAvailableSkillTreeNodes;
  }
}
