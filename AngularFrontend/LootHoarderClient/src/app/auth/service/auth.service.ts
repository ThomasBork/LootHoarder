import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginRequest } from "./login-request";
import { AppConfigService } from "../../app-config.service";
import { CreateUserInput } from "./create-user-input";
import { ContractUserWithAuthToken } from 'src/loot-hoarder-contract/contract-user-with-auth-token';
import { StoredLogin } from "./stored-login";

@Injectable()
export class AuthService {
  private apiUrl: string;

  public constructor(
    private readonly http: HttpClient,
    private readonly appConfigService: AppConfigService
  ) {
    this.apiUrl = appConfigService.apiUrl;
  }

  public login(userName: string, password: string): Promise<ContractUserWithAuthToken> {
    const endPoint = `${this.apiUrl}/auth/login`;
    const body: LoginRequest = { userName, password };
    return this.http.post<ContractUserWithAuthToken>(endPoint, body)
      .toPromise()
      .then(result => result);
  }

  public createUser(userName: string, password: string, email: string): Promise<number> {
    const endPoint = `${this.apiUrl}/auth/createUser`;
    const body: CreateUserInput = { userName, password, email };
    return this.http.post<{ userId: number }>(endPoint, body)
      .toPromise()
      .then(result => result.userId);
  }

  public storeLogin(userId: number, userName: string, authToken: string): void {
    const login: StoredLogin = {
      userId: userId,
      userName: userName,
      authToken: authToken
    };
    localStorage.setItem('login', JSON.stringify(login));
  }

  public getLogin(): StoredLogin | undefined {
    const loginJson = localStorage.getItem('login');
    if(!loginJson) {
      return undefined;
    }
    const login = JSON.parse(loginJson) as StoredLogin;
    return login;
  }

  public isAuthenticated(): boolean {
    const authToken = this.getLogin();
    if (authToken) {
      // TODO: Check for expiration.
      return true;
    } else {
      return false;
    }
  }
}
