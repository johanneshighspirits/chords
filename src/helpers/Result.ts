type SuccessResult<Data> = {
  success: true;
  data: Data;
};

type ErrorResult<Error> = {
  success: false;
  error: Error;
};

export type Result<Data, Error = undefined> =
  | SuccessResult<Data>
  | ErrorResult<Error>;

function fail(): ErrorResult<never>;
function fail<Error>(error: Error): ErrorResult<Error>;
function fail(error?: string) {
  return {
    success: false,
    error,
  };
}

function ok(): SuccessResult<never>;
function ok<Data>(data: Data): SuccessResult<Data>;
function ok(data?: unknown) {
  return {
    success: true,
    data,
  };
}

export const Result = {
  ok,
  fail,
};

export type AsyncResult<Data, Error = undefined> = Promise<Result<Data, Error>>;
