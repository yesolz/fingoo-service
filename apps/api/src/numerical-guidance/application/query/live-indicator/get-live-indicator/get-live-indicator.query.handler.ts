import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetLiveIndicatorQuery } from './get-live-indicator.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoadLiveIndicatorPort } from '../../../port/external/twelve/load-live-indicator.port';
import {
  FredFrequency,
  IndicatorDtoType,
  Interval,
  LiveIndicatorDtoType,
} from '../../../../../utils/type/type-definition';
import { CachingLiveIndicatorPort } from '../../../port/cache/caching-live-indicator.port';
import { LoadCachedLiveIndicatorPort } from '../../../port/cache/load-cached-live-indicator.port';
import { LoadIndicatorPort } from '../../../port/persistence/indicator/load-indicator.port';
import { LoadLiveEconomyIndicatorPort } from '../../../port/external/fred/load-live-economy-indicator.port';
import { EconomyDto } from '../../indicator/get-indicator-list/dto/economy.dto';

@Injectable()
@QueryHandler(GetLiveIndicatorQuery)
export class GetLiveIndicatorQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetLiveIndicatorQueryHandler.name);
  constructor(
    @Inject('LoadLiveIndicatorPort')
    private readonly loadLiveIndicatorPort: LoadLiveIndicatorPort,
    @Inject('LoadLiveEconomyIndicatorPort')
    private readonly loadLiveEconomyIndicatorPort: LoadLiveEconomyIndicatorPort,
    @Inject('LoadCachedLiveIndicatorPort')
    private readonly loadCachedLiveIndicatorPort: LoadCachedLiveIndicatorPort,
    @Inject('CachingLiveIndicatorPort')
    private readonly cachingLiveIndicatorPort: CachingLiveIndicatorPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  async execute(query: GetLiveIndicatorQuery): Promise<LiveIndicatorDtoType> {
    const { indicatorId, startDate, interval, indicatorType } = query;

    const indicatorDto: IndicatorDtoType = await this.loadIndicatorPort.loadIndicator(indicatorId, indicatorType);

    const { key, endDate } = this.createLiveIndicatorKey(indicatorDto, interval, startDate);

    let liveIndicatorDto: LiveIndicatorDtoType = await this.loadCachedLiveIndicatorPort.loadCachedLiveIndicator(key);

    if (this.isNotCached(liveIndicatorDto)) {
      if (indicatorType === 'economy' && interval === 'none') {
        const economicInterval: FredFrequency = (indicatorDto as EconomyDto).frequency;
        liveIndicatorDto = await this.loadAndCacheLiveEconomyIndicator(
          indicatorDto,
          economicInterval,
          startDate,
          endDate,
          key,
        );
        this.logger.log('Live indicator(FRED) 호출');
      } else {
        liveIndicatorDto = await this.loadAndCacheLiveIndicator(indicatorDto, interval, startDate, endDate, key);
        this.logger.log('Live indicator(TWELVE) 호출');
      }
    }

    return liveIndicatorDto;
  }

  private async loadAndCacheLiveIndicator(
    indicatorDto: IndicatorDtoType,
    interval: Interval,
    startDate: string,
    endDate: string,
    key: string,
  ): Promise<LiveIndicatorDtoType> {
    const liveIndicatorDto = await this.loadLiveIndicatorPort.loadLiveIndicator(
      indicatorDto,
      interval,
      startDate,
      endDate,
    );
    await this.cachingLiveIndicatorPort.cachingLiveIndicator(key, liveIndicatorDto);
    return liveIndicatorDto;
  }

  private async loadAndCacheLiveEconomyIndicator(
    indicatorDto: IndicatorDtoType,
    interval: FredFrequency,
    startDate: string,
    endDate: string,
    key: string,
  ): Promise<LiveIndicatorDtoType> {
    const liveIndicatorDto = await this.loadLiveEconomyIndicatorPort.loadLiveIndicator(
      indicatorDto,
      interval,
      startDate,
      endDate,
    );
    await this.cachingLiveIndicatorPort.cachingLiveIndicator(key, liveIndicatorDto);
    return liveIndicatorDto;
  }

  private isNotCached(indicatorDto: LiveIndicatorDtoType): boolean {
    return indicatorDto == null;
  }

  private createLiveIndicatorKey(indicatorDto: IndicatorDtoType, interval: Interval, startDate: string) {
    const nowEndDate = this.getEndDate();
    const endDate = this.formatDayToString(nowEndDate);
    const keyInterval = this.getKeyInterval(interval, indicatorDto);
    const redisExpiredKey = this.getRedisExpiredKey(nowEndDate, interval);

    const key = `${indicatorDto.indicatorType}/live-${indicatorDto.symbol}-interval:${keyInterval}-startDate:${startDate}-redisExpiredKey:${redisExpiredKey}`;
    return { key, endDate };
  }

  getEndDate(): Date {
    return new Date();
  }

  private getRedisExpiredKey(currentDate: Date, interval: string): string {
    switch (interval) {
      case 'day':
        return this.formatDayToString(currentDate);
      case 'week':
        return this.formatWeekToString(currentDate);
      case 'month':
        return this.formatMonthToString(currentDate);
      case 'year':
        return this.formatYearToString(currentDate);
      default:
        return this.formatDayToString(currentDate);
    }
  }

  private getKeyInterval(interval: Interval, indicatorDto: IndicatorDtoType): string {
    if (interval === 'none') {
      return (indicatorDto as EconomyDto).frequency || '';
    }
    return interval;
  }

  private formatDayToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatWeekToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const week = this.getISOWeekNumber(date);
    return `${year}-${month}-W${week}`;
  }

  private formatMonthToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private formatYearToString(date: Date): string {
    return String(date.getFullYear());
  }

  // 해당 날짜(년도별) ISO 식 주차 구하는 함수
  private getISOWeekNumber(date: Date): number {
    const dayOfWeek = date.getDay(); // 0 (일요일) ~ 6 (토요일)
    const jan1 = new Date(date.getFullYear(), 0, 1); // 해당 년도의 1월 1일
    const firstWeekStart = jan1.getDate() - jan1.getDay() + (jan1.getDay() === 0 ? -6 : 1);
    const currentWeekStart = date.getDate() - dayOfWeek;

    if (firstWeekStart <= currentWeekStart) {
      return Math.ceil((currentWeekStart - firstWeekStart) / 7) + 1;
    } else {
      const prevYearStart = new Date(date.getFullYear() - 1, 0, 1);
      const prevYearFirstWeekStart =
        prevYearStart.getDate() - prevYearStart.getDay() + (prevYearStart.getDay() === 0 ? -6 : 1);
      const prevYearWeeks = Math.ceil((prevYearStart.getTime() - prevYearFirstWeekStart) / (7 * 24 * 3600 * 1000));
      return prevYearWeeks + Math.ceil((date.getTime() - firstWeekStart) / (7 * 24 * 3600 * 1000)) + 1;
    }
  }
}
