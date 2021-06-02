import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-notification-bubble',
    templateUrl: './notification-bubble.component.html',
    styleUrls: ['./notification-bubble.component.scss']
})
export class NotificationBubbleComponent {
    @Input() value!: number;
}
