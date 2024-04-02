'use client';
import { EventProps } from '@tremor/react';
import LineChart from './line-chart';
import { useState } from 'react';
import { ChartTooltip } from './chart-tooltip';
import { FormattedRowType, FormattedIndicatorValue } from '@/app/business/services/chart/indicator-formatter.service';
import { cn } from '@/app/utils/style';

type MultiLineChartProps = {
  data: FormattedRowType[];
  categories: string[];
  syncId?: string;
  noDataText?: string;
  className?: string;
};

export default function MultiLineChart({ data, categories, noDataText, syncId, className }: MultiLineChartProps) {
  const [value, setValue] = useState<EventProps>(null);
  const index = 'date';

  const formatteedData = formmatData(data, categories);
  return (
    <>
      <LineChart
        syncId={syncId}
        className={cn('h-full', className)}
        data={formatteedData}
        index={index}
        categories={categories}
        colors={['indigo-300', 'rose-200', 'fuchsia-300', 'indigo-300', 'blue-300']}
        yAxisWidth={60}
        onValueChange={(v) => setValue(v)}
        showAnimation={true}
        animationDuration={600}
        autoMinValue={true}
        enableLegendSlider={true}
        curveType={'linear'}
        noDataText={noDataText}
        customTooltip={ChartTooltip}
        tickGap={50}
      />
    </>
  );
}

function caculateChartValueFactory(categories: string[]) {
  if (categories.length === 1) {
    return (data: FormattedIndicatorValue) => data.displayValue;
  }

  return (data: FormattedIndicatorValue) => data.value;
}

function formmatData(data: FormattedRowType[], categories: string[]) {
  const caculateChartValue = caculateChartValueFactory(categories);

  return data.map((d) => {
    return {
      ...Object.keys(d).reduce((acc, key) => {
        if (key === 'date') {
          return { ...acc, [key]: d[key] };
        }
        return {
          ...acc,
          [key]: caculateChartValue(
            d[key] as {
              value: number;
              displayValue: number;
            },
          ),
        };
      }, {}),
      displayValue: Object.keys(d).reduce((acc, key) => {
        if (key === 'date') {
          return { ...acc, [key]: d[key] };
        }
        return {
          ...acc,
          [key]: (
            d[key] as {
              value: number;
              displayValue: number;
            }
          ).displayValue,
        };
      }, {}),
    };
  });
}
