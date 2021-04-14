import { Injectable, Logger } from "@nestjs/common";
import { DbQueryHelper } from "./db-query-helper";

@Injectable()
export class DbLoginRepository {
  private logger: Logger = new Logger('DbUserRepository');
  
  public constructor(private readonly dbQueryHelper: DbQueryHelper) {}

  public async insertLogin(userName: string, authToken: string, createdAt: Date, expiresAt: Date): Promise<void> {
    const con = await this.dbQueryHelper.createConnection();

    const query = `
      DELETE FROM active_login WHERE user_id = (SELECT id FROM user WHERE username = @username);

      INSERT INTO active_login
        (auth_token, user_id, created_at, expires_at)
      VALUES
        (@auth_token, (SELECT id FROM user WHERE username = @username), @created_at, @expires_at);
    `;

    const parameters = {
      username: userName,
      auth_token: authToken,
      created_at: createdAt,
      expires_at: expiresAt
    };

    const queryWithParameterValues = this.dbQueryHelper.buildQuery(query, parameters);

    await con.query(queryWithParameterValues);

    this.logger.log('Saved new login for user: ' + userName);
  }

  public async fetchUserIdFromAuthToken(authToken: string): Promise<number> {
    const con = await this.dbQueryHelper.createConnection();

    const query = `
      SELECT user_id 
      FROM active_login 
      WHERE 
        auth_token = @auth_token 
        AND expires_at > CURRENT_TIMESTAMP
    `;

    const parameters = {
      auth_token: authToken
    };

    const queryWithParameterValues = this.dbQueryHelper.buildQuery(query, parameters);

    const result = await con.query(queryWithParameterValues);

    if (result.length === 0) {
      throw Error('Auth token has expired or does not exist.');
    }

    return result[0]['user_id'];
  }
}
