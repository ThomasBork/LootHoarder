import { Component, OnInit } from '@angular/core';
import { SkillTreeNode } from './skill-tree-node';
import { SkillTreeNodeAbility } from './skill-tree-node-ability';
import { Transition } from './transition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isTextShown: boolean = false;
  public nodes: SkillTreeNode[] = [];
  public transitions: Transition[] = [];
  public treeAsText?: string;
  public translateX: number = 0;
  public translateY: number = 0;
  public zoom: number = 1;
  public selectedNode?: SkillTreeNode;

  private dragStartX?: number;
  private dragStartY?: number;
  private readonly cellSize: number = 240;
  private readonly nodeSize: number = 100;

  public ngOnInit(): void {
    this.nodes = [
      new SkillTreeNode(0, 0, [ new SkillTreeNodeAbility('heroTypeStartPosition', { heroTypeKey: 'berserker' })])
    ];
    
    this.saveTree();
    this.isTextShown = true;
  }

  public loadTree(): void {
    if (!this.treeAsText) {
      return;
    }

    const deserializedJson = JSON.parse(this.treeAsText);
    const transitions = deserializedJson.transitions.map((t: any) => new Transition(t.fromX, t.fromY, t.toX, t.toY));
    const nodes = deserializedJson.nodes.map((n: any) => 
      new SkillTreeNode(
        n.x, 
        n.y, 
        n.abilities.map((ability: any) => 
          new SkillTreeNodeAbility(
            ability.typeKey, 
            ability.data
          )
        )
      )
    );
    this.transitions = transitions;
    this.nodes = nodes;
    this.selectedNode = undefined;
  }

  public saveTree(): void {
    const saveModel = {
      transitions: this.transitions,
      nodes: this.nodes
    };

    this.treeAsText = JSON.stringify(saveModel, null, 2);
  }

  public selectNode(node: SkillTreeNode): void {
    this.selectedNode = node;
  }

  public deleteNode(node: SkillTreeNode): void {
    this.nodes.splice(this.nodes.indexOf(node), 1);
    this.transitions = this.transitions.filter(transition => 
      !(transition.fromX === node.x && transition.fromY === node.y)
      && !(transition.toX === node.x && transition.toY === node.y)
    );
  }

  public isNodeHeroTypeStartPosition(node: SkillTreeNode): boolean {
    return node.abilities.some(ability => ability.typeKey === 'heroTypeStartPosition');
  }

  public getNodeLabel(node: SkillTreeNode): string {
    return node.abilities
      .map(ability => this.getNodeAbilityLabel(ability))
      .join('\n');
  }

  private getNodeAbilityLabel(ability: SkillTreeNodeAbility): string {
    switch(ability.typeKey) {
      case 'heroTypeStartPosition': 
        return `${ability.data.heroTypeKey}`;
      case 'attribute':
        return `${ability.data.abilityTags.length > 0 ? ability.data.abilityTags.join(' ') + ' ' : ''}${ability.data.attributeType}: ${ability.data.isAdditive ? '' : 'x'}${ability.data.amount}`;
      default: 
        return `${ability.typeKey}: ${JSON.stringify(ability.data, null, 2)}`
    }
  }

  public getNodeLeft(node: SkillTreeNode): number {
    return node.x * this.cellSize;
  }

  public getNodeTop(node: SkillTreeNode): number {
    return node.y * this.cellSize;
  }

  public getTransitionLeft(transition: Transition): number {
    let left = transition.lowestX * this.cellSize;
    left += this.nodeSize / 2;
    return left;
  }

  public getTransitionTop(transition: Transition): number {
    let top = transition.lowestY * this.cellSize;
    top += this.nodeSize / 2;
    return top;
  }

  public getTransitionTransform(transition: Transition): string {
    let transform = '';
    if (transition.fromX === transition.toX) {
      transform = `translate(-50%, 110px) rotate(90deg)`;
    } else {
      transform = 'translateY(-50%)';
    }
    return transform;
  }

  private getNodeAt(x: number, y: number): SkillTreeNode | undefined {
    return this.nodes.find(node => node.x === x && node.y === y);
  }

  private getTransition(fromX: number, fromY: number, toX: number, toY: number): Transition | undefined {
    return this.transitions.find(t => 
      t.fromX === fromX 
      && t.fromY === fromY 
      && t.toX === toX 
      && t.toY === toY
    )
    || this.transitions.find(t => 
      t.fromX === toX
      && t.fromY === toY 
      && t.toX === fromX
      && t.toY === fromY
    );
  }

  private buildNewNode(previousNode: SkillTreeNode, x: number, y: number): SkillTreeNode {
    if (this.isNodeHeroTypeStartPosition(previousNode)) {
      const typeKey = 'attribute';
      const data = { 
        isAdditive: true,
        attributeType: 'maximum-health',
        abilityTags: [],
        amount: 200
      }
      const abilities = [new SkillTreeNodeAbility(typeKey, data)];
      const newNode = new SkillTreeNode(x, y, abilities);
      return newNode;
    } else {
      const abilities = [];
      for(const ability of previousNode.abilities) {
        const copiedData = JSON.parse(JSON.stringify(ability.data));
        const newAbility = new SkillTreeNodeAbility(ability.typeKey, copiedData);
        abilities.push(newAbility);
      }
      const newNode = new SkillTreeNode(x, y, abilities);
      return newNode;
    }
  }

  private insertNodeIfNeeded(previousNode: SkillTreeNode, x: number, y: number): void {
    const existingNode = this.getNodeAt(x, y);
    if (!existingNode) {
      const newNode = this.buildNewNode(previousNode, x, y);
      this.nodes.push(newNode);
    }
  }

  private insertTransitionIfNeeded(fromX: number, fromY: number, toX: number, toY: number): void {
    const existingTransition = this.getTransition(fromX, fromY, toX, toY);
    if (!existingTransition) {
      const newTransition = new Transition(fromX, fromY, toX, toY);
      this.transitions.push(newTransition);
    }
  }

  public createTransitionLeftFrom(node: SkillTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    const x = node.x - 1;
    const y = node.y;
    this.insertNodeIfNeeded(node, x, y);
    this.insertTransitionIfNeeded(node.x, node.y, x, y);
  }

  public createTransitionRightFrom(node: SkillTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    const x = node.x + 1;
    const y = node.y;
    this.insertNodeIfNeeded(node, x, y);
    this.insertTransitionIfNeeded(node.x, node.y, x, y);
  }

  public createTransitionUpFrom(node: SkillTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    const x = node.x;
    const y = node.y - 1;
    this.insertNodeIfNeeded(node, x, y);
    this.insertTransitionIfNeeded(node.x, node.y, x, y);
  }

  public createTransitionDownFrom(node: SkillTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    const x = node.x;
    const y = node.y + 1;
    this.insertNodeIfNeeded(node, x, y);
    this.insertTransitionIfNeeded(node.x, node.y, x, y);
  }

  public handleSelectedNodeAbilitiesChangeEvent(event: Event): void {
    if (!this.selectedNode) {
      return;
    }

    const value = (event.target as any).value;
    let newAbilities;
    try {
      newAbilities = JSON.parse(value);
    }
    catch(e) {
      return;
    }

    this.selectedNode.abilities = newAbilities.map((ability: any) => new SkillTreeNodeAbility(ability.typeKey, ability.data));
  }

  public deleteTransition(transition: Transition): void {
    this.transitions.splice(this.transitions.indexOf(transition), 1);
  }

  public startDragging(mouseEvent: MouseEvent): void {
    this.dragStartX = mouseEvent.clientX;
    this.dragStartY = mouseEvent.clientY;
  }

  public stopDragging(mouseEvent: MouseEvent): void {
    this.dragStartX = undefined;
    this.dragStartY = undefined;
  }

  public handleMouseMove(mouseEvent: MouseEvent): void {
    if (this.dragStartX && this.dragStartY) {
      mouseEvent.preventDefault();

      const newDragStartX = mouseEvent.clientX;
      const newDragStartY = mouseEvent.clientY;
      const deltaX = (newDragStartX - this.dragStartX) / this.zoom;
      const deltaY = (newDragStartY - this.dragStartY) / this.zoom;
      let newX = this.translateX + deltaX;
      let newY = this.translateY + deltaY;

      this.translateX = newX;
      this.translateY = newY;
      this.dragStartX = newDragStartX;
      this.dragStartY = newDragStartY;
    }
  }

  public handleMouseScroll(mouseEvent: WheelEvent): void {
    mouseEvent.preventDefault();

    const scrollSpeed = mouseEvent.deltaY;
    const zoomChangeExponent = -scrollSpeed / 100;
    const zoomChangeBase = 1.1;
    const zoomChangeFactor = Math.pow(zoomChangeBase, zoomChangeExponent);
    const oldZoom = this.zoom;
    const newZoom = this.zoom * zoomChangeFactor;

    const browserElement = mouseEvent.currentTarget as Element;

    const browserElementX = mouseEvent.clientX - browserElement.clientLeft;
    const browserElementY = mouseEvent.clientY - browserElement.clientTop;
    const worldX = -this.translateX + browserElementX / oldZoom;
    const worldY = -this.translateY + browserElementY / oldZoom;
    const newX = -worldX + browserElementX / newZoom;
    const newY = -worldY + browserElementY / newZoom;

    this.translateX = newX;
    this.translateY = newY;
    this.zoom = newZoom;
  }
}
