import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private backendUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  async login(email: string, password: string) {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const deviceId = result.visitorId;

    return this.http.post(`${this.backendUrl}/login`, {
      email,
      password,
      deviceId
    }, { withCredentials: true }).toPromise();
  }
}
