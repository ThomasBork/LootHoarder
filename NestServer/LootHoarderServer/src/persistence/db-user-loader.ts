import { Injectable } from '@nestjs/common';
import { DbUser } from './db-user';
import { DbQueryHelper } from './db-query-helper';

@Injectable()
export class DbUserLoader {
  public constructor(private readonly dbQueryHelper: DbQueryHelper) {}
  
  public async loadWithId(id: number): Promise<DbUser | undefined> {
    const con = await this.dbQueryHelper.createConnection();

    const query = `
      SELECT id, username
      FROM user 
      WHERE id = @userId
    `;

    const parameters = {
      userId: id
    };

    const queryWithParameterValues = this.dbQueryHelper.buildQuery(query, parameters);

    const result = await con.query(queryWithParameterValues);

    con.end();

    if (result.length === 0) {
      return undefined;
    }

    const dbUser = {
      id: result[0]['id'],
      userName: result[0]['username']
    };

    return dbUser;
  }
}
