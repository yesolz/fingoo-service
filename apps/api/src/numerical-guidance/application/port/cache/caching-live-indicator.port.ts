import { LiveIndicatorDtoType } from '../../../../commons/type/type-definition';

export interface CachingLiveIndicatorPort {
  cachingLiveIndicator(key: string, liveIndicatorDto: LiveIndicatorDtoType): Promise<void>;
}
