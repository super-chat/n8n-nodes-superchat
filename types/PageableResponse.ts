export type PageableResponse<T> = {
  url: string;
  results: T[];
  pagination: {
    next_cursor: string | null;
    previous_cursor: string | null;
    next_url: string | null;
    previous_url: string | null;
  };
};
