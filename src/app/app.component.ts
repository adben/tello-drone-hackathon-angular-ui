import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExtendedAsyncPipeWithUndefinedAsDefault } from 'ngx-extended-async-pipe';

import { DroneIsConnectedStream, DroneStateStream, DroneVideoStream } from './core/domain/drone';
import { DroneService } from './core/domain/drone/drone.service';
import { DroneStatePanelComponent } from './core/ui/drone-state-panel';
import { VideoStreamOutletComponent } from './core/ui/video-stream-outlet';
import { LetDirective } from './shared/utils/angular';
import { pull } from './shared/utils/rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        ExtendedAsyncPipeWithUndefinedAsDefault,
        LetDirective,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatTooltipModule,
        VideoStreamOutletComponent,
        DroneStatePanelComponent,
    ],
})
export class AppComponent {
    constructor(
        public readonly droneVideoFrame$: DroneVideoStream,
        public readonly droneIsConnected$: DroneIsConnectedStream,
        public readonly droneState$: DroneStateStream,
        private readonly droneService: DroneService,
    ) {}

    public toggleConnection(): void {
        const isConnected = pull(this.droneIsConnected$, undefined);

        if (isConnected === undefined) {
            return;
        }

        if (isConnected) {
            this.droneService.disconnect();
        }

        if (!isConnected) {
            this.droneService.connect();
        }
    }

    public toggleVideoStream(enableVideoStream: boolean): void {
        if (enableVideoStream) {
            this.droneService.startVideoStream();
        } else {
            this.droneService.stopVideoStream();
        }
    }
}
