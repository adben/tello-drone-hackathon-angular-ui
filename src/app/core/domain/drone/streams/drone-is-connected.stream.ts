import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { createWebSocketStreamWithAutoReconnect } from 'src/app/core/utils/websocket';
import { ProxyObservable, cache, readWebSocket } from 'src/app/shared/utils/rxjs';

@Injectable({ providedIn: 'root' })
export class DroneIsConnectedStream extends ProxyObservable<boolean> {
    constructor() {
        super(
            createWebSocketStreamWithAutoReconnect(`ws://${location.host}/ws/drone/is-connected`).pipe(
                readWebSocket(),
                map(({ data }) => data === 'true'),
                cache(),
            ),
        );
    }
}
