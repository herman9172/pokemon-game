import { IEconomicActivityCategory } from '@lib/enterprise_business_rules/api_contract/economic_activities';

export interface IEconomicActivity {
  id: number;
  name: string;
  category: IEconomicActivityCategory;
  code: number;
  details: string;
}
