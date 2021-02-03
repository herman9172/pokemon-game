export interface IDbRepositoryConnectionOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  timezone?: string;
  multipleStatements?: boolean;
}

export interface IDbRepository {
  close(): Promise<boolean>;
  query(sql: string, args?: Array<any>): Promise<any>;
}
