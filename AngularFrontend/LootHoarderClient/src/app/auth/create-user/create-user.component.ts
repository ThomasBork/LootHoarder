import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public userName: string = '';
  public password: string = '';
  public password2: string = '';
  public email: string = '';

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) { }

  public ngOnInit(): void {
    this.clearForm();
  }

  public async createUser(): Promise<void> {
    if (this.password !== this.password2) {
      console.log('Passwords must match');
    }
    await this.authService.createUser(this.userName, this.password, this.email);
    this.router.navigate(['/login/']);
    // Redirect to login
  }

  private clearForm(): void {
    this.userName = '';
    this.password = '';
    this.password2 = '';
    this.email = '';
  }
}
