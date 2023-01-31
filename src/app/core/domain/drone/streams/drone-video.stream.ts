import { Injectable } from '@angular/core';
import { share } from 'rxjs';
import { createWebSocketStreamWithAutoReconnect } from 'src/app/core/utils/websocket';
import { FILTERED, ProxyObservable, filterMap, readWebSocket } from 'src/app/shared/utils/rxjs';

@Injectable({ providedIn: 'root' })
export class DroneVideoStream extends ProxyObservable<Blob> {
    constructor() {
        super(
            createWebSocketStreamWithAutoReconnect(`ws://${location.host}/ws/drone/video`).pipe(
                readWebSocket(),
                filterMap(({ data }) => (data instanceof Blob ? data : FILTERED)),
                share(),
            ),
        );
    }
}
