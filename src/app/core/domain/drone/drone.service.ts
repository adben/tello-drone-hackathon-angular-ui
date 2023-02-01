import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { commit } from 'src/app/shared/utils/rxjs';

@Injectable({ providedIn: 'root' })
export class DroneService {
    constructor(private readonly httpClient: HttpClient) {}

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

    public moveForward(distanceInCentimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-forward/${distanceInCentimeters}`);
    }

    public moveBackward(distanceInCentimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-backward/${distanceInCentimeters}`);
    }

    public moveLeft(distanceInCentimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-left/${distanceInCentimeters}`);
    }

    public moveRight(distanceInCentimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-right/${distanceInCentimeters}`);
    }

    public moveUp(distanceInCentimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-up/${distanceInCentimeters}`);
    }

    public moveDown(distanceInCentimeters: number): Observable<void> {
        return this.sendCommand(`flight/move-down/${distanceInCentimeters}`);
    }

    public turnLeft(rotationInDegrees: number): Observable<void> {
        return this.sendCommand(`flight/turn-left/${rotationInDegrees}`);
    }

    public turnRight(rotationInDegrees: number): Observable<void> {
        return this.sendCommand(`flight/turn-right/${rotationInDegrees}`);
    }

    private sendCommand(command: string): Observable<void> {
        return this.httpClient.get(`/api/drone/${command}`).pipe(
            map(() => undefined),
            commit(),
        );
    }
}
