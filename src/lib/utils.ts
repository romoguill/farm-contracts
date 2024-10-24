import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ContractStatus } from './validation';
import { FileWithUrl } from '@/actions/contracts.actions';

export const MAX_CONTRACT_PDF_SIZE = 1500 * 1000; // 1.5 MB

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateFromCalendar(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatCurrency(value: number) {
  const formatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(value);
}

export function getRgbString(rgb: string[], a: string = '1') {
  return `rgba(${rgb.join(',')},${a})`;
}

export function createFormData(
  obj: Record<string, any>,
  form?: FormData,
  namespace?: string
): FormData {
  const formData = form || new FormData();

  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      const formKey = namespace ? `${namespace}[${property}]` : property;

      if (obj[property] instanceof File) {
        formData.append(formKey, obj[property]);
      } else if (Array.isArray(obj[property])) {
        obj[property].forEach((element, index) => {
          const arrayKey = `${formKey}[${index}]`;
          if (element instanceof File) {
            formData.append(arrayKey, element);
          } else {
            createFormData({ [arrayKey]: element }, formData);
          }
        });
      } else if (typeof obj[property] === 'object' && obj[property] !== null) {
        createFormData(obj[property], formData, formKey);
      } else {
        formData.append(formKey, obj[property]);
      }
    }
  }

  return formData;
}

export function calculateAvailableYears(firstYear: number | undefined) {
  if (firstYear === undefined) return [];

  const years: number[] = [];
  const currentYear = new Date(Date.now()).getFullYear();

  for (let i = 0; i <= currentYear - firstYear; i++) {
    years.push(currentYear - i);
  }

  return years;
}

export function getContractStatus(
  startDate: Date,
  endDate: Date
): ContractStatus {
  const today = new Date(Date.now());

  if (endDate < today) return 'FINISHED';
  if (startDate > today) return 'PENDING';

  return 'ONGOING';
}

export function formatDatesForGraph(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
}

export async function convertFileUrlToObject(file: FileWithUrl) {
  if (!file.id || !file.s3Id) return;

  try {
    const response = await fetch(file.url);
    const blob = await response.blob();

    return new FileDB(file.id, file.s3Id, file.url, [blob], file.name, {
      type: 'application/pdf',
    });
  } catch (error) {
    console.error(error);
  }
}

// Since input file recreates the file references, I'll check every property and infer wich files have been modified.
export function areFilesEqual(f1: File, f2: File) {
  const keys: Array<keyof File> = ['name', 'size', 'type', 'lastModified'];

  for (const key of keys) {
    if (f1[key] !== f2[key]) {
      return false;
    }
  }

  return true;
}

export class FileDB extends File {
  readonly dbId: string;
  readonly s3Id: string;
  readonly url: string;

  constructor(
    dbId: string,
    s3Id: string,
    url: string,
    fileBits: BlobPart[],
    fileName: string,
    options?: FilePropertyBag
  ) {
    super(fileBits, fileName, options);
    this.dbId = dbId;
    this.s3Id = s3Id;
    this.url = url;
  }
}

// Util for making optional only some properties
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
