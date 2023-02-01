import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subject, Subscription, catchError, map, mergeMap, of } from 'rxjs';

import { DroneService } from '../../domain/drone/drone.service';

@Component({
    selector: 'app-drone-flight-control-panel',
    templateUrl: './drone-flight-control-panel.component.html',
    styleUrls: ['./drone-flight-control-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule, MatButtonModule, MatIconModule],
})
export class DroneFlightControlPanelComponent implements OnInit, OnDestroy {
    public readonly formControls = {
        forwardDistance: new FormControl<number>(10, { nonNullable: true }),
        backwardDistance: new FormControl<number>(10, { nonNullable: true }),
        leftDistance: new FormControl<number>(10, { nonNullable: true }),
        rightDistance: new FormControl<number>(10, { nonNullable: true }),
        upDistance: new FormControl<number>(10, { nonNullable: true }),
        downDistance: new FormControl<number>(10, { nonNullable: true }),
        leftRotation: new FormControl<number>(90, { nonNullable: true }),
        rightRotation: new FormControl<number>(90, { nonNullable: true }),
    };

    private readonly subscriptions = new Subscription();
    private readonly actionsSubject = new Subject<{ action: Action; description: string }>();

    constructor(private readonly droneService: DroneService) {}

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
        this.executeAction(() => this.droneService.moveForward(distance), `move ${distance} cm forward`);
    }

    public moveBackward(): void {
        const distance = this.formControls.backwardDistance.value;
        this.executeAction(() => this.droneService.moveBackward(distance), `move ${distance} cm backward`);
    }

    public moveLeft(): void {
        const distance = this.formControls.leftDistance.value;
        this.executeAction(() => this.droneService.moveLeft(distance), `move ${distance} cm left`);
    }

    public moveRight(): void {
        const distance = this.formControls.rightDistance.value;
        this.executeAction(() => this.droneService.moveRight(distance), `move ${distance} cm right`);
    }

    public moveUp(): void {
        const distance = this.formControls.upDistance.value;
        this.executeAction(() => this.droneService.moveUp(distance), `move ${distance} cm up`);
    }

    public moveDown(): void {
        const distance = this.formControls.downDistance.value;
        this.executeAction(() => this.droneService.moveDown(distance), `move ${distance} cm down`);
    }

    public turnLeft(): void {
        const rotation = this.formControls.leftRotation.value;
        this.executeAction(() => this.droneService.turnLeft(rotation), `turn ${rotation} degrees left`);
    }

    public turnRight(): void {
        const rotation = this.formControls.rightRotation.value;
        this.executeAction(() => this.droneService.turnRight(rotation), `turn ${rotation} degrees right`);
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
            .subscribe(({ description, result }) => {
                console.log(description, '->', result);
            });
    }
}

type Action = () => Observable<void>;
