import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Observable, Subscription, combineLatest, filter, map, share, switchMap } from 'rxjs';
import { Memoized, notUndefined } from 'src/app/shared/utils/core';
import { cache, observeProperty } from 'src/app/shared/utils/rxjs';

@Component({
    selector: 'app-video-stream-outlet',
    templateUrl: './video-stream-outlet.component.html',
    styleUrls: ['./video-stream-outlet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class VideoStreamOutletComponent implements OnInit, OnDestroy {
    @Input() public videoStream?: Observable<Blob>;
    @Input() public videoSize?: VideoSize;

    @ViewChild('canvas') public canvasElementRef?: ElementRef<HTMLCanvasElement>;

    private readonly subscriptions = new Subscription();

    public ngOnInit(): void {
        this.subscriptions.add(this.updateCanvasSizeOnVideoSizeInputChange());
        this.subscriptions.add(this.renderVideoFrames());
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private updateCanvasSizeOnVideoSizeInputChange(): Subscription {
        return combineLatest([this.canvasElement$, this.videoSize$.pipe(filter(notUndefined))]).subscribe(([canvas, videoSize]) => {
            canvas.width = videoSize.width;
            canvas.height = videoSize.height;
        });
    }

    private renderVideoFrames(): Subscription {
        const videoFrameImage$ = this.videoFrames$.pipe(switchMap((videoFrame) => createImageBitmap(videoFrame)));

        return combineLatest([this.canvasElement$, videoFrameImage$]).subscribe(([canvas, videoFrame]) => {
            canvas.getContext('2d')?.drawImage(videoFrame, 0, 0);
        });
    }

    @Memoized private get videoFrames$(): Observable<Blob> {
        return observeProperty(this as VideoStreamOutletComponent, 'videoStream').pipe(
            switchMap((videoStream) => videoStream ?? EMPTY),
            share(),
        );
    }

    @Memoized private get videoSize$(): Observable<VideoSize | undefined> {
        return observeProperty(this as VideoStreamOutletComponent, 'videoSize');
    }

    @Memoized private get canvasElement$(): Observable<HTMLCanvasElement> {
        return observeProperty(this as VideoStreamOutletComponent, 'canvasElementRef').pipe(
            map((canvasElementRef) => canvasElementRef?.nativeElement),
            filter(notUndefined),
            cache(),
        );
    }
}

interface VideoSize {
    width: number;
    height: number;
}
