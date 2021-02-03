import { IDbRepositoryConnectionOptions } from '@core/interface_adapters/adapters';
import args from 'args';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import yaml from 'yamljs';

import { ILiquibaseParams, LiquibaseHelper } from './_liquibase/liquibaseHelper';

class DatabaseMigration {
  constructor(private readonly stage: string) {}

  async runMigration(): Promise<void> {
    const spinner = ora('Starting migration').start();

    const liquibaseConfig = this.getLiquibaseConfig();

    spinner.info('Configuration loaded');

    const liquibase = new LiquibaseHelper(liquibaseConfig);

    spinner.info('Running migration');

    try {
      await liquibase.run('update');
    } catch (err) {
      spinner.fail('Migration error');
      console.error('\nAn error occurred during migration\n', err);
    } finally {
      spinner.info('The migration has finished');
      spinner.stop();
    }
  }

  private getDatabaseConfig(): IDbRepositoryConnectionOptions {
    const envFile = `${__dirname}/../../serverless-files/${this.stage}/config.yml`;
    const fileContent = fs.readFileSync(envFile, 'utf8').toString();
    const { environment: env } = yaml.parse(fileContent);

    return {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_SCHEMA,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    };
  }

  private getLiquibaseConfig(): ILiquibaseParams {
    const databaseConfig = this.getDatabaseConfig();

    return {
      changeLogFile: path.relative(process.cwd(), path.join(__dirname, 'database_changelog.xml')),
      classpath: path.join(__dirname, '_liquibase/mariadb-java-client-2.7.0.jar'),
      url: `jdbc:mariadb://${databaseConfig.host}/${databaseConfig.database}`,
      username: databaseConfig.user,
      password: databaseConfig.password,
    };
  }
}

const main = async () => {
  args.option('stage', 'Database Stage [local, dev, qa, uat, prod]', 'local');
  const flags = args.parse(process.argv);

  await new DatabaseMigration(flags.stage).runMigration();
};

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    process.exit(0);
  });
