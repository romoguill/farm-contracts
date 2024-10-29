import { getContractsGraphData } from '@/actions/contracts.actions';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface ValueChartProps {
  data: Awaited<ReturnType<typeof getContractsGraphData>> | undefined;
}

function ValueChart({ data }: ValueChartProps) {
  const chartConfig = {
    contractsValue: {
      label: 'Value',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  const formatedData = useMemo(
    () =>
      data?.map((item) => ({
        ...item,
        contractsValue: item.contractsValue / 1000,
      })),
    [data]
  );

  return (
    <ChartContainer
      config={chartConfig}
      className='h-[300px] w-full aspect-auto'
    >
      <LineChart accessibilityLayer data={formatedData}>
        <XAxis
          dataKey='month'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className='capitalize'
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <YAxis label={{ value: '$K', position: 'insideTopLeft' }} width={80} />
        <CartesianGrid vertical={false} strokeDasharray='3 2' stroke='#aaa' />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey='contractsValue'
          fill='var(--color-desktop)'
          type='monotone'
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
export default ValueChart;
