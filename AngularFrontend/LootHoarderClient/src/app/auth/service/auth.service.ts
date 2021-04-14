import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from "./login";
import { AppConfigService } from "../../app-config.service";
import { CreateUserInput } from "./create-user-input";

@Injectable()
export class AuthService {
  private apiUrl: string;

  public constructor(
    private readonly http: HttpClient,
    private readonly appConfigService: AppConfigService
  ) {
    this.apiUrl = appConfigService.apiUrl;
  }

  public login(userName: string, password: string): Promise<string> {
    const endPoint = `${this.apiUrl}/auth/login`;
    const body: Login = { userName, password };
    return this.http.post<{ authToken: string }>(endPoint, body)
      .toPromise()
      .then(result => result.authToken);
  }

  public createUser(userName: string, password: string, email: string): Promise<number> {
    const endPoint = `${this.apiUrl}/auth/createUser`;
    const body: CreateUserInput = { userName, password, email };
    return this.http.post<{ userId: number }>(endPoint, body)
      .toPromise()
      .then(result => result.userId);
  }

  public storeAuthToken(authToken: string): void {
    localStorage.setItem('AuthToken', authToken);
  }

  public getAuthToken(): string | null {
    return localStorage.getItem('AuthToken');
  }

  public isAuthenticated(): boolean {
    const authToken = this.getAuthToken();
    if (authToken) {
      // TODO: Check for expiration.
      return true;
    } else {
      return false;
    }
  }
}
