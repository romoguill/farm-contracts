import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileTextIcon, X } from 'lucide-react';
import { useMemo } from 'react';

interface FileParsed {
  id: string;
  url: string;
  file: File;
}

interface PDFsPreviewProps {
  files: File[];
  onRemove: (files: File[]) => void;
  disabled?: boolean;
}

function PDFsPreview({ files, onRemove, disabled = false }: PDFsPreviewProps) {
  const filesParsed: FileParsed[] = useMemo(() => {
    return files.map((file) => ({
      file,
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  const handleOnRemoveClick = (file: FileParsed) => {
    onRemove(
      filesParsed.filter((fp) => fp.id !== file.id).map((fp) => fp.file)
    );
  };

  if (window.navigator.pdfViewerEnabled) {
    return (
      <div className='flex flex-col md:grid md:grid-cols-2 gap-3'>
        {filesParsed.map((fileP) => (
          <ul key={fileP.id}>
            <li>
              <div className='flex items-center gap-2'>
                <FileTextIcon size={24} className='flex-shrink-0' />
                <h5 className='text-sm text-ellipsis min-w-0 whitespace-nowrap overflow-hidden'>
                  {fileP.file.name}
                </h5>
                {!disabled && (
                  <Button
                    className='ml-auto text-red-500'
                    variant='link'
                    onClick={() => handleOnRemoveClick(fileP)}
                  >
                    <X size={16} />
                    Remove
                  </Button>
                )}
              </div>
              <object
                className='w-full'
                type='application/pdf'
                data={fileP.url}
              >
                {/* <embed src={file.url} type='application/pdf' /> */}
              </object>
            </li>
          </ul>
        ))}
      </div>
    );
  }

  return (
    <div>
      {filesParsed.map((fileP) => (
        <ul key={fileP.id}>
          <li>
            <div
              className={cn('flex items-center gap-2', {
                'opacity-80': disabled,
              })}
            >
              <FileTextIcon size={24} className='flex-shrink-0' />
              <h5 className='text-sm text-ellipsis min-w-0 whitespace-nowrap overflow-hidden'>
                {fileP.file.name}
              </h5>
              {!disabled && (
                <Button
                  className='ml-auto text-red-500'
                  variant='link'
                  onClick={() => handleOnRemoveClick(fileP)}
                >
                  <X size={16} />
                  Remove
                </Button>
              )}
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
}
export default PDFsPreview;
