import { IDbRepository } from '@core/interface_adapters/adapters';
import { ILogRepository } from '@core/interface_adapters/adapters/logRepository/iLogRepository';
import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { IUsersRepository } from '@lib/interface_adapters/storage/users_repository/iUsersRepository';

export class UsersRepository implements IUsersRepository {

  private static mapFullUserFromDB(dbResult: any): IUser {
    const userResult = dbResult[0][0];
    // const userRolesResult = dbResult[1];
    // const userPermissionsResult = dbResult[2];

    const user = UsersRepository.mapUserFromDB(userResult);

    // agent.roles = userRolesResult.map((roleResult) => roleResult.role as TaxiAgentRole);
    // agent.permissions = userPermissionsResult.map((roleResult) => roleResult.permission);

    return user;
  } // end of mapFullUserFromDB

  private static mapUserFromDB(dbResult: any): IUser {
    return {
      sub: dbResult.cognito_sub,
      username: dbResult.email,
      email: dbResult.email,
      phone: dbResult.phone,
      firstName: dbResult.first_name,
      lastName: dbResult.last_name,
      enabled: !!dbResult.enabled,
      userStatus: dbResult.status_id,
      createdAt: new Date(dbResult.created_at).getTime(),
    };
  } // end of mapUserFromDB

  constructor(private readonly dbRepository: IDbRepository, private readonly logger: ILogRepository) {}

  async upsertUser(user: IUser): Promise<IUser> {
    this.logger.debug({ method: 'UsersRepository.upsertUser' });
    const result = await this.dbRepository.query('CALL `sp_UpsertUser` (?,?,?,?,?,?);', [
      user.sub,
      user.email,
      user.phone,
      user.firstName,
      user.lastName,
      user.enabled,
    ]);

    const upsertedUser = UsersRepository.mapFullUserFromDB(result);
    this.logger.debug({ method: 'UsersRepository.upsertUser', data: { body: upsertedUser } });

    return upsertedUser;
  } // end of upsertUser

  async getUser(email: string): Promise<IUser> {
    this.logger.debug({ method: 'UsersRepository.getUser' });
    const result = await this.dbRepository.query('CALL `sp_GetUser` (?);', [
      email,
    ]);

    const user = UsersRepository.mapFullUserFromDB(result);

    return user;
  } // end of getUser
}
