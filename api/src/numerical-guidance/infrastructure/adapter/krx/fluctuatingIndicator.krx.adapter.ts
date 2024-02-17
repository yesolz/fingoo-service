import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FluctuatingIndicatorDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { LoadFluctuatingIndicatorPort } from 'src/numerical-guidance/application/port/external/load-fluctuatingIndicator.port';
import { Interval, Market } from 'src/utils/type/type-definition';

@Injectable()
export class FluctuatingIndicatorKrxAdapter implements LoadFluctuatingIndicatorPort {
  constructor(private readonly api: HttpService) {}

  async loadFluctuatingIndicator(
    dataCount: number,
    ticker: string,
    interval: Interval,
    market: Market,
    endDate: string,
  ): Promise<FluctuatingIndicatorDto> {
    // KRX API 통신 -> 현재 일자부터 이전 데이터 모두 조회
    const serviceKey: string = process.env.SERVICE_KEY;
    const request_url: string = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${serviceKey}&numOfRows=${dataCount}&pageNo=1&resultType=json&endBasDt=${endDate}&likeSrtnCd=${ticker}&mrktCls=${market.toUpperCase()}`;

    const res = await this.api.axiosRef.get(request_url);
    const { numOfRows, pageNo, totalCount, items } = res.data.response.body;
    const type = 'k-stock';
    const responseData = FluctuatingIndicatorDto.create({ type, numOfRows, pageNo, totalCount, items });

    if (!responseData) {
      throw new Error('API response body is undefined');
    }
    return FluctuatingIndicatorKrxAdapter.transferredByInterval(interval, responseData);
  }

  static transferredByInterval(interval: Interval, data: FluctuatingIndicatorDto) {
    switch (interval) {
      case 'day':
        return this.transferDayResponse(data);
      case 'week':
        return this.calculateWeeklyAverage(data);
      case 'month':
        return this.calculateMonthlyAverage(data);
      case 'year':
        return this.calculateYearlyAverage(data);
      default:
        return data;
    }
  }

  static transferDayResponse(data: FluctuatingIndicatorDto) {
    const items = data.items.item;
    const dayResponse = [];

    for (let i = 0; i < items.length; i++) {
      const { basDt, srtnCd, isinCd, itmsNm, mrktCtg, clpr } = items[i];

      dayResponse.push({
        date: basDt,
        ...{ srtnCd, isinCd, itmsNm, mrktCtg },
        value: clpr,
      });
    }

    data.items.item = dayResponse;

    return data;
  }

  static calculateWeeklyAverage(data: FluctuatingIndicatorDto) {
    const items = data.items.item;
    const weeklyAverages = [];
    const processedWeeks = new Set();

    for (let i = 0; i < items.length; i++) {
      const currentDate = new Date(items[i].basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

      const weeklyItems = items.filter((item) => {
        const itemDate = new Date(item.basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

        const isSameWeek =
          currentDate.getFullYear() === itemDate.getFullYear() &&
          this.getISOWeekNumber(currentDate) === this.getISOWeekNumber(itemDate);

        return isSameWeek;
      });

      if (weeklyItems.length > 0) {
        const weekIdentifier = `${currentDate.getFullYear()}-${this.getISOWeekNumber(currentDate)}`;

        if (!processedWeeks.has(weekIdentifier)) {
          const weeklyClprSum = weeklyItems.reduce((sum, item) => sum + parseInt(item.clpr), 0);
          const weeklyAverage = weeklyClprSum / weeklyItems.length;

          const { basDt, srtnCd, isinCd, itmsNm, mrktCtg } = weeklyItems[0];

          weeklyAverages.push({
            date: basDt,
            ...{ srtnCd, isinCd, itmsNm, mrktCtg },
            value: weeklyAverage.toFixed(2),
          });

          processedWeeks.add(weekIdentifier);
        }
      }
    }
    data.items.item = weeklyAverages;
    return data;
  }

  static getISOWeekNumber(date: Date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return weekNumber;
  }

  static calculateMonthlyAverage(data: FluctuatingIndicatorDto) {
    const items = data.items.item;
    const monthlyAverages = [];
    const processedMonths = new Set();

    for (let i = 0; i < items.length; i++) {
      const currentDate = new Date(items[i].basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

      const monthlyItems = items.filter((item) => {
        const itemDate = new Date(item.basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

        const isSameMonth =
          currentDate.getFullYear() === itemDate.getFullYear() && currentDate.getMonth() === itemDate.getMonth();

        return isSameMonth;
      });

      if (monthlyItems.length > 0) {
        const monthIdentifier = currentDate.getMonth();

        if (!processedMonths.has(monthIdentifier)) {
          const monthlyClprSum = monthlyItems.reduce((sum, item) => sum + parseInt(item.clpr), 0);
          const monthlyAverage = monthlyClprSum / monthlyItems.length;

          const { basDt, srtnCd, isinCd, itmsNm, mrktCtg } = monthlyItems[0];

          monthlyAverages.push({
            date: basDt,
            ...{ srtnCd, isinCd, itmsNm, mrktCtg },
            value: monthlyAverage.toFixed(2),
          });

          processedMonths.add(monthIdentifier);
        }
      }
    }
    data.items.item = monthlyAverages;
    return data;
  }

  static calculateYearlyAverage(data: FluctuatingIndicatorDto) {
    const items = data.items.item;
    const yearlyAverages = [];
    const processedYears = new Set();

    for (let i = 0; i < items.length; i++) {
      const currentDate = new Date(items[i].basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

      const yearlyItems = items.filter((item) => {
        const itemDate = new Date(item.basDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

        const isSameYear = currentDate.getFullYear() === itemDate.getFullYear();

        return isSameYear;
      });

      if (yearlyItems.length > 0) {
        const yearIdentifier = currentDate.getFullYear();

        if (!processedYears.has(yearIdentifier)) {
          const yearlyClprSum = yearlyItems.reduce((sum, item) => sum + parseInt(item.clpr), 0);
          const yearlyAverage = yearlyClprSum / yearlyItems.length;

          const { basDt, srtnCd, isinCd, itmsNm, mrktCtg } = yearlyItems[0];

          yearlyAverages.push({
            date: basDt,
            ...{ srtnCd, isinCd, itmsNm, mrktCtg },
            value: yearlyAverage.toFixed(2),
          });

          processedYears.add(yearIdentifier);
        }
      }
    }

    data.items.item = yearlyAverages;

    return data;
  }
}
