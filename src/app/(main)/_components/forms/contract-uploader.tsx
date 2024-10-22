'use client';

import { cn } from '@/lib/utils';
import {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import PDFsPreview from './pdfs-preview';

interface ContractUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

const ContractUploader = forwardRef<HTMLInputElement, ContractUploaderProps>(
  ({ onChange, files, disabled = false }, forwardedRef) => {
    const ref = useRef<HTMLInputElement>(null);

    useImperativeHandle(forwardedRef, () => ref.current as HTMLInputElement);

    const [isDragging, setIsDragging] = useState(false);

    // At least chrome doesn't handle correctly the input accept prop. Handle it here
    const isValidFileType = (files: File[]) => {
      return files.every((file) => file.type === 'application/pdf');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isValidFileType(Array.from(e.target.files ?? []))) {
        toast.error('Files must be PDFs');
        return;
      }

      onChange([...files, ...Array.from(e.target.files ?? [])]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (!isValidFileType(droppedFiles)) {
        toast.error('Files must be PDFs');
        setIsDragging(false);
        return;
      }

      onChange([...files, ...droppedFiles]);
      setIsDragging(false);
    };

    return (
      <>
        {!disabled && files.length < 3 && (
          <div
            className={cn(
              'w-full h-28 border-2 border-dashed border-input flex flex-col items-center justify-center',
              {
                'border-4 border-blue-500': isDragging,
              }
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={ref}
              type='file'
              accept='application/pdf'
              className='hidden'
              aria-label='Choose PDFs files'
              multiple
              onChange={handleInputChange}
            />
            <p>
              Drag PDF files or{' '}
              <span
                className='text-blue-600 cursor-pointer underline'
                onClick={() => ref?.current?.click()}
              >
                choose from your device
              </span>
            </p>
            <span className='text-sm text-muted-foreground italic mt-1'>
              Max 3 files, 1.5MB each.
            </span>
          </div>
        )}
        {files && (
          <PDFsPreview
            disabled={disabled}
            files={files}
            onRemove={(files) => {
              // Need to reset the input. Edge case can happen when user removes a file and tries to upload it again. Since the html input still has that value, on change event doesn't trigger
              if (ref.current?.files) {
                ref.current.value = '';
              }
              onChange(files);
            }}
          />
        )}
      </>
    );
  }
);

ContractUploader.displayName = 'ContractUploader';

export default ContractUploader;
