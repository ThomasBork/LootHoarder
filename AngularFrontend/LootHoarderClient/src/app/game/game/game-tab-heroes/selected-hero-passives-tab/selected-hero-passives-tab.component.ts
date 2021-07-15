import { Component, Input, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/game/web-socket/web-socket.service';
import { ContractTakeHeroSkillNodeMessage } from 'src/loot-hoarder-contract/client-actions/contract-take-hero-skill-node-message';
import { AssetManagerService } from '../../asset-manager.service';
import { Hero } from '../../client-representation/hero';
import { HeroSkillTree } from '../../client-representation/hero-skill-tree';
import { HeroSkillTreeNode } from '../../client-representation/hero-skill-tree-node';
import { HeroSkillTreeNodeStatus } from '../../client-representation/hero-skill-tree-node-status';
import { HeroSkillTreeStartingNode } from '../../client-representation/hero-skill-tree-starting-node';
import { PassiveAbilityUnlockAbility } from '../../client-representation/passive-ability-unlock-ability';
import { SkillTreeTransition } from '../../client-representation/skill-tree-transition';

@Component({
  selector: 'app-selected-hero-passives-tab',
  templateUrl: './selected-hero-passives-tab.component.html',
  styleUrls: ['./selected-hero-passives-tab.component.scss']
})
export class SelectedHeroPassivesTabComponent {
  @Input()
  public hero!: Hero;

  public minNodeXInPixels: number;
  public minNodeYInPixels: number;
  public maxNodeXInPixels: number;
  public maxNodeYInPixels: number;

  public readonly size2NodeDiameter = 80;
  public readonly size3NodeDiameter = 120;
  public readonly size2NodeMargin = 40;
  public readonly transitionWidth = 15;
  public readonly skillTreePadding = 500;

  public constructor(
    private readonly assetManagerService: AssetManagerService,
    private readonly webSocketService: WebSocketService
  ) {
    const skillTree = this.assetManagerService.getHeroSkillTree();
    const minNodeX = skillTree.nodes
      .map(node => node.x)
      .reduce((x1, x2) => x1 < x2 ? x1 : x2, Infinity);

    const minNodeY = skillTree.nodes
      .map(node => node.y)
      .reduce((y1, y2) => y1 < y2 ? y1 : y2, Infinity);

    const maxNodeX = skillTree.nodes
      .map(node => node.x)
      .reduce((x1, x2) => x1 > x2 ? x1 : x2, -Infinity);

    const maxNodeY = skillTree.nodes
      .map(node => node.y)
      .reduce((y1, y2) => y1 > y2 ? y1 : y2, -Infinity);

      this.minNodeXInPixels = this.getCellLeft(minNodeX);
      this.minNodeYInPixels = this.getCellTop(minNodeY);
      this.maxNodeXInPixels = this.getCellLeft(maxNodeX) + this.size2NodeDiameter;
      this.maxNodeYInPixels = this.getCellTop(maxNodeY) + this.size2NodeDiameter;
  }

  
  public get gridCellSize(): number { 
    return this.size2NodeDiameter + this.size2NodeMargin;
  }

  public get startPositionCenterX(): number {
    const centerX = this.getCellLeft(this.hero.type.heroSkillTreeStartingNode.x)
      + this.size2NodeDiameter / 2;
    return centerX;
  }

  public get startPositionCenterY(): number {
    const centerY = this.getCellTop(this.hero.type.heroSkillTreeStartingNode.y)
      + this.size2NodeDiameter / 2;
    return centerY;
  }

  public getNodeAsUnlockSkillAbility(nodeWithStatus: HeroSkillTreeNodeStatus): PassiveAbilityUnlockAbility | undefined {
    if (
      nodeWithStatus.node.passiveAbilities.length === 1
    ) {
      const nodeAbility = nodeWithStatus.node.passiveAbilities[0];
      if (nodeAbility instanceof PassiveAbilityUnlockAbility) {
        return nodeAbility;
      }
    }

    return undefined;
  }

  public takeSkillNode(nodeWithStatus: HeroSkillTreeNodeStatus): void {
    if (!nodeWithStatus.isAvailable || nodeWithStatus.isTaken) {
      return;
    }

    if (this.hero.unspentSkillPoints === 0) {
      return;
    }

    const message = new ContractTakeHeroSkillNodeMessage(
      this.hero.id, 
      nodeWithStatus.node.x, 
      nodeWithStatus.node.y
    );

    this.webSocketService.send(message);
  }

  public getTransitionLeft(transition: SkillTreeTransition): string {
    const centeringDelta = transition.isHorizontal ? 0 : -this.transitionWidth / 2;
    const leftInPixels = this.getCellLeft(transition.minX) + this.size2NodeDiameter / 2 + centeringDelta;
    return leftInPixels + 'px';
  }

  public getTransitionTop(transition: SkillTreeTransition): string {
    const centeringDelta = transition.isHorizontal ? -this.transitionWidth / 2 : 0;
    const topInPixels = this.getCellTop(transition.minY) + this.size2NodeDiameter / 2 + centeringDelta;
    return topInPixels + 'px';
  }

  public getTransitionWidth(transition: SkillTreeTransition): string {
    const widthInPixels = transition.isHorizontal ? this.gridCellSize : this.transitionWidth;
    return widthInPixels + 'px';
  }

  public getTransitionHeight(transition: SkillTreeTransition): string {
    const heightInPixels = transition.isHorizontal ? this.transitionWidth : this.gridCellSize;
    return heightInPixels + 'px';
  }

  public getIsTransitionAvailable(transition: SkillTreeTransition): boolean {
    const fromNode = this.hero.skillTree.getNode(transition.fromX, transition.fromY);
    const toNode = this.hero.skillTree.getNode(transition.toX, transition.toY);
    if (fromNode.isTaken && toNode.isTaken) {
      return false;
    }
    return fromNode.isTaken || toNode.isTaken;
  }

  public getIsTransitionTaken(transition: SkillTreeTransition): boolean {
    const fromNode = this.hero.skillTree.getNode(transition.fromX, transition.fromY);
    const toNode = this.hero.skillTree.getNode(transition.toX, transition.toY);
    return fromNode.isTaken && toNode.isTaken;
  }

  public getNodeLeft(nodeWithStatus: HeroSkillTreeNodeStatus): string {
    const size2LeftInPixels = this.getCellLeft(nodeWithStatus.node.x);
    let leftInPixels: number;
    switch(nodeWithStatus.node.size) {
      case 2: 
        leftInPixels = size2LeftInPixels;
        break;
      case 3: 
        leftInPixels = size2LeftInPixels - (this.size3NodeDiameter - this.size2NodeDiameter) / 2;
        break;
      default:
        throw Error(`Unhandled node size: ${nodeWithStatus.node.size}`);
    }
    return leftInPixels + 'px';
  }

  public getNodeTop(nodeWithStatus: HeroSkillTreeNodeStatus): string {
    const size2TopInPixels = this.getCellTop(nodeWithStatus.node.y);
    let topInPixels: number;
    switch(nodeWithStatus.node.size) {
      case 2: 
        topInPixels = size2TopInPixels;
        break;
      case 3: 
        topInPixels = size2TopInPixels - (this.size3NodeDiameter - this.size2NodeDiameter) / 2;
        break;
      default:
        throw Error(`Unhandled node size: ${nodeWithStatus.node.size}`);
    }
    return topInPixels + 'px';
  }

  public getNodeWidth(nodeWithStatus: HeroSkillTreeNodeStatus): string {
    let widthInPixels: number;
    switch(nodeWithStatus.node.size) {
      case 2: 
        widthInPixels = this.size2NodeDiameter;
        break;
      case 3: 
        widthInPixels = this.size3NodeDiameter;
        break;
      default:
        throw Error(`Unhandled node size: ${nodeWithStatus.node.size}`);
    }
    return widthInPixels + 'px';
  }

  public getNodeHeight(nodeWithStatus: HeroSkillTreeNodeStatus): string {
    let heightInPixels: number;
    switch(nodeWithStatus.node.size) {
      case 2: 
        heightInPixels = this.size2NodeDiameter;
        break;
      case 3: 
        heightInPixels = this.size3NodeDiameter;
        break;
      default:
        throw Error(`Unhandled node size: ${nodeWithStatus.node.size}`);
    }
    return heightInPixels + 'px';
  }

  public getNodeFontColor(nodeWithStatus: HeroSkillTreeNodeStatus): string | undefined {
    if (nodeWithStatus.node instanceof HeroSkillTreeStartingNode) {
      return 'white';
    }

    return 'black';
  }

  public getNodeBackgroundColor(nodeWithStatus: HeroSkillTreeNodeStatus): string | undefined {
    if (nodeWithStatus.node instanceof HeroSkillTreeStartingNode) {
      return 'black';
    }

    return 'green';
  }

  public getNodeText(nodeWithStatus: HeroSkillTreeNodeStatus): string {
    if (nodeWithStatus.node instanceof HeroSkillTreeStartingNode) {
      return nodeWithStatus.node.heroType.name.substr(0, 3);
    }

    if (nodeWithStatus.abilityDescriptions.length === 1) {
      return nodeWithStatus.abilityDescriptions[0]
        .split(' ')
        .map(word => word[0])
        .filter(char => !(char <= '9'))
        .join('')
        .toUpperCase();
    }
    
    return `(${nodeWithStatus.abilityDescriptions.length})`;
  }

  private getCellLeft(x: number): number {
    return this.gridCellSize * x;
  }

  private getCellTop(y: number): number {
    return this.gridCellSize * y;
  }
}
