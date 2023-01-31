import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-drone-state-field',
    templateUrl: './drone-state-field.component.html',
    styleUrls: ['./drone-state-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class DroneStateFieldComponent {}
