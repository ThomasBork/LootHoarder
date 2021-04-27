import { Injectable, Logger } from "@nestjs/common";
import { DbQueryHelper } from "./db-query-helper";

@Injectable()
export class DbUserRepository {
  private logger: Logger = new Logger('DbUserRepository');

  public constructor(private readonly dbQueryHelper: DbQueryHelper) {}
  
  public async insertUser(userName: string, passwordHash: string, email: string): Promise<number> {
    const con = await this.dbQueryHelper.createConnection();

    const query = `
      INSERT INTO user
        (username, password, email, created_at)
      VALUES
        (@username, @password, @email, CURRENT_TIMESTAMP())
    `;

    const parameters = {
      username: userName,
      password: passwordHash,
      email: email
    };

    const queryWithParameterValues = this.dbQueryHelper.buildQuery(query, parameters);

    const result = await con.query(queryWithParameterValues);

    con.end();

    const userId = result['insertId'];

    this.logger.log('Created new user with id: ' + userId);

    return userId;
  }

  public async getPasswordHash(userName: string): Promise<string> {
    const con = await this.dbQueryHelper.createConnection();

    const query = `
      SELECT password FROM user WHERE username = @username
    `;

    const parameters = {
      username: userName
    };

    const queryWithParameterValues = this.dbQueryHelper.buildQuery(query, parameters);

    const result = await con.query(queryWithParameterValues);

    con.end();

    if (result.length === 0) {
      throw Error('No user found with user name: ' + userName);
    }

    const firstResult = result[0];

    return firstResult['password'];
  }
}
