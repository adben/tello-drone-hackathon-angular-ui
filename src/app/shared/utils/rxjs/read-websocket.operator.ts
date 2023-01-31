import { Observable, OperatorFunction, switchMap } from 'rxjs';

export function readWebSocket(): OperatorFunction<WebSocket, MessageEvent<unknown>> {
    return (source$) =>
        source$.pipe(
            switchMap(
                (websocket) =>
                    new Observable<MessageEvent<unknown>>((subscriber) => {
                        function onMessage(messageEvent: MessageEvent<unknown>): void {
                            subscriber.next(messageEvent);
                        }

                        function onClose(): void {
                            subscriber.complete();
                        }

                        websocket.addEventListener('message', onMessage);
                        websocket.addEventListener('close', onClose);

                        return () => {
                            websocket.removeEventListener('message', onMessage);
                            websocket.removeEventListener('close', onClose);
                        };
                    }),
            ),
        );
}
