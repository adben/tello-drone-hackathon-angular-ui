import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { commit } from 'src/app/shared/utils/rxjs';

import { TELLO_API_HTTP_CLIENT } from '../../api';

@Injectable({ providedIn: 'root' })
export class DroneService {
    constructor(@Inject(TELLO_API_HTTP_CLIENT) private readonly httpClient: HttpClient) {}

    public connect(): Observable<void> {
        return this.sendCommand('connect');
    }

    public disconnect(): Observable<void> {
        return this.sendCommand('disconnect');
    }

    public startVideoStream(): Observable<void> {
        return this.sendCommand('video/start');
    }

    public stopVideoStream(): Observable<void> {
        return this.sendCommand('video/stop');
    }

    public takeoff(): Observable<void> {
        return this.sendCommand('flight/takeoff');
    }

    public land(): Observable<void> {
        return this.sendCommand('flight/land');
    }

    public emergencyStop(): Observable<void> {
        return this.sendCommand('flight/emergency-stop');
    }

    public moveForward(distanceInMillimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-forward/${distanceInMillimeters}`);
    }

    public moveBackward(distanceInMillimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-backward/${distanceInMillimeters}`);
    }

    public moveLeft(distanceInMillimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-left/${distanceInMillimeters}`);
    }

    public moveRight(distanceInMillimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-right/${distanceInMillimeters}`);
    }

    public moveUp(distanceInMillimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-up/${distanceInMillimeters}`);
    }

    public moveDown(distanceInMillimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-down/${distanceInMillimeters}`);
    }

    public turnLeft(rotationInDegrees: number): Observable<void> {
        return this.sendCommand(`flight/turn-left/${rotationInDegrees}`);
    }

    public turnRight(rotationInDegrees: number): Observable<void> {
        return this.sendCommand(`flight/turn-right/${rotationInDegrees}`);
    }

    public trackRed(): Observable<void> {
        return this.sendCommand(`flight/track-red`);
    }

    public trackYellow(): Observable<void> {
        return this.sendCommand(`flight/track-yellow`);
    }

    public trackGreen(): Observable<void> {
        return this.sendCommand(`flight/track-green`);
    }

    public trackBlue(): Observable<void> {
        return this.sendCommand(`flight/track-blue`);
    }

    public go(): Observable<void> {
        return this.sendCommand(`chasing/balloons`);
    }

    private sendCommand(command: string): Observable<void> {
        return this.httpClient.get(`/api/drone/${command}`).pipe(
            map(() => undefined),
            commit(),
        );
    }
}
