import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public userName: string = '';
  public password: string = '';

  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  public ngOnInit(): void {
    this.clearForm();
  }

  public async login(): Promise<void> {
    const authToken = await this.authService.login(this.userName, this.password);
    this.authService.storeAuthToken(authToken);
    this.router.navigate(['/']);
  }

  public handleKeyPress(keyEvent: KeyboardEvent): void {
    if (keyEvent.key === 'Enter') {
      this.login();
    }
  }

  private clearForm(): void {
    this.userName = '';
    this.password = '';
  }
}
