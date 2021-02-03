import { IDbRepository } from '@core/interface_adapters/adapters';
import { ILogRepository } from '@core/interface_adapters/adapters/logRepository/iLogRepository';
import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { IUsersRepository } from '@lib/interface_adapters/storage/agents_repository/iUsersRepository';

export class UsersRepository implements IUsersRepository {
  private static mapFullUserFromDB(dbResult: any): IUser {
    const userResult = dbResult[0][0];
    // const userRolesResult = dbResult[1];
    // const userPermissionsResult = dbResult[2];

    const agent = UsersRepository.mapUserFromDB(userResult);

    // agent.roles = userRolesResult.map((roleResult) => roleResult.role as TaxiAgentRole);
    // agent.permissions = userPermissionsResult.map((roleResult) => roleResult.permission);

    return agent;
  } // end of mapFullUserFromDB

  private static mapUserFromDB(dbResult: any): IUser {
    return {
      sub: dbResult.idCognito,
      username: dbResult.username,
      email: dbResult.email,
      phone: dbResult.phone,
      firstName: dbResult.firstName,
      lastName: dbResult.lastName,
      enabled: !!dbResult.enabled,
      userStatus: dbResult.statusId,
      createdAt: new Date(dbResult.createdAt).getTime(),
    };
  } // end of mapUserFromDB

  constructor(private readonly dbRepository: IDbRepository, private readonly logger: ILogRepository) {}

  async upsertUser(user: IUser): Promise<IUser> {
    this.logger.debug({ method: 'TaxiAdminRepository.upsertUser' });
    const result = await this.dbRepository.query('CALL `UpsertUser_sp` (?,?,?,?,?,?,?);', [
      user.sub,
      user.username,
      user.email,
      user.phone,
      user.firstName,
      user.lastName,
      user.enabled,
    ]);

    const upsertedAgent = UsersRepository.mapFullUserFromDB(result);
    this.logger.debug({ method: 'TaxiAdminRepository.upsertUser', data: { body: upsertedAgent } });

    return upsertedAgent;
  } // end of upsertUser
}
