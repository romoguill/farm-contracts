import { PropsWithChildren } from 'react';

function SubmitError({ message }: { message: string }) {
  return <p className='text-sm font-medium text-destructive'>{message}</p>;
}
export default SubmitError;
