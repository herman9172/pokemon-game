import { CoreErrorCodes } from '@core/enterprise_business_rules/constants/errorCodes/coreErrorCodes';
import { GatewayTimeoutError } from '@core/enterprise_business_rules/entities/errors/gatewayTimeoutError';
import axios from 'axios';

const TIMEOUT_IN_MILLIS = 25000;

export const axiosCore = axios.create({
  timeout: TIMEOUT_IN_MILLIS,
}); // end of axiosCore

// Interceptor used to return custom error when request timed out
axiosCore.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.message?.toLowerCase().includes('timeout')) {
      return Promise.reject(
        new GatewayTimeoutError('Dependency exceeded timeout', CoreErrorCodes.DEPENDENCY_EXCEEDED_TIMEOUT),
      );
    }

    // This will be translated to a ServerError
    return Promise.reject(error);
  },
); // end of axiosCore.interceptors.response.use timeout
