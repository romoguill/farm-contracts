import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  className?: string;
}

function LoadingButton({
  isLoading,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={isLoading}
      className={cn('relative', className)}
    >
      <span className={isLoading ? 'invisible' : 'block'}>{children}</span>
      {isLoading && (
        <span className='absolute inset-0 grid place-items-center'>
          <Loader2 size={20} className='animate-spin' />
        </span>
      )}
    </Button>
  );
}
export default LoadingButton;
