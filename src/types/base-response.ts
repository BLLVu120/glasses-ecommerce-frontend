export interface BaseResponse<T> {
  code: number;
  message: string;
  result: T;
}
