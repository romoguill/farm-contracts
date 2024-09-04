import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CustomLoaderProps {
  className?: string;
  size?: 'sm' | 'lg';
}

function CustomLoader({ className, size = 'sm' }: CustomLoaderProps) {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <Loader2
        size={size === 'lg' ? 50 : 22}
        className={cn(
          'animate-spin block mx-auto',

          className
        )}
      />
    </div>
  );
}
export default CustomLoader;
