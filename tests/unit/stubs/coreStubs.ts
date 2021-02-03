// tslint:disable
// istanbul ignore file
import { IContext } from '@core/enterprise_business_rules/entities/context';
import { ILog } from '@core/interface_adapters/adapters';
import { ILogRepository } from '@core/interface_adapters/adapters';

export const logDataStub: ILog = {
  message: 'Log Message',
  data: { idLog: 1, password: 'password', list: [{ id: 1, name: 'message' }] },
};

export const loggerStub = {
  log: () => {},
};

// DB Repository Stubs

export const dbInMysqlCreateConnectionStub = {
  query: (_sql, _args, callback) => {
    callback(undefined, []);
  },
  end: (callback) => {
    callback(undefined, []);
  },
};

export const dbInMysqlCreateConnectionStubWithErrorOnEnd = {
  query: dbInMysqlCreateConnectionStub.query,
  end: jest
    .fn()
    .mockImplementationOnce((callback) => callback('my error'))
    .mockImplementation((callback) => callback(undefined)),
};

export const dbInMysqlCreateConnectionStubWithErrors = {
  query: (_sql, _args, callback) => {
    callback('my error');
  },
  end: (callback) => {
    callback(undefined, []);
  },
};

export const callbackStub = (): any => {};

export const loggerRepositoryStub: ILogRepository = {
  info: (_logEntity: ILog) => {},
  debug: (_logEntity: ILog) => {},
  warn: (_logEntity: ILog) => {},
  error: (_logEntity: ILog) => {},
  //setUser: (_user: CreateUserRequest) => {},
};
export const traceIdStub = '123456';

export const contextStub: IContext = {
  //user: new CreateUserRequest(userStub),
  traceId: traceIdStub,
  sourceIp: '0.0.0.0',
};
