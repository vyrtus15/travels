export interface PageResult<T> {
  page: number;
  limit: number;
  total: number;

  items: T[];
}