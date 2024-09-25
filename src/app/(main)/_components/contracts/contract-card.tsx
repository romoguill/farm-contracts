'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContractDetail } from '@/hooks/useContractDetail';
import {
  cn,
  formatCurrency,
  formatDateFromCalendar,
  getContractStatus,
} from '@/lib/utils';

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
    <Card>
      <CardHeader>
        <CardTitle>Contract</CardTitle>
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
