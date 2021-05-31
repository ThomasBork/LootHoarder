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
  public minNodeX: number;
  public minNodeY: number;
  public maxNodeX: number;
  public maxNodeY: number;

  public readonly nodeDiameter = 80;
  public readonly nodeMargin = 40;
  public readonly transitionWidth = 15;

  public constructor(
    private readonly assetManagerService: AssetManagerService
  ) {
    this.skillTree = this.assetManagerService.getHeroSkillTree();
    this.minNodeX = this.skillTree.nodes
      .map(node => node.x)
      .reduce((x1, x2) => x1 < x2 ? x1 : x2, Infinity);

    this.minNodeY = this.skillTree.nodes
      .map(node => node.y)
      .reduce((y1, y2) => y1 < y2 ? y1 : y2, Infinity);

    this.maxNodeX = this.skillTree.nodes
      .map(node => node.x)
      .reduce((x1, x2) => x1 > x2 ? x1 : x2, Infinity);

    this.maxNodeY = this.skillTree.nodes
      .map(node => node.y)
      .reduce((y1, y2) => y1 > y2 ? y1 : y2, Infinity);
  }

  public get gridCellSize(): number { 
    return this.nodeDiameter + this.nodeMargin;
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
    return this.gridCellSize * (x - this.minNodeX);
  }

  private getCellTop(y: number): number {
    return this.gridCellSize * (y - this.minNodeY);
  }
}
