import MyResponse from "./MyResponse";

export default class MyPagingResponse extends MyResponse {
  constructor(
    data?: {
      total: number;
      page: number;
      pageSize: number;
      [key: string]: any;
    } | null,
    error?: string | null
  ) {
    if (data) {
      super(data, null);
    } else {
      super(null, error);
    }
  }

  public static createPagingResponse(
    data?: {
      total: number;
      page: number;
      pageSize: number;
      [key: string]: any;
    },
    error?: string | null
  ): MyPagingResponse {
    if (data) {
      return new MyPagingResponse({ ...data }, null);
    } else {
      return new MyPagingResponse(null, error);
    }
  }
}
