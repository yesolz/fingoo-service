import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { LiveKRXIndicatorDto } from '../../application/query/live-indicator/dto/live-indicator.dto';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { GetLiveKrxIndicatorDto } from './dto/get-live-krx-indicator.dto';
import { GetLiveIndicatorQuery } from '../../application/query/live-indicator/get-live-indicator/get-live-indicator.query';

@ApiTags('LiveIndicatorController')
@Controller('/api/numerical-guidance')
export class LiveIndicatorController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: 'Live 국내 지표(KRX)를 불러옵니다.' })
  @ApiOkResponse({ type: LiveKRXIndicatorDto })
  @ApiExceptionResponse(
    400,
    '입력값이 올바른지 확인해주세요. 지표는 day, week, month, year 별로 확인 가능합니다.',
    '[ERROR] 잘못된 요청값입니다. indicatorId, interval이 올바른지 확인해주세요.',
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] API response body 값을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다.',
    '[ERROR] KRX API 요청 과정에서 예상치 못한 오류가 발생했습니다.',
  )
  @Get('/indicators/live/krx')
  async getKRXLiveIndicator(@Query() getLiveIndicatorDto: GetLiveKrxIndicatorDto): Promise<LiveKRXIndicatorDto> {
    const query = new GetLiveIndicatorQuery(getLiveIndicatorDto.indicatorId, getLiveIndicatorDto.interval);
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: 'Live Fred 지표를 불러옵니다.' })
  @ApiOkResponse({ type: LiveKRXIndicatorDto })
  @ApiExceptionResponse(400, '', '')
  @ApiExceptionResponse(404, '', '')
  @ApiExceptionResponse(500, '', '')
  @Get('/indicators/live/fred')
  async getLiveIndicator(@Query() getLiveIndicatorDto: GetLiveKrxIndicatorDto): Promise<LiveKRXIndicatorDto> {
    const query = new GetLiveIndicatorQuery(getLiveIndicatorDto.indicatorId, getLiveIndicatorDto.interval);
    return this.queryBus.execute(query);
  }
}
