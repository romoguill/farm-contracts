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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import QuantityChart from './quantity-chart';
import ValueChart from './value-chart';

type DataType = 'quantity' | 'value';

function ChartDashboard() {
  const [selectedType, setSelectedType] = useState<DataType>('quantity');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: graphData } = useQuery({
    queryKey: ['contracts', selectedYear],
    queryFn: () => getContractsGraphData(selectedYear),
  });

  console.log(graphData);

  return (
    <div>
      <YearPicker
        defaultValue={new Date().getFullYear()}
        onChange={setSelectedYear}
      />
      <div className='relative border border-slate-200 rounded-xl'>
        <Select
          value={selectedType}
          onValueChange={(value: DataType) => setSelectedType(value)}
        >
          <SelectTrigger className='w-24 h-8 text-xs m-2 rounded-xl focus-visible:ring-transparent'>
            <SelectValue placeholder='Chart data' />
          </SelectTrigger>
          <SelectContent className='min-w-28'>
            <SelectItem value='quantity' className='text-xs'>
              Quantity
            </SelectItem>
            <SelectItem value='value' className='text-xs'>
              Value
            </SelectItem>
          </SelectContent>
        </Select>

        {selectedType === 'quantity' && <QuantityChart data={graphData} />}
        {selectedType === 'value' && <ValueChart data={graphData} />}
      </div>
    </div>
  );
}
export default ChartDashboard;
