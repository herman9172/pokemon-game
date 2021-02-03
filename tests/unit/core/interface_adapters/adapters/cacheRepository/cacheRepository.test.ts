import { CacheRepositoryRedis } from '@core/interface_adapters/adapters';
import { loggerRepositoryStub } from '@tests/stubs/coreStubs';
import dotenv from 'dotenv';
import redis from 'redis';

dotenv.config();

describe('DB Repository In Redis', () => {
  it('should set data', async () => {
    // Since it's a singleton this should only happen once
    spyOn(redis, 'createClient').and.returnValue({
      set: (_key, _value, callback) => {
        callback(undefined, 'OK');
      },
      get: (_key, callback) => {
        callback(undefined, '100');
      },
      hmset: (_key, _obj, callback) => {
        callback(undefined, 'OK');
      },
      hgetall: (_key, callback) => {
        callback(undefined, {});
      },
      del: (_key, callback) => {
        callback(undefined, 1);
      },
      exists: (_key, callback) => {
        callback(undefined, 1);
      },
      setex: (_key, _time, _value, callback) => {
        callback(undefined, 'OK');
      },
      expire: (_key, _time, callback) => {
        callback(undefined, 1);
      },
      geoadd: (_set, _long, _lat, _key, callback) => {
        callback(undefined, 1);
      },
      georadius: (_set, _long, _lat, _radius, _unit, _order, callback) => {
        callback(undefined, ['PREFIX--84.04927421361208,9.92589517935164']);
      },
      zrem: (_set, _key, callback) => {
        callback(undefined, 1);
      },
    });

    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    const row = await dbRepo.set('Hello_world', { data: '100' });
    expect(row).toBeDefined();
  });

  it('should get data', async () => {
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    const reply = await dbRepo.get('Hello_world');
    expect(reply).toBeDefined();
  });

  it('should hmSet data', async () => {
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    const reply = await dbRepo.hmSet('Hello_world_all', { good: 'morning' });
    expect(reply).toBeDefined();
  });

  it('should hGetAll data', async () => {
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    const reply = await dbRepo.hGetAll('Hello_world_all');
    expect(reply).toBeDefined();
  });

  it('should remove data', async () => {
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    const reply = await dbRepo.remove('Hello_world');
    expect(reply).toBeDefined();
  });

  it('should exists data', async () => {
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    const reply = await dbRepo.exists('Hello_world_all');
    expect(reply).toBeDefined();
  });

  it('should setEx data', async () => {
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    const reply = await dbRepo.setEx('Hello_world', 20000, '345');
    expect(reply).toBeDefined();
  });

  it('should expire data', async () => {
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    const reply = await dbRepo.expire('Hello_world', 20000);
    expect(reply).toBeDefined();
  });

  it('should  get error on expire data', async () => {
    expect.hasAssertions();

    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    spyOn(dbRepo, 'expire').and.throwError('my error');

    try {
      await dbRepo.expire('Hello_world', 20000);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should geoadd data', async () => {
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    const row = await dbRepo.geoadd('test-set', -84.04927421361208, 9.92589517935164, 'test-point');
    expect(row).toEqual(1);
  });

  it('should get the nearest point to a location', async () => {
    const response = '{body:{},location:{}}';
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    spyOn(dbRepo, 'get').and.returnValue(response);

    const row = await dbRepo.getNearestPoint('test-set', -84.04927421361208, 9.92589517935164, '100');
    expect(row).toEqual(response);
  });

  it('should remove dirty data from geospatial set and return an empty value', async () => {
    const dbRepo = CacheRepositoryRedis.getInstance(loggerRepositoryStub);
    spyOn(dbRepo, 'get').and.returnValue(undefined);

    const row = await dbRepo.getNearestPoint('test-set', -84.04927421361208, 9.92589517935164, '100');
    expect(row).toEqual(undefined);
  });
});
