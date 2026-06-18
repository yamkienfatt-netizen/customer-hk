
export type GraphQlSearch<T> = {
    search: {
      total: Number;
      pageInfo: {
        endCursor: string;
        hasNext: boolean;
      };
      results: T;
    };
  };
  