'use client';

import { getContractsForDashboard } from '@/actions/contracts.actions';
import CustomLoader from '@/components/custom-loader';
import { useQuery } from '@tanstack/react-query';

function ContractsVisualizer() {
  const {
    data: contracts,
    isPending,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () =>
      getContractsForDashboard().catch((e) => {
        throw e;
      }),
  });

  if (isPending) {
    return <CustomLoader />;
  }

  if (isError) {
    return <p>There was an error. Please try again later</p>;
  }
  // if (!isSuccess) {
  //   return;
  // }

  return (
    <div>
      <ul>
        {contracts.map((contract) => (
          <li key={contract.id}>{contract.id}</li>
        ))}
      </ul>
    </div>
  );
}
export default ContractsVisualizer;
