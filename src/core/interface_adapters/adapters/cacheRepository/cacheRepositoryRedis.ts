// istanbul ignore file

import { env } from '@config/env';
import { ICacheRepository, ILogRepository } from '@core/interface_adapters/adapters';
import { promisifyAll } from 'bluebird';
import { createClient } from 'redis';

export class CacheRepositoryRedis implements ICacheRepository {
  private static _instance: CacheRepositoryRedis;
  private client;

  // Makes this class a singleton
  static getInstance(logger: ILogRepository): CacheRepositoryRedis {
    return CacheRepositoryRedis._instance || (CacheRepositoryRedis._instance = new CacheRepositoryRedis(logger));
  }

  async set(key: string, value: any = ''): Promise<string> {
    await this.initializeClient();

    return this.client.setAsync(key, JSON.stringify(value));
  }

  async get(key: string): Promise<string> {
    await this.initializeClient();

    return this.client.getAsync(key);
  }

  // Add Generics to pass the data type.
  async hGetAll(key: string): Promise<any> {
    await this.initializeClient();

    return this.client.hgetallAsync(key);
  }

  async remove(key: string): Promise<number> {
    await this.initializeClient();

    return this.client.delAsync(key);
  }

  async hmSet(key: string, obj: any): Promise<string> {
    await this.initializeClient();

    return this.client.hmsetAsync(key, obj);
  }

  async exists(key: string): Promise<number> {
    await this.initializeClient();

    return this.client.existsAsync(key);
  }

  async setEx(key: string, time: number, value: any = ''): Promise<string> {
    await this.initializeClient();

    return this.client.setexAsync(key, time, JSON.stringify(value));
  }

  async expire(key: string, time: number): Promise<number> {
    await this.initializeClient();

    return this.client.expireAsync(key, time);
  }

  async geoadd(set: string, long: number, lat: number, key: string): Promise<number> {
    await this.initializeClient();

    return this.client.geoaddAsync(set, long, lat, key);
  }

  // this method returns the nearest point to a provided location
  async getNearestPoint(set: string, longitude: number, latitude: number, radius: string): Promise<string> {
    // georadius will give you all the locations in the given radius ordered from the nearest to the farthest
    const keys = await this.georadius(set, longitude, latitude, radius);
    let result;
    let index = 0;

    // a loop to get the nearest value from redis
    while (!result && keys.length > index) {
      result = await this.get(keys[index]);
      if (!result) {
        // if we do not get a result, mean that the key has expired, so the key inside the geospatial set must be removed
        await this.zrem(set, keys[index]);
      }
      index++;
    }

    return result;
  }

  async close(): Promise<boolean> {
    if (this.client?.connected) {
      CacheRepositoryRedis._instance = undefined;

      return this.client.quit();
    }

    return true;
  }

  async timeout(miliSegs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, miliSegs));
  }

  private constructor(private readonly logger: ILogRepository) {
    // tslint:disable-next-line
    this.initializeClient();
    this.logger = this.logger;
  }

  private async initializeClient(): Promise<void> {
    if (this.client) {
      return;
    }

    try {
      await this.createClient();
    } catch (error) {
      await this.timeout(300);
      await this.createClient();
    }
  }

  private async createClient(): Promise<void> {
    this.client = createClient(env.REDIS_URI);
    await promisifyAll(this.client);
  }

  private async georadius(set: string, long: number, lat: number, radius: string): Promise<Array<string>> {
    await this.initializeClient();

    return this.client.georadiusAsync(set, long, lat, radius, 'm', 'ASC');
  }

  private async zrem(set: string, key: string): Promise<string> {
    await this.initializeClient();

    return this.client.zremAsync(set, key);
  }
}
