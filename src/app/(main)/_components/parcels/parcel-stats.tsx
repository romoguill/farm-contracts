'use client';

import {
  getAverageValueContract,
  getBestValueContract,
  getLastContractForParcel,
} from '@/actions/contracts.actions';
import CustomLoader from '@/components/custom-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Parcel } from '@/db/schema';
import { useQuery } from '@tanstack/react-query';

interface ParcelStatsProps {
  parcel: Parcel;
}

function ParcelStats({ parcel }: ParcelStatsProps) {
  const { data: lastContract, isPending: isPendingLastContract } = useQuery({
    queryKey: ['lastContractOfParcel', parcel.id],
    queryFn: () => getLastContractForParcel(parcel.id),
  });

  const { data: bestValue, isPending: isPendingBestValue } = useQuery({
    queryKey: ['bestValue', parcel.id],
    queryFn: () => getBestValueContract(parcel.id),
  });

  const { data: avgValue, isPending: isPendingAvgValue } = useQuery({
    queryKey: ['avgValue', parcel.id],
    queryFn: () => getAverageValueContract(parcel.id),
  });

  const kgsFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });

  if (isPendingLastContract || isPendingBestValue || isPendingAvgValue) {
    return <CustomLoader className='mt-8' />;
  }

  return (
    <Card className='border mt-5 border-slate-300 shadow-md rounded-2xl p-3 w-[350px] col-start-2 justify-self-end'>
      <CardHeader className='text-lg p-4'>
        <CardTitle>{`Parcel ${parcel.label} Summary`}</CardTitle>
      </CardHeader>
      <CardContent className='p-4'>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className='font-semibold'>Area</TableCell>
              <TableCell>{kgsFormatter.format(Number(parcel.area))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Last contract</TableCell>
              <TableCell>{lastContract?.contractName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Best value</TableCell>
              <TableCell>
                {kgsFormatter.format(bestValue?.contractSoyKgs || 0)} kgs/ha
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Average value</TableCell>
              <TableCell>
                {kgsFormatter.format(Number(avgValue?.contractSoyKgs) || 0)}{' '}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ParcelStats;
