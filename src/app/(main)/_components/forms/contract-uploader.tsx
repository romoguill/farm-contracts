'use client';

import { useRef, useState } from 'react';
import PDFsPreview from './pdfs-preview';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ContractUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

function ContractUploader({ onChange, files }: ContractUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // At least chrome doesn't handle correctly the input accept prop. Handle it here
  const isValidFileType = (files: File[]) => {
    console.log(files);
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
  };

  return (
    <>
      {files.length < 3 && (
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
            ref={inputRef}
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
              onClick={() => inputRef.current?.click()}
            >
              choose from your device
            </span>
          </p>
          <span className='text-sm text-muted-foreground italic mt-1'>
            Max 3 files, 1.5MB each.
          </span>
        </div>
      )}
      {files && <PDFsPreview files={files} onRemove={onChange} />}
    </>
  );
}
export default ContractUploader;
