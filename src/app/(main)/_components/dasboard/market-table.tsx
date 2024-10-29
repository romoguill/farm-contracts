'use client';

import { getMarketData } from '@/actions/market.actions';
import CustomLoader from '@/components/custom-loader';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';

function MarketTable() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['market-data'],
    queryFn: () => getMarketData(new Date()),
  });

  if (isPending) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <p className='text-muted-foreground'>Market data is not available.</p>
    );
  }

  const priceFormatter = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
    minimumFractionDigits: 2,
  });

  return (
    <div className='w-full md:min-w-[250px] md:w-2/6'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='whitespace-nowrap'>Crop</TableHead>
            <TableHead>Price ($USD/t)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.crop}>
              <TableCell className='capitalize'>
                {item.crop.toLowerCase()}
              </TableCell>
              <TableCell>{priceFormatter.format(item.price)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-12' />
      <Skeleton className='h-12' />
      <Skeleton className='h-12' />
    </div>
  );
}

export default MarketTable;
