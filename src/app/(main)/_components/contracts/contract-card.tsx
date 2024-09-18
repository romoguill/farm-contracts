'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContractDetail } from '@/hooks/useContractDetail';
import { formatDateFromCalendar } from '@/lib/utils';

interface ContractCardProps {
  contractId: string;
}

function ContractCard({ contractId }: ContractCardProps) {
  const { data: contract, isError, isPending } = useContractDetail(contractId);

  if (isError || isPending || !contract) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          <li className='flex gap-4'>
            Start date:
            <span className='ml-auto'>
              {formatDateFromCalendar(contract.startDate)}
            </span>
          </li>
          <li className='flex gap-4'>
            End date:
            <span className='ml-auto'>
              {formatDateFromCalendar(contract.endDate)}
            </span>
          </li>
          <li className='flex gap-4'>
            Soy kgs/(hxm):
            <span className='ml-auto'>{contract.soyKgs}</span>
          </li>
          <li className='flex gap-4'>
            Total value:
            <span className='ml-auto'>{contract.totalValue}</span>
          </li>
          <li className='flex gap-4'>
            Remaining value:
            <span className='ml-auto'>{contract.remainingValue}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default ContractCard;
