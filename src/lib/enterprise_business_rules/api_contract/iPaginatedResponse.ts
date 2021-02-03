export interface IPaginatedResponse<T> {
  next?: string;
  list: Array<T>;
}
