export interface Response<T = null> {
  statusCode: number;
  responseMessage: string;
  totalCount: number;
  errors: string[];
  data: T;
}
export interface IApiError {
  statusCode: number;
  data: null;
  responseMessage: string;
  totalCount: number;
  errors: string[];
}
export interface IPaginatedResponse<T> {
  message: string;
  status: number;
  data: {
    docs: Array<T>;
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

export interface ISelectItemPropsWithValueGeneric {
  value: string | number;
  label: string;
}

export interface ISelectItemProps
  extends Omit<ISelectItemPropsWithValueGeneric, "value"> {
  value: string;
}
