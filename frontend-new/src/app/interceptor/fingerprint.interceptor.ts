import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable()
export class FingerprintInterceptor implements HttpInterceptor {
  private fpPromise = FingerprintJS.load();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.fpPromise).pipe(
      switchMap(fp => fp.get()),
      switchMap(result => {
        const cloned = req.clone();
        return next.handle(cloned);
      })
    );
  }
}