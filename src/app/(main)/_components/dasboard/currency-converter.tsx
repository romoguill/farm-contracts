'use client';

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

type CurrencyAPIResponse = {
  oficial: {
    value_avg: number;
    value_sell: number;
    value_buy: number;
  };
  blue: {
    value_avg: number;
    value_sell: number;
    value_buy: number;
  };
};

const CURRENCY_API_URL = 'https://api.bluelytics.com.ar/v2/latest';

const getCurrencyConversions = () =>
  fetch(CURRENCY_API_URL).then<CurrencyAPIResponse>((res) => res.json());

const CurrencyConverter = function CurrencyConverter() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['currency-conversions'],
    queryFn: getCurrencyConversions,
  });

  if (isPending) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <p className='text-muted-foreground'>Currency data is not available.</p>
    );
  }

  return (
    <div className='w-full md:min-w-[250px] md:w-2/6'>
      <Table className='bg-secondary/20'>
        <TableHeader className='bg-secondary/30'>
          <TableRow>
            <TableHead className='whitespace-nowrap w-1/3 sm:w-[120px] py-2 h-10'>
              Dolar type
            </TableHead>
            <TableHead className='py-2 h-10'>Buy</TableHead>
            <TableHead className='py-2 h-10'>Sell</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='p-2 px-4 h-10'>Official</TableCell>
            <TableCell className='p-2 px-4 h-10'>
              {data.oficial.value_buy}
            </TableCell>
            <TableCell className='p-2 px-4 h-10'>
              {data.oficial.value_sell}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='p-2 px-4 h-10'>Blue</TableCell>
            <TableCell className='p-2 px-4 h-10'>
              {data.blue.value_buy}
            </TableCell>
            <TableCell className='p-2 px-4 h-10'>
              {data.blue.value_sell}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

function LoadingSkeleton() {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-12' />
      <Skeleton className='h-12' />
      <Skeleton className='h-12' />
    </div>
  );
}

export default CurrencyConverter;
