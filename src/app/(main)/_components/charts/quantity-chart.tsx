import { getContractsGraphData } from '@/actions/contracts.actions';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface QuantityChartProps {
  data: Awaited<ReturnType<typeof getContractsGraphData>> | undefined;
}

function QuantityChart({ data }: QuantityChartProps) {
  const chartConfig = {
    contractsCount: {
      label: 'Quantity',
      color: '#2563eb',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className='h-[300px] w-full aspect-auto'
    >
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey='month'
          tickMargin={10}
          className='capitalize'
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <YAxis allowDecimals={false} />
        <CartesianGrid vertical={false} strokeDasharray='3 2' stroke='#aaa' />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey='contractsCount'
          fill='rgba(41,61,41,1)'
          radius={4}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  );
}
export default QuantityChart;
