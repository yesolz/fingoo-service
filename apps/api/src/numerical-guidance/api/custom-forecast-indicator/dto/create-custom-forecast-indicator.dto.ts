import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from 'src/commons/type/type-definition';
import { IsIndicatorType } from '../../../../commons/validation/is.indicator-type.validation';

export class CreateCustomForecatIndicatorDto {
  @ApiProperty({ example: '예측지표', description: '예측지표 이름' })
  @IsString()
  customForecastIndicatorName: string;

  @ApiProperty({ example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0', description: '목표지표 id' })
  @IsString()
  @IsUUID()
  targetIndicatorId: string;

  @ApiProperty({ example: 'stocks', description: '목표지표 type' })
  @IsString()
  @IsIndicatorType()
  targetIndicatorType: IndicatorType;
}
