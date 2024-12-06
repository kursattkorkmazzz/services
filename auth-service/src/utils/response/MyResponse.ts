export default class MyResponse {
  private error?: string | null;
  private data?: any | null;

  constructor(data?: any | null, error?: string | null) {
    this.error = error;
    this.data = data;
  }

  public static createResponse(
    data?: any | null,
    error?: string | null
  ): MyResponse {
    if (error) {
      return new MyResponse(null, error);
    }
    return new MyResponse(data, null);
  }

  public getResponse(): { data?: any | null; error?: string | null } {
    return {
      error: this.error || null,
      data: this.data,
    };
  }
}
