import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { httpClient } from 'ngx-forkable-http-client';

import { ErrorNotificationHttpInterceptor } from '../error';

export const TELLO_API_HTTP_CLIENT = new InjectionToken<HttpClient>('TELLO_API_HTTP_CLIENT', {
    factory: httpClient().with(ErrorNotificationHttpInterceptor),
});
