export interface ISuperappRepository {
  searchUsers(filter: string): Promise<any>;
}
