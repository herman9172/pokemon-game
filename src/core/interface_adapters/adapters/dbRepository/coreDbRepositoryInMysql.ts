import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { DatabaseError, ServerError } from '@core/enterprise_business_rules/entities/errors';
import { IDbRepository, IDbRepositoryConnectionOptions, ISecretsRepository } from '@core/interface_adapters/adapters';
import { Connection, createConnection, QueryError } from 'mysql';

export class CoreDbRepositoryInMysql {
  private connection: Connection;
  private _connectionOptions: IDbRepositoryConnectionOptions;
  private _connectionOptionsSecretKey: string;
  private _secretsRepository: ISecretsRepository;

  static fromSecretRepository(
    connectionOptionsSecretKey: string,
    secretsRepository: ISecretsRepository,
  ): IDbRepository {
    const dbRepository = new CoreDbRepositoryInMysql();
    dbRepository.secretsRepository = secretsRepository;
    dbRepository.connectionOptionsSecretKey = connectionOptionsSecretKey;

    return dbRepository;
  }

  static fromConnectionOptions(connectionOptions: IDbRepositoryConnectionOptions): IDbRepository {
    const dbRepository = new CoreDbRepositoryInMysql();
    dbRepository.connectionOptions = connectionOptions;

    return dbRepository;
  }

  async query(sql: string, args: Array<any>): Promise<any> {
    if (!this.connection) {
      this.connection = createConnection(await this.getConnectionOptions());
    }

    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err: QueryError, rows) => {
        if (err) {
          reject(new DatabaseError(err));

          return;
        }

        resolve(JSON.parse(JSON.stringify(rows)));
      });
    });
  }

  async close(): Promise<boolean> {
    if (!this.connection) {
      return true;
    }

    return new Promise((resolve, reject) => {
      this.connection.end((err: QueryError) => {
        if (err) {
          reject(new DatabaseError(err));

          return;
        }

        this.connection = undefined;
        resolve(true);
      });
    });
  }

  private set connectionOptions(value: IDbRepositoryConnectionOptions) {
    this._connectionOptions = value;
  }

  private set connectionOptionsSecretKey(value: string) {
    this._connectionOptionsSecretKey = value;
  }

  private set secretsRepository(value: ISecretsRepository) {
    this._secretsRepository = value;
  }

  private async getConnectionOptions(): Promise<IDbRepositoryConnectionOptions> {
    if (this._connectionOptions) {
      return this._connectionOptions;
    }

    return this.getConnectionOptionsFromSecrets();
  }

  private async getConnectionOptionsFromSecrets(): Promise<IDbRepositoryConnectionOptions> {
    try {
      const connectionSecret = (await this._secretsRepository.getSecret(this._connectionOptionsSecretKey)) as string;

      return JSON.parse(connectionSecret);
    } catch (err) {
      throw new ServerError(
        `Error retrieving the connection options from the Secrets Manager.\n${err.toString()}`,
        CoreErrorCodes.DB_REPOSITORY_ERROR_WITH_SECRET,
      );
    }
  }

  private constructor() {}
}
