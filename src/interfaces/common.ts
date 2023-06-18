import { IGenaricErrorMessage } from './error';

export type IGenaricResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenaricErrorResponse = {
  statusCode: number;
  message: string;
  errorMessage: IGenaricErrorMessage[];
};
