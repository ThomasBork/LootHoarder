import { Injectable } from "@nestjs/common";
import { DbLoginRepository } from "src/persistence/db-login-repository";
import { DbUserRepository } from "src/persistence/db-user-repository";
import { ContractUserWithAuthToken } from "src/loot-hoarder-contract/contract-user-with-auth-token";
import * as bcrypt from 'bcrypt';
import { Guid } from "./guid";

@Injectable()
export class AuthService {
  public constructor(
    private readonly dbLoginRepository: DbLoginRepository,
    private readonly dbUserRepository: DbUserRepository
  ) {}

  public async login(userName: string, password: string): Promise<ContractUserWithAuthToken> {
    const passwordHash = await this.dbUserRepository.getPasswordHash(userName);

    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!isMatch) {
      throw Error ('Invalid login credentials.');
    }

    const authToken = Guid.newGuid();

    const authTokenCreatedAt = new Date();

    const oneDay = 24 * 60 * 60 * 1000;

    const authTokenExpiresAt = new Date(authTokenCreatedAt.getTime() + oneDay * 7);

    await this.dbLoginRepository.insertLogin(userName, authToken, authTokenCreatedAt, authTokenExpiresAt);

    const user = await this.dbUserRepository.getUserByUserName(userName);

    const userWithAuthToken: ContractUserWithAuthToken = {
      userId: user.id,
      userName: user.userName,
      authToken: authToken
    };

    return userWithAuthToken;
  }

  public fetchUserIdFromAuthToken(authToken: string): Promise<number> {
    return this.dbLoginRepository.fetchUserIdFromAuthToken(authToken);
  }
}