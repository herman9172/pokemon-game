import { LogRepositoryConsole } from '@core/interface_adapters/adapters';
import { logDataStub, loggerStub } from '@tests/stubs/coreStubs';
import { iRequestStub } from '@tests/stubs/requestStubs';

describe('Log Repository Console', () => {
  it('should create logger', () => {
    const logRepositoryConsole = new LogRepositoryConsole(iRequestStub.traceId);
    expect(
      logRepositoryConsole.transformData({
        method: 'My method',
        timestamp: '18:11:03 GMT-0600 (Central Standard Time)',
        level: 'info',
        message: 'my message',
        meta: undefined,
      }),
    ).toEqual(
      `18:11:03 GMT-0600 (Central Standard Time) RequestID: ${iRequestStub.traceId}  - method: My method [info]: my message `,
    );
    // TODO: @Alki this format is wrong, please fix
  });

  it('should create with meta data logger', () => {
    const logRepositoryConsole = new LogRepositoryConsole(iRequestStub.traceId);
    expect(
      logRepositoryConsole.transformData({
        method: 'My method',
        timestamp: '18:11:03 GMT-0600 (Central Standard Time)',
        level: 'info',
        message: 'my message',
        meta: { user: false },
      }),
    ).toEqual(
      `18:11:03 GMT-0600 (Central Standard Time) RequestID: ${
        iRequestStub.traceId
      }  - method: My method [info]: my message data:\n${JSON.stringify({ user: false })}`,
    );
    // TODO: @Alki this format is wrong, please fix
  });

  it('should get create options', () => {
    spyOn(LogRepositoryConsole.prototype, 'create').and.returnValue(loggerStub);
    const logRepositoryConsole = new LogRepositoryConsole(iRequestStub.traceId);

    const createOptions = logRepositoryConsole.getCreateOptions();
    expect(createOptions.level).toEqual('silly');
  });

  it('should log info', () => {
    spyOn(LogRepositoryConsole.prototype, 'create').and.returnValue(loggerStub);
    spyOn(loggerStub, 'log').and.returnValue(true);

    const logRepositoryConsole = new LogRepositoryConsole(iRequestStub.traceId);
    logRepositoryConsole.info(logDataStub);
    expect(loggerStub.log).toHaveBeenCalledWith({
      level: 'info',
      message: logDataStub.message,
      meta: logDataStub.data,
    });
  });

  it('should log error', () => {
    spyOn(LogRepositoryConsole.prototype, 'create').and.returnValue(loggerStub);
    spyOn(loggerStub, 'log').and.returnValue(true);

    const logRepositoryConsole = new LogRepositoryConsole(iRequestStub.traceId);
    logRepositoryConsole.error(logDataStub);
    expect(loggerStub.log).toHaveBeenCalledWith({
      level: 'error',
      message: logDataStub.message,
      meta: logDataStub.data,
    });
  });

  it('should log warn', () => {
    spyOn(LogRepositoryConsole.prototype, 'create').and.returnValue(loggerStub);
    spyOn(loggerStub, 'log').and.returnValue(true);

    const logRepositoryConsole = new LogRepositoryConsole(iRequestStub.traceId);
    logRepositoryConsole.warn(logDataStub);
    expect(loggerStub.log).toHaveBeenCalledWith({
      level: 'warn',
      message: logDataStub.message,
      meta: logDataStub.data,
    });
  });

  it('should log debug', () => {
    spyOn(LogRepositoryConsole.prototype, 'create').and.returnValue(loggerStub);
    spyOn(loggerStub, 'log').and.returnValue(true);

    const logRepositoryConsole = new LogRepositoryConsole(iRequestStub.traceId);
    logRepositoryConsole.debug(logDataStub);
    expect(loggerStub.log).toHaveBeenCalledWith({
      level: 'debug',
      message: logDataStub.message,
      meta: logDataStub.data,
    });
  });

  it('should log debug without clear data', () => {
    spyOn(LogRepositoryConsole.prototype, 'create').and.returnValue(loggerStub);
    spyOn(loggerStub, 'log').and.returnValue(true);

    const logRepositoryConsole = new LogRepositoryConsole(iRequestStub.traceId);
    logRepositoryConsole.debug(logDataStub);
    expect(loggerStub.log).toHaveBeenCalledWith({
      level: 'debug',
      message: logDataStub.message,
      meta: logDataStub.data,
    });
  });
});
