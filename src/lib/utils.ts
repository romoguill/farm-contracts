import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export function getRgbString(rgb: string[], a: string = '1') {
  return `rgba(${rgb.join(',')},${a})`;
}

function createFormData(
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
