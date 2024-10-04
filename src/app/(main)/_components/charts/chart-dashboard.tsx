'use client';

import { getContractsGraphData } from '@/actions/contracts.actions';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import YearPicker from './year-picker';

function ChartDashboard() {
  const { data: graphData } = useQuery({
    queryKey: ['contracts', 2024],
    queryFn: () => getContractsGraphData(2024),
  });

  // const chartData = [
  //   { month: 'January', desktop: 186, mobile: 80 },
  //   { month: 'February', desktop: 305, mobile: 200 },
  //   { month: 'March', desktop: 237, mobile: 120 },
  //   { month: 'April', desktop: 73, mobile: 190 },
  //   { month: 'May', desktop: 209, mobile: 130 },
  //   { month: 'June', desktop: 214, mobile: 140 },
  // ];

  const chartConfig = {
    contractsCount: {
      label: 'Quantity',
      color: '#2563eb',
    },
    contractsValue: {
      label: 'Value',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  console.log(graphData);

  return (
    <div>
      <YearPicker />
      <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
        <BarChart accessibilityLayer data={graphData}>
          <XAxis
            dataKey='month'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <CartesianGrid vertical={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey='contractsCount'
            fill='var(--color-desktop)'
            radius={4}
          />
          <Bar dataKey='contractsValue' fill='var(--color-mobile)' radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
export default ChartDashboard;
