import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiExceptionResponse } from '../../../commons/exception-filter/api-exception-response.decorator';
import { CreateCustomForecatIndicatorDto } from './dto/create-custom-forecast-indicator.dto';
import { LoginUser } from '../../../user/util/login-user.decorator';
import { CreateCustomForecastIndicatorCommand } from '../../application/command/custom-forecast-indicator/create-custom-forecast-indicator/create-custom-forecast-indicator.command';
import { CustomForecastIndicator } from '../../domain/custom-forecast-indicator';
import { GetCustomForecastIndicatorQuery } from '../../application/query/custom-forecast-indicator/get-custom-forecast-indicator/get-custom-forecast-indicator.query';
import { GetCustomForecastIndicatorsByMemberIdQuery } from '../../application/query/custom-forecast-indicator/get-custom-forecast-indicators-by-member-id/get-custom-forecast-indicators-by-member-id.query';
import { UpdateSourceIndicatorsInformationDto } from './dto/update-source-indicators-information.dto';
import { UpdateSourceIndicatorsInformationCommand } from '../../application/command/custom-forecast-indicator/update-source-indicators-and-weights/update-source-indicators-informations.command';
import { CustomForecastIndicatorValuesResponse } from '../../../commons/type/type-definition';
import { GetCustomForecastIndicatorValuesQuery } from '../../application/query/custom-forecast-indicator/get-custom-forecast-indicator-values/get-custom-forecast-indicator-values.query';
import { DeleteCustomForecastIndicatorCommand } from 'src/numerical-guidance/application/command/custom-forecast-indicator/delete-custom-forecast-indicator/delete-custom-forecast-indicator.command';
import { UpdateCustomForecastIndicatorNameDto } from './dto/update-custom-forecast-indicator-name.dto';
import { UpdateCustomForecastIndicatorNameCommand } from 'src/numerical-guidance/application/command/custom-forecast-indicator/update-custom-forecast-indicator-name/update-custom-forecast-indicator-name.command';
import { User } from '@supabase/supabase-js';

@ApiTags('CustomForecastIndicatorController')
@Controller('/api/numerical-guidance')
export class CustomForecastIndicatorController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: '예측지표를 생성합니다.' })
  @ApiCreatedResponse({
    description: '예측지표 생성 성공 및 예측지표 id 리턴',
    type: '008628f5-4dbd-4c3b-b793-ca0fa22b3cfa',
  })
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측지표의 이름은 비워둘 수 없습니다.',
  )
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 예측지표를 생성하는 중 예상치 못한 문제가 발생했습니다.`,
  )
  @ApiBearerAuth('Authorization')
  @Post('/custom-forecast-indicator')
  async createCustomForecastIndicator(
    @Body() createCustomForecastIndicatorDto: CreateCustomForecatIndicatorDto,
    @LoginUser() user: User,
  ): Promise<string> {
    const command = new CreateCustomForecastIndicatorCommand(
      createCustomForecastIndicatorDto.customForecastIndicatorName,
      createCustomForecastIndicatorDto.targetIndicatorId,
      createCustomForecastIndicatorDto.targetIndicatorType,
      user.id,
    );
    return await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '예측지표 id로 예측지표를 불러옵니다.' })
  @ApiOkResponse({ type: CustomForecastIndicator })
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 예측지표를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 예측지표를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 예측지표를 불러오는 중 예상치 못한 문제가 발생했습니다.`,
  )
  @ApiParam({
    name: 'customForecastIndicatorId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @ApiBearerAuth('Authorization')
  @Get('/custom-forecast-indicator/:customForecastIndicatorId')
  async loadCustomForecastIndicator(
    @Param('customForecastIndicatorId') customForecastIndicatorId,
  ): Promise<CustomForecastIndicator> {
    const query = new GetCustomForecastIndicatorQuery(customForecastIndicatorId);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '사용자 id로 예측지표 리스트를 불러옵니다.' })
  @ApiOkResponse({ type: [CustomForecastIndicator] })
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 예측지표를 불러오는 중 예상치 못한 문제가 발생했습니다.`,
  )
  @ApiBearerAuth('Authorization')
  @Get('/custom-forecast-indicator')
  async loadCustomForecastIndicatorsByMemberId(@LoginUser() user: User): Promise<CustomForecastIndicator[]> {
    const query = new GetCustomForecastIndicatorsByMemberIdQuery(user.id);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '재료지표를 업데이트합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측지표를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 재료지표를 업데이트하는 도중에 예상치 못한 문제가 발생했습니다.`,
  )
  @ApiParam({
    name: 'customForecastIndicatorId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @ApiBearerAuth('Authorization')
  @Patch('/custom-forecast-indicator/:customForecastIndicatorId')
  async updateSourceIndicatorsInformation(
    @Param('customForecastIndicatorId') customForecastIndicatorId,
    @Body() updateSourceIndicatorsAndWeightsDto: UpdateSourceIndicatorsInformationDto,
  ) {
    const command = new UpdateSourceIndicatorsInformationCommand(
      customForecastIndicatorId,
      updateSourceIndicatorsAndWeightsDto.sourceIndicatorsInformation,
    );
    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '예측지표 id로 예측값을 불러옵니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측값을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측값을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 예측값을 불러오는 중 예상치 못한 문제가 발생했습니다.`,
  )
  @ApiParam({
    name: 'customForecastIndicatorId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @ApiBearerAuth('Authorization')
  @Get('/custom-forecast-indicator/value/:customForecastIndicatorId')
  async loadCustomForecastIndicatorValues(
    @Param('customForecastIndicatorId') customForecastIndicatorId,
  ): Promise<CustomForecastIndicatorValuesResponse> {
    const query = new GetCustomForecastIndicatorValuesQuery(customForecastIndicatorId);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '예측지표를 삭제합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    `[ERROR] 예측지표를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] customForecastIndicatorId: ${id} 해당 예측지표를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측지표를 삭제하는 도중에 예상치 못한 문제가 발생했습니다.',
  )
  @ApiParam({
    name: 'customForecastIndicatorId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @ApiBearerAuth('Authorization')
  @Delete('/custom-forecast-indicator/:customForecastIndicatorId')
  async deleteCustomForecastIndicator(@Param('customForecastIndicatorId') customForecastIndicatorId): Promise<void> {
    const command = new DeleteCustomForecastIndicatorCommand(customForecastIndicatorId);
    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '예측지표의 이름을 수정합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 예측지표의 이름을 수정하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] customForecastIndicatorId: ${id} 해당 예측지표를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측지표의 이름을 수정하는 중에 예상치 못한 문제가 발생했습니다.',
  )
  @ApiParam({
    name: 'customForecastIndicatorId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @ApiBearerAuth('Authorization')
  @Patch('/custom-forecast-indicator/name/:customForecastIndicatorId')
  async updateCustomForecastIndicatorName(
    @Param('customForecastIndicatorId') customForecastIndicatorId,
    @Body() updateCustomForecastIndicatorNameDto: UpdateCustomForecastIndicatorNameDto,
  ) {
    const command = new UpdateCustomForecastIndicatorNameCommand(
      customForecastIndicatorId,
      updateCustomForecastIndicatorNameDto.name,
    );

    await this.commandBus.execute(command);
  }
}
