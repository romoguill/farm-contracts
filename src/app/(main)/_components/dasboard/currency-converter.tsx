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

  console.log(isPending);

  if (isPending) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <p className='text-muted-foreground'>Currency data is not available.</p>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dolar type</TableHead>
            <TableHead>Buy</TableHead>
            <TableHead>Sell</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Official</TableCell>
            <TableCell>{data.oficial.value_buy}</TableCell>
            <TableCell>{data.oficial.value_sell}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Blue</TableCell>
            <TableCell>{data.blue.value_buy}</TableCell>
            <TableCell>{data.blue.value_sell}</TableCell>
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
