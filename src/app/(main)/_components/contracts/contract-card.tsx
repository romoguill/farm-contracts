'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContractDetail } from '@/hooks/useContractDetail';
import {
  cn,
  formatCurrency,
  formatDateFromCalendar,
  getContractStatus,
} from '@/lib/utils';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import Link from 'next/link';

interface ContractCardProps {
  contractId: string;
}

function ContractCard({ contractId }: ContractCardProps) {
  const { data: contract, isError, isPending } = useContractDetail(contractId);

  if (isError || isPending || !contract) return null;

  const contractStatus = getContractStatus(
    contract.startDate,
    contract.endDate
  );

  return (
    <Card className='my-4'>
      <CardHeader className='pt-4 pb-3 flex-row justify-between items-center'>
        <CardTitle className='overflow-hidden whitespace-nowrap text-ellipsis w-2/5 py-1 text-lg md:text-xl'>
          {contract.title}
        </CardTitle>
        <Button size='icon' variant='link'>
          <Link href={`/contracts/${contract.id}`}>
            <SquareArrowOutUpRightIcon className='text-orange-700' />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ul>
          <li className='flex gap-4'>
            Status:
            <span
              className={cn('ml-auto font-semibold capitalize', {
                'text-blue-500': contractStatus === 'FINISHED',
                'text-purple-500': contractStatus === 'PENDING',
                'text-green-500': contractStatus === 'ONGOING',
              })}
            >
              {contractStatus.toLowerCase()}
            </span>
          </li>
          <li className='flex gap-4'>
            Tenant:
            <span className='ml-auto font-semibold'>
              {contract.tenant.name}
            </span>
          </li>
          <li className='flex gap-4'>
            Start date:
            <span className='ml-auto font-semibold'>
              {formatDateFromCalendar(contract.startDate)}
            </span>
          </li>
          <li className='flex gap-4'>
            End date:
            <span className='ml-auto font-semibold'>
              {formatDateFromCalendar(contract.endDate)}
            </span>
          </li>
          <li className='flex gap-4'>
            Parcels:
            <span className='ml-auto font-semibold'>
              {contract.parcels.reduce((list, parcel) => {
                if (contract.parcels.length <= 1) return parcel.label || '';
                if (list.length <= 1) return parcel.label || '';
                return `${list}, ${parcel.label}`;
              }, '')}
            </span>
          </li>
          <li className='flex gap-4'>
            Soy kgs/(hxm):
            <span className='ml-auto font-semibold'>{contract.soyKgs}</span>
          </li>
          <li className='flex gap-4'>
            Total value:
            <span className='ml-auto font-semibold'>
              {formatCurrency(contract.totalValue || 0)}
            </span>
          </li>
          <li className='flex gap-4'>
            Remaining value:
            <span className='ml-auto font-semibold'>
              {formatCurrency(contract.remainingValue || 0)}
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default ContractCard;
