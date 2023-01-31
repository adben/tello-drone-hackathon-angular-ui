import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DroneState } from '../../domain/drone';

import { DroneStateFieldComponent } from './components/drone-state-field/drone-state-field.component';

@Component({
    selector: 'app-drone-state-panel',
    templateUrl: './drone-state-panel.component.html',
    styleUrls: ['./drone-state-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [DroneStateFieldComponent],
})
export class DroneStatePanelComponent {
    @Input() public droneState?: DroneState;
}
