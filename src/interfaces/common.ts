import { IGenaricErrorMessage } from './error';

export type IGenaricErrorResponse = {
  statusCode: number;
  message: string;
  errorMessage: IGenaricErrorMessage[];
};
