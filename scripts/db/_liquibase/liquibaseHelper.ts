import childProcess from 'child_process';

export interface ILiquibaseParams {
  changeLogFile?: string;
  url?: string;
  username?: string;
  password?: string;
  classpath?: string;
}

const liquibaseBin = 'liquibase';
export class LiquibaseHelper {
  params: ILiquibaseParams;

  constructor(params: ILiquibaseParams = {}) {
    this.params = { ...params };
  }

  run(action = 'update', params = '') {
    return this._exec(`${this._command} ${action} ${params}`);
  }

  get _command(): any {
    let cmd = liquibaseBin;
    Object.keys(this.params).forEach((key) => {
      const value = this.params[key];
      cmd = `${cmd} --${key}=${value}`;
    });

    return cmd;
  }

  _exec(command, options = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, options, (error, stdout) => {
        console.log(stdout);
        if (error) {
          return reject(error);
        }

        resolve({
          stdout,
        });
      });
    });
  }
}
