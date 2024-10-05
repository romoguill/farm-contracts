import { getContractsGraphData } from '@/actions/contracts.actions';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

interface ValueChartProps {
  data: Awaited<ReturnType<typeof getContractsGraphData>> | undefined;
}

function ValueChart({ data }: ValueChartProps) {
  console.log(data);
  const chartConfig = {
    contractsValue: {
      label: 'Value',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
      <LineChart accessibilityLayer data={data}>
        <XAxis
          dataKey='month'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className='capitalize'
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <CartesianGrid vertical={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey='contractsValue'
          fill='var(--color-desktop)'
          type='monotone'
        />
      </LineChart>
    </ChartContainer>
  );
}
export default ValueChart;
