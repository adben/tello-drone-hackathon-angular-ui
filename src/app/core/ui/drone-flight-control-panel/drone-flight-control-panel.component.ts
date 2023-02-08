import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, Subject, Subscription, catchError, map, mergeMap, of } from 'rxjs';

import { DroneService } from '../../domain/drone/drone.service';

@Component({
    selector: 'app-drone-flight-control-panel',
    templateUrl: './drone-flight-control-panel.component.html',
    styleUrls: ['./drone-flight-control-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatSnackBarModule],
})
export class DroneFlightControlPanelComponent implements OnInit, OnDestroy {
    public readonly formControls = {
        forwardDistance: new FormControl<number>(20, { nonNullable: true, validators: [Validators.min(20), Validators.max(500)] }),
        backwardDistance: new FormControl<number>(20, { nonNullable: true, validators: [Validators.min(20), Validators.max(500)] }),
        leftDistance: new FormControl<number>(20, { nonNullable: true, validators: [Validators.min(20), Validators.max(500)] }),
        rightDistance: new FormControl<number>(20, { nonNullable: true, validators: [Validators.min(20), Validators.max(500)] }),
        upDistance: new FormControl<number>(20, { nonNullable: true, validators: [Validators.min(20), Validators.max(500)] }),
        downDistance: new FormControl<number>(20, { nonNullable: true, validators: [Validators.min(20), Validators.max(500)] }),
        leftRotation: new FormControl<number>(90, { nonNullable: true, validators: [Validators.min(1), Validators.max(360)] }),
        rightRotation: new FormControl<number>(90, { nonNullable: true, validators: [Validators.min(1), Validators.max(360)] }),
    };

    private readonly subscriptions = new Subscription();
    private readonly actionsSubject = new Subject<{ action: Action; description: string }>();

    constructor(private readonly droneService: DroneService, private readonly matSnackbar: MatSnackBar) {}

    public ngOnInit(): void {
        this.subscriptions.add(this.handleActions());
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public takeoff(): void {
        this.executeAction(() => this.droneService.takeoff(), 'takeoff');
    }

    public land(): void {
        this.executeAction(() => this.droneService.land(), 'land');
    }

    public emergencyStop(): void {
        this.executeAction(() => this.droneService.emergencyStop(), 'emergency stop');
    }

    public moveForward(): void {
        const distance = this.formControls.forwardDistance.value;
        this.executeAction(() => this.droneService.moveForward(distance), `move ${distance} mm forward`);
    }

    public moveBackward(): void {
        const distance = this.formControls.backwardDistance.value;
        this.executeAction(() => this.droneService.moveBackward(distance), `move ${distance} mm backward`);
    }

    public moveLeft(): void {
        const distance = this.formControls.leftDistance.value;
        this.executeAction(() => this.droneService.moveLeft(distance), `move ${distance} mm left`);
    }

    public moveRight(): void {
        const distance = this.formControls.rightDistance.value;
        this.executeAction(() => this.droneService.moveRight(distance), `move ${distance} mm right`);
    }

    public moveUp(): void {
        const distance = this.formControls.upDistance.value;
        this.executeAction(() => this.droneService.moveUp(distance), `move ${distance} mm up`);
    }

    public moveDown(): void {
        const distance = this.formControls.downDistance.value;
        this.executeAction(() => this.droneService.moveDown(distance), `move ${distance} mm down`);
    }

    public turnLeft(): void {
        const rotation = this.formControls.leftRotation.value;
        this.executeAction(() => this.droneService.turnLeft(rotation), `turn ${rotation} degrees left`);
    }

    public turnRight(): void {
        const rotation = this.formControls.rightRotation.value;
        this.executeAction(() => this.droneService.turnRight(rotation), `turn ${rotation} degrees right`);
    }

    public trackRed(): void {
        this.executeAction(() => this.droneService.trackRed(), `track Red`);
    }

    public trackYellow(): void {
        this.executeAction(() => this.droneService.trackYellow(), `track Yellow`);
    }

    public trackGreen(): void {
        this.executeAction(() => this.droneService.trackGreen(), `track Green`);
    }

    public trackBlue(): void {
        this.executeAction(() => this.droneService.trackBlue(), `track Blue`);
    }

    public go(): void {
        this.executeAction(() => this.droneService.go(), `go`);
    }

    private executeAction(action: Action, description: string): void {
        this.actionsSubject.next({ action, description });
    }

    private handleActions(): Subscription {
        return this.actionsSubject
            .pipe(
                mergeMap(({ action, description }) =>
                    action().pipe(
                        map(() => true),
                        catchError(() => of(false)),
                        map((actionSucceeded) => ({ description, result: actionSucceeded ? 'success' : 'failure' } as const)),
                    ),
                ),
            )
            .subscribe(() => {});
    }
}

type Action = () => Observable<void>;
