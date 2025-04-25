export interface RequestGeminiBody {
  context: string;
  story: string;
}

export interface RequestBody extends Request {
  json(): Promise<RequestGeminiBody>;
}

export interface ResponseDataTransformedType {
  Point_start: string;
  whole_reason: {
    multi: number;
    reason: string;
  }[];
}
