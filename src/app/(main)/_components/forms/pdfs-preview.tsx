import { useMemo } from 'react';

interface PDFsPreviewProps {
  files: File[];
}

function PDFsPreview({ files }: PDFsPreviewProps) {
  console.log(files);
  const fileHandler = useMemo(() => {
    return files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
  }, [files]);

  console.log(window.navigator.pdfViewerEnabled);
  console.log(fileHandler);

  if (window.navigator.pdfViewerEnabled) {
    return (
      <div className='grid grid-cols-4'>
        {fileHandler.map((file) => (
          <object key={file.name} type='application/pdf' data={file.url}>
            <embed
              src={file.url}
              width={800}
              height={800}
              type='application/pdf'
            />
          </object>
        ))}
      </div>
    );
  }
}
export default PDFsPreview;
