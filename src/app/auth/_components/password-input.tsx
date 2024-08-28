import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { useState } from 'react';

interface PasswordInputProps extends InputProps {
  isVisible: boolean;
  confirmation?: boolean;
  onChangeVisibility: (visible: boolean) => void;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ isVisible, confirmation, onChangeVisibility, ...props }, ref) => {
    return (
      <div className='relative'>
        <Input ref={ref} {...props} type={isVisible ? 'text' : 'password'} />
        {!confirmation &&
          (isVisible ? (
            <Button
              className='absolute right-3 top-1/2 -translate-y-[50%] h-8 text-neutral-500 hover:bg-inherit hover:text-neutral-600'
              size='icon'
              variant='ghost'
              type='button'
              onClick={() => onChangeVisibility(!isVisible)}
            >
              <EyeOff size={22} />
            </Button>
          ) : (
            <Button
              className='absolute right-3 top-1/2 -translate-y-[50%] h-8 text-neutral-500 hover:bg-inherit hover:text-neutral-600'
              size='icon'
              variant='ghost'
              type='button'
              onClick={() => onChangeVisibility(!isVisible)}
            >
              <Eye size={22} />
            </Button>
          ))}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
