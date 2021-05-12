import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
    @Input() value!: number;
    @Input() minimumValue!: number;
    @Input() maximumValue!: number;
    @Input() backgroundColor: string = 'white';
    @Input() barColor: string = 'green';
    @Input() rightToLeft: boolean = false;
    @Input() text: string = '';
    @Input() textColor: string = 'black';
    @Input() height: string = '';

    public get barWidth(): string {
        const rangeSize = this.maximumValue - this.minimumValue;
        const relativeValue = this.value - this.minimumValue;
        if (relativeValue <= 0) {
            return '0';
        }
        const percentage = relativeValue / rangeSize * 100;
        return percentage + '%';
    }
}
