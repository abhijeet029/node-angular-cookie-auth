import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router, private _authService: AuthService) {}

  async login() {
    const loginPayload = {
      username: this.username,
      password: this.password
    };
    const _loginResp = await this._authService.login(this.username,this.password)
    this.router.navigate(['/profile']);
    return 
    this.http.post('http://localhost:3000/login', loginPayload, {
      withCredentials: true
    }).subscribe({
      next: (res: any) => {
        console.log('Login success:', res);
        this.router.navigate(['/profile']); // or wherever you want to redirect
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error.message || 'Login failed';
      }
    });
  }
}
