
export interface ILogRepository {
  info(logEntity: ILog): void;
  error(logEntity: ILog): void;
  warn(logEntity: ILog): void;
  debug(logEntity: ILog): void;
}

export interface ILog {
  method?: string;
  message?: string;
  level?: LogLevel;
  data?: any;
}

export enum LogLevel {
  warn = 'warn',
  error = 'error',
  info = 'info',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

export interface ILogData {
  method: string;
  message: any;
  level: string;
  meta: { [key: string]: any };
  timestamp?: string;
}
