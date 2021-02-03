import {
  ILog,
  ILogData,
  ILogRepository,
  LogLevel,
} from '@core/interface_adapters/adapters/logRepository/iLogRepository';
import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';

export class LogRepositoryConsole implements ILogRepository {
  private static instance: LogRepositoryConsole;
  private readonly logger: Logger;

  constructor(private readonly requestId: string) {
    this.logger = this.create();
  }

  public static getInstance(requestId: string): ILogRepository {
    if (!LogRepositoryConsole.instance) {
      LogRepositoryConsole.instance = new LogRepositoryConsole(requestId);
    }

    return LogRepositoryConsole.instance;
  }

  info(logEntity: ILog): void {
    this.logger.log({
      method: logEntity.method,
      level: LogLevel.info,
      message: logEntity.message,
      meta: logEntity.data,
    });
  }

  error(logEntity: ILog): void {
    this.logger.log({
      method: logEntity.method,
      level: LogLevel.error,
      message: logEntity.message,
      meta: logEntity.data,
    });
  }

  warn(logEntity: ILog): void {
    this.logger.log({
      method: logEntity.method,
      message: logEntity.message,
      level: LogLevel.warn,
      meta: logEntity.data,
    });
  }

  debug(logEntity: ILog): void {
    this.logger.log({
      method: logEntity.method,
      message: logEntity.message,
      level: LogLevel.debug,
      meta: logEntity.data,
    });
  }

  getCreateOptions(): LoggerOptions {
    return {
      level: LogLevel.silly,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.colorize(),
        format.printf((info: ILogData) => this.transformData(info)),
      ),
      transports: [new transports.Console()],
    };
  }

  create(): Logger {
    const config: LoggerOptions = this.getCreateOptions();

    return createLogger(config);
  }

  transformData(info: ILogData): string {
    return `${info.timestamp} RequestID: ${this.requestId} ${info.method ? ` - method: ${info.method}` : ''} [${
      info.level
    }]: ${info.message ? info.message : ''} ${info.meta ? `data:\n${JSON.stringify(info.meta)}` : ''}`;
  }
}
