import { Column, Entity } from 'typeorm';
import { BaseIndicatorEntity } from './base-indicator.entity';
import { IndicatorType } from '../../../../../../commons/type/type-definition';

@Entity({ name: 'funds' })
export class FundEntity extends BaseIndicatorEntity {
  @Column({ default: 'funds' })
  indicatorType: IndicatorType;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  currency: string;

  @Column()
  exchange: string;

  @Column()
  type: string;
}
