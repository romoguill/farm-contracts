'use client';

import { useRef, useState } from 'react';
import PDFsPreview from './pdfs-preview';

interface ContractUploaderProps {
  files: File[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ContractUploader({ onChange, files }: ContractUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<File[] | null>(null);
  return (
    <>
      <div className='w-full h-20 border-2 border-dashed border-input flex flex-col items-center justify-center'>
        <input
          ref={inputRef}
          type='file'
          accept='.pdf'
          className='hidden'
          aria-label='Choose PDFs files'
          onChange={onChange}
          multiple
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
      {files && <PDFsPreview files={files} />}
    </>
  );
}
export default ContractUploader;
