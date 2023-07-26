export type IPaginationOption = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
/*
pagination constant and req.query ---> pick.ts ---> it create IPaginationOption (pagination option interface) ---> calculate pagination ---> that's it.
*/
