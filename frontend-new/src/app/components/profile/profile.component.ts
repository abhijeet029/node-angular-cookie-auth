import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  message: string = '';
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ message: string }>('http://localhost:3000/profile', {
      withCredentials: true // 👈 send the cookie with the request
    }).subscribe({
      next: (res) => {
        this.message = res.message;
      },
      error: (err) => {
        this.error = err.error?.message || 'Unauthorized';
        console.error('Profile access error:', err);
      }
    });
  }
}
