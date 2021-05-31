import { Component, Input, OnInit } from '@angular/core';
import { AssetManagerService } from '../../client-representation/asset-manager.service';
import { Hero } from '../../client-representation/hero';
import { HeroSkillTree } from '../../client-representation/hero-skill-tree';
import { HeroSkillTreeNode } from '../../client-representation/hero-skill-tree-node';
import { SkillTreeTransition } from '../../client-representation/skill-tree-transition';

@Component({
  selector: 'app-selected-hero-passives-tab',
  templateUrl: './selected-hero-passives-tab.component.html',
  styleUrls: ['./selected-hero-passives-tab.component.scss']
})
export class SelectedHeroPassivesTabComponent {
  @Input()
  public hero!: Hero;

  public skillTree: HeroSkillTree;
  public minNodeXInPixels: number;
  public minNodeYInPixels: number;
  public maxNodeXInPixels: number;
  public maxNodeYInPixels: number;

  public readonly nodeDiameter = 80;
  public readonly nodeMargin = 40;
  public readonly transitionWidth = 15;
  public readonly skillTreePadding = 200;

  public constructor(
    private readonly assetManagerService: AssetManagerService
  ) {
    this.skillTree = this.assetManagerService.getHeroSkillTree();
    const minNodeX = this.skillTree.nodes
      .map(node => node.x)
      .reduce((x1, x2) => x1 < x2 ? x1 : x2, Infinity);

    const minNodeY = this.skillTree.nodes
      .map(node => node.y)
      .reduce((y1, y2) => y1 < y2 ? y1 : y2, Infinity);

    const maxNodeX = this.skillTree.nodes
      .map(node => node.x)
      .reduce((x1, x2) => x1 > x2 ? x1 : x2, -Infinity);

    const maxNodeY = this.skillTree.nodes
      .map(node => node.y)
      .reduce((y1, y2) => y1 > y2 ? y1 : y2, -Infinity);

      this.minNodeXInPixels = this.getCellLeft(minNodeX);
      this.minNodeYInPixels = this.getCellTop(minNodeY);
      this.maxNodeXInPixels = this.getCellLeft(maxNodeX) + this.nodeDiameter;
      this.maxNodeYInPixels = this.getCellTop(maxNodeY) + this.nodeDiameter;
  }

  public get gridCellSize(): number { 
    return this.nodeDiameter + this.nodeMargin;
  }

  public get startPositionCenterX(): number {
    const centerX = this.getCellLeft(this.hero.type.heroSkillTreeStartingNode.x)
      + this.nodeDiameter / 2;
    return centerX;
  }

  public get startPositionCenterY(): number {
    const centerY = this.getCellTop(this.hero.type.heroSkillTreeStartingNode.y)
      + this.nodeDiameter / 2;
    return centerY;
  }

  public getTransitionLeft(transition: SkillTreeTransition): string {
    const centeringDelta = transition.isHorizontal ? 0 : -this.transitionWidth / 2;
    const leftInPixels = this.getCellLeft(transition.minX) + this.nodeDiameter / 2 + centeringDelta;
    return leftInPixels + 'px';
  }

  public getTransitionTop(transition: SkillTreeTransition): string {
    const centeringDelta = transition.isHorizontal ? -this.transitionWidth / 2 : 0;
    const topInPixels = this.getCellTop(transition.minY) + this.nodeDiameter / 2 + centeringDelta;
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

  public getNodeLeft(node: HeroSkillTreeNode): string {
    const leftInPixels = this.getCellLeft(node.x);
    return leftInPixels + 'px';
  }

  public getNodeTop(node: HeroSkillTreeNode): string {
    const topInPixels = this.getCellTop(node.y);
    return topInPixels + 'px';
  }

  public getNodeWidth(node: HeroSkillTreeNode): string {
    const widthInPixels = this.nodeDiameter;
    return widthInPixels + 'px';
  }

  public getNodeHeight(node: HeroSkillTreeNode): string {
    const heightInPixels = this.nodeDiameter;
    return heightInPixels + 'px';
  }

  private getCellLeft(x: number): number {
    return this.gridCellSize * x;
  }

  private getCellTop(y: number): number {
    return this.gridCellSize * y;
  }
}
