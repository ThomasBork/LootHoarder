import { Injectable } from "@nestjs/common";
import * as mysql from 'promise-mysql';

@Injectable()
export class DbQueryHelper {
  public async createConnection(): Promise<mysql.Connection> {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "loothoarder",
      multipleStatements: true
    });
    return connection;
  }

  public buildQuery (query: string, parameters: {[keys: string]: string | number | Date}): string {
    let queryWithParameters = query;
    for(const key in parameters) {
      const value = parameters[key];
      let escapedValue = value;
      if (typeof(value) === 'string') {
        escapedValue = mysql.escape(value);
      }
      else if (value instanceof Date) {
        const stringValue = value.toISOString().slice(0, 19).replace('T', ' ');
        escapedValue = mysql.escape(stringValue);
      }
      queryWithParameters = queryWithParameters.replace(new RegExp('@' + key, 'g'), escapedValue.toString());
    }
    return queryWithParameters;
  }
}
