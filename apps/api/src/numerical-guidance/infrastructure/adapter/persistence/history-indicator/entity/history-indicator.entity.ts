import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HistoryIndicatorValueEntity } from '../../history-indicator-value/entity/history-indicator-value.entity';
import { IndicatorType } from '../../../../../../commons/type/type-definition';

@Entity({ name: 'historyIndicator' })
export class HistoryIndicatorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: IndicatorType;

  @Column()
  ticker: string;

  @Column()
  exchange: string;

  @OneToMany(
    () => HistoryIndicatorValueEntity,
    (historyIndicatorValueEntity) => historyIndicatorValueEntity.historyIndicator,
  )
  values: HistoryIndicatorValueEntity[];
}
