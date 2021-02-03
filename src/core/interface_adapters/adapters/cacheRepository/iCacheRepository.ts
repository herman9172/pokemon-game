export interface ICacheRepository {
  set(key: string, value: object): Promise<string>;
  get(key: string): Promise<string>;
  hGetAll(key: string): Promise<any>;
  remove(key: string): Promise<number>;
  hmSet(key: string, obj: any): Promise<string>;
  exists(key: string): Promise<number>;
  setEx(key: string, time: number, value: object): Promise<string>;
  expire(key: string, time: number): Promise<number>;
  geoadd(set: string, long: number, lat: number, key: string): Promise<number>;
  getNearestPoint(set: string, longitude: number, latitude: number, radius: string): Promise<string>;
}
