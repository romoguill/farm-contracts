import { PropsWithChildren } from 'react';
import OAuthGoogleButton from './oauth-google-button';

interface AuthFormContainerProps extends PropsWithChildren {
  type: 'signup' | 'login';
}

function AuthFormContainer({ type, children }: AuthFormContainerProps) {
  return (
    <div className='grid place-items-center h-3/4 w-full'>
      <div className='w-full max-w-[350px] p-4 bg-background rounded-lg shadow-md'>
        <h1 className='font-bold text-xl mb-3 bg-gradient-to-r from-sky-300 to-sky-50 w-fit ml-auto p-2 rounded-s-2xl'>
          Farm Contracts
        </h1>
        <h2 className='text-2xl mb-2'>
          {type === 'signup' ? 'Create user' : 'Welcome back!'}
        </h2>
        {children}
        <div className='border-t border-gray-300 w-full my-4 relative'>
          <span className='absolute top-0 block -translate-y-1/2 text-center bg-white px-2 right-1/2 translate-x-1/2 -mt-[1px] text-gray-600 text-sm'>
            or
          </span>
        </div>

        <OAuthGoogleButton />
      </div>
    </div>
  );
}
export default AuthFormContainer;
