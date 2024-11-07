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
import { Montserrat } from 'next/font/google';
import Link from 'next/link';

const font = Montserrat({ subsets: ['latin'] });

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
    <Card
      className={cn('my-4 max-w-md mx-auto overflow-hidden', font.className)}
    >
      <CardHeader className='relative py-2 flex-row justify-between items-center bg-muted space-y-0 h-12'>
        <CardTitle className='overflow-hidden whitespace-nowrap text-ellipsis w-2/5 py-1 text-lg text-muted-foreground md:text-xl'>
          {contract.title}
        </CardTitle>
        <Button size='icon' variant='link' className='h-6'>
          <Link href={`/contracts/${contract.id}`}>
            <SquareArrowOutUpRightIcon className='text-secondary' />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className='py-2'>
        <ul>
          <li className='flex gap-4 text-sm items-center'>
            Status:
            <span
              className={cn('ml-auto font-semibold capitalize text-base', {
                'text-blue-500': contractStatus === 'FINISHED',
                'text-purple-500': contractStatus === 'PENDING',
                'text-green-500': contractStatus === 'ONGOING',
              })}
            >
              {contractStatus.toLowerCase()}
            </span>
          </li>
          <li className='flex gap-4 text-sm items-center'>
            Tenant:
            <span className='ml-auto font-semibold text-base'>
              {contract.tenant.name}
            </span>
          </li>
          <li className='flex gap-4 text-sm items-center'>
            Start date:
            <span className='ml-auto font-semibold text-base'>
              {formatDateFromCalendar(contract.startDate)}
            </span>
          </li>
          <li className='flex gap-4 text-sm items-center'>
            End date:
            <span className='ml-auto font-semibold text-base'>
              {formatDateFromCalendar(contract.endDate)}
            </span>
          </li>
          <li className='flex gap-4 text-sm items-center'>
            Parcels:
            <span className='ml-auto font-semibold text-base'>
              {contract.parcels.reduce((list, parcel) => {
                if (contract.parcels.length <= 1) return parcel.label || '';
                if (list.length <= 1) return parcel.label || '';
                return `${list}, ${parcel.label}`;
              }, '')}
            </span>
          </li>
          <li className='flex gap-4 text-sm items-center'>
            Soy kgs/(hxm):
            <span className='ml-auto font-semibold text-base'>
              {contract.soyKgs}
            </span>
          </li>
          <li className='flex gap-4 text-sm items-center'>
            Total value:
            <span className='ml-auto font-semibold text-base'>
              {formatCurrency(contract.totalValue || 0)}
            </span>
          </li>
          <li className='flex gap-4 text-sm items-center'>
            Remaining value:
            <span className='ml-auto font-semibold text-base'>
              {formatCurrency(contract.remainingValue || 0)}
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default ContractCard;
