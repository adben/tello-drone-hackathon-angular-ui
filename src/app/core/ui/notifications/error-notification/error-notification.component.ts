import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface ErrorNotificationComponentData {
    message: string;
}

@Component({
    selector: 'app-error-notification',
    templateUrl: './error-notification.component.html',
    styleUrls: ['./error-notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButtonModule, MatIconModule],
})
export class ErrorNotificationComponent {
    public readonly message: string;

    constructor(
        private readonly snackBarRef: MatSnackBarRef<ErrorNotificationComponent>,
        @Inject(MAT_SNACK_BAR_DATA) data: ErrorNotificationComponentData,
    ) {
        this.message = data.message;
    }

    @HostListener('click') public dismiss(): void {
        this.snackBarRef.dismiss();
    }
}
