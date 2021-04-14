import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DbUserRepository } from '../persistence/db-user-repository';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');

  public constructor(private readonly dbUserRepository: DbUserRepository) {}

  public async createNewUser(userName: string, password: string, email: string): Promise<number> {
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

    const userId = await this.dbUserRepository.insertUser(userName, hash, email);

    return userId;
  }
}
