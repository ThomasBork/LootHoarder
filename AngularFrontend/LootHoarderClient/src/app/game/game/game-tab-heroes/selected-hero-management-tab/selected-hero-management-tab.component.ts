import { Component, Input, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/game/web-socket/web-socket.service';
import { Hero } from '../../client-representation/hero';
import { ContractDeleteHeroMessage } from 'src/loot-hoarder-contract/client-actions/contract-delete-hero-message';

@Component({
  selector: 'app-selected-hero-management-tab',
  templateUrl: './selected-hero-management-tab.component.html',
  styleUrls: ['./selected-hero-management-tab.component.scss']
})
export class SelectedHeroManagementTabComponent {
  @Input()
  public hero!: Hero;

  public constructor(
    private readonly webSocketService: WebSocketService
  ) {
  }

  public onDeleteHeroClick(): void {
    const answer = window.prompt(`Are you sure that you want to delete this hero, ${this.hero.name} (level ${this.hero.level})? Type 'delete' to delete it.`);
    if (answer === 'delete') {
      this.deleteHero();
    }
  }

  private deleteHero(): void {
    const deleteHeroMessage = new ContractDeleteHeroMessage(this.hero.id);
    this.webSocketService.send(deleteHeroMessage);
  }
}
