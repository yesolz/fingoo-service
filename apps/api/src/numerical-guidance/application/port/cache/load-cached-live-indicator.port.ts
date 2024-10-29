import { LiveIndicatorDtoType } from '../../../../commons/type/type-definition';

export interface LoadCachedLiveIndicatorPort {
  loadCachedLiveIndicator(key: string): Promise<LiveIndicatorDtoType>;
}
