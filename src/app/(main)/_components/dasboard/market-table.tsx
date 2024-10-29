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
      <Table className='bg-secondary/20'>
        <TableHeader className='bg-secondary/30'>
          <TableRow>
            <TableHead className='whitespace-nowrap w-1/3 sm:w-[120px] py-2 h-10'>
              Crop
            </TableHead>
            <TableHead className='py-2 h-8'>Price ($USD/t)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.crop}>
              <TableCell className='capitalize p-2 px-4 h-10'>
                {item.crop.toLowerCase()}
              </TableCell>
              <TableCell className='p-2 px-4 h-10'>
                {priceFormatter.format(item.price)}
              </TableCell>
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
