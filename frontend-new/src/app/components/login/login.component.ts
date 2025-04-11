import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const loginPayload = {
      username: this.username,
      password: this.password
    };

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
