import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { SessionService } from "../session/session.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const sessionService = inject(SessionService);

    if (sessionService.sessionExists) {
        req = req.clone({
            setHeaders: {
                'Authorization': `Bearer ${sessionService.session.token}`
            }
        });
    }
    return next(req);
}