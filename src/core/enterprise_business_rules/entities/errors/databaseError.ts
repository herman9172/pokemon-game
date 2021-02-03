import { CoreErrorCodes, HttpStatusCode } from '@core/enterprise_business_rules/constants';
import {
  BaseError,
  ErrorCode,
  ErrorTypes,
  ICustomError,
} from '@core/enterprise_business_rules/entities/errors/baseError';
import { QueryError } from 'mysql';

interface ISqlErrNO {
  errno: number;
  sqlState: string;
}

interface ISqlErr {
  errno: number;
  sqlState: string;
  statusCode: number;
  message: string;
  code: ErrorCode;
}

const sqlErrMsgs: Array<ISqlErr> = [
  {
    errno: 1032,
    sqlState: 'HY000',
    message: "Can't find record",
    statusCode: HttpStatusCode.NOT_FOUND,
    code: CoreErrorCodes.UNKNOWN,
  },
  {
    errno: 1758,
    sqlState: '35000',
    message: 'Invalid condition number',
    statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
    code: CoreErrorCodes.UNKNOWN,
  },
  {
    errno: 1022,
    sqlState: '23000',
    message: "Can't write; duplicate key in table",
    statusCode: HttpStatusCode.CONFLICT,
    code: CoreErrorCodes.UNKNOWN,
  },
  {
    errno: 1064,
    sqlState: '42000',
    message: 'You have an error in your SQL syntax',
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    code: CoreErrorCodes.UNKNOWN,
  },
];

const findSqlError = ({ errno, sqlState }: ISqlErrNO): ISqlErr =>
  sqlErrMsgs.find((sqlErr) => sqlErr?.errno === errno && sqlErr?.sqlState === sqlState);

export class DatabaseError extends BaseError {
  sqlMessage?: string;
  sqlState?: string;
  sqlErrorNumber?: number;

  constructor(dbError: QueryError, traceId?: string) {
    const sqlErr = { errno: dbError.errno, sqlState: dbError.sqlState };
    const mappedError = findSqlError(sqlErr);
    const error: ICustomError = {
      type: ErrorTypes.DatabaseError,
      httpStatus: mappedError?.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: mappedError?.message || (dbError as any).sqlMessage || dbError.message,
      traceId,
      code: mappedError?.code,
    };
    super(error);

    this.sqlMessage = (dbError as any).sqlMessage;
    this.sqlState = dbError.sqlState;
    this.sqlErrorNumber = dbError.errno;
  }
}
