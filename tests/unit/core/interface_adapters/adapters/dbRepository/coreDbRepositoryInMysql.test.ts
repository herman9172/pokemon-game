import { CoreDbRepositoryInMysql, IDbRepository } from '@core/interface_adapters/adapters';
import {
  dbInMysqlCreateConnectionStub,
  dbInMysqlCreateConnectionStubWithErrorOnEnd,
  dbInMysqlCreateConnectionStubWithErrors,
} from '@tests/stubs/coreStubs';
import { secretManagerRepositoryStub } from '@tests/stubs/servicesStubs';
import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config();

let dbRepository: IDbRepository;
describe('Core DB Repository In MySQL', () => {
  afterEach(async () => {
    await dbRepository.close();
  });

  describe('creating from secrets repository', () => {
    beforeEach(() => {
      dbRepository = CoreDbRepositoryInMysql.fromSecretRepository('key', secretManagerRepositoryStub);
    });

    it('should get data', async () => {
      spyOn(mysql, 'createConnection').and.returnValue(dbInMysqlCreateConnectionStub);

      const rows = await dbRepository.query('select * from user where id = ?', [1]);
      expect(rows).toBeDefined();
    });

    it('should get err on query', async () => {
      expect.hasAssertions();
      spyOn(mysql, 'createConnection').and.returnValue(dbInMysqlCreateConnectionStubWithErrors);

      try {
        await dbRepository.query('select * from user where id = ?', [1]);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('should close connection', async () => {
      spyOn(mysql, 'createConnection').and.returnValue(dbInMysqlCreateConnectionStub);

      // query to start the connection first
      await dbRepository.query('select * from demo_table', []);
      const data = await dbRepository.close();
      expect(data).toBeTruthy();
    });

    it('should err on close connection', async () => {
      expect.hasAssertions();
      spyOn(mysql, 'createConnection').and.returnValue(dbInMysqlCreateConnectionStubWithErrorOnEnd);

      try {
        // query to start the connection first
        await dbRepository.query('select * from demo_table', []);
        await dbRepository.close();
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('should not create connection during repository creation', () => {
      const createConnectionSpy = spyOn(mysql, 'createConnection').and.returnValue(dbInMysqlCreateConnectionStub);
      // dbRepository created in `beforeEach`
      expect(createConnectionSpy).not.toHaveBeenCalled();
    });

    it('should create connection before first query', async () => {
      const createConnectionSpy = spyOn(mysql, 'createConnection').and.returnValue(dbInMysqlCreateConnectionStub);

      const rows = await dbRepository.query('select * from demo_table', []);
      expect(createConnectionSpy).toHaveBeenCalled();
      expect(rows).toBeDefined();
    });

    it('should not give an error closing the connection before creating it', async () => {
      spyOn(mysql, 'createConnection').and.returnValue(dbInMysqlCreateConnectionStub);

      const data = await dbRepository.close();
      expect(data).toBeTruthy();
    });
  });

  describe('creating from connection options', () => {
    beforeEach(() => {
      dbRepository = CoreDbRepositoryInMysql.fromConnectionOptions({
        host: 'host',
        port: 3306,
        user: 'user',
        password: 'pass',
        database: 'db',
      });
    });

    it('should create connection from connection options before first query', async () => {
      const createConnectionSpy = spyOn(mysql, 'createConnection').and.returnValue(dbInMysqlCreateConnectionStub);

      const rows = await dbRepository.query('select * from demo_table', []);
      expect(createConnectionSpy).toHaveBeenCalled();
      expect(rows).toBeDefined();
    });
  });
});
