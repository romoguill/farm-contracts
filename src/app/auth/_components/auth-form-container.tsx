import { PropsWithChildren } from 'react';
import OAuthGoogleButton from './oauth-google-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface AuthFormContainerProps extends PropsWithChildren {
  type: 'signup' | 'login';
}

function AuthFormContainer({ type, children }: AuthFormContainerProps) {
  return (
    <div className='grid place-items-center h-3/4 w-full'>
      <div className='w-full max-w-[350px] p-4 bg-background rounded-lg shadow-md'>
        <h2 className='text-2xl mb-3 font-semibold text-secondary'>
          {type === 'signup' ? 'Create user' : 'Welcome back!'}
        </h2>
        {children}
        {type === 'login' ? (
          <p className='text-[13px] mt-1'>
            Don&apos;t have an account?
            <Link
              href='/auth/signup'
              className='text-blue-500 underline ml-1 hover:text-blue-400'
            >
              Create one
            </Link>
          </p>
        ) : (
          <p className='text-[13px] mt-1'>
            Already have an account?
            <Link
              href='/auth/login'
              className='text-blue-500 underline ml-1 hover:text-blue-400'
            >
              Login
            </Link>
          </p>
        )}
        <div className='border-t border-gray-300 w-full my-6 relative'>
          <span className='absolute top-0 block -translate-y-1/2 text-center bg-background px-2 right-1/2 translate-x-1/2 -mt-[1px] text-gray-600 text-sm'>
            or
          </span>
        </div>

        <OAuthGoogleButton />
      </div>
    </div>
  );
}
export default AuthFormContainer;
