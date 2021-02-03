import { env } from '@config/env';

const lambdaStage = `backend-starter-${env.STAGE === 'local' ? 'dev' : env.STAGE}`;
export const lambdas = {
  PREREGISTER_MERCHANTS: `${lambdaStage}-preregister-merchants`,
};
