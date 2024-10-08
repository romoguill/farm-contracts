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
    <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey='month'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className='capitalize'
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <CartesianGrid vertical={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey='contractsCount'
          fill='var(--color-desktop)'
          radius={4}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  );
}
export default QuantityChart;
