import { SearchFilters, searchFiltersSchema } from '@/lib/validation';
import { useSearchParams } from 'next/navigation';

function useQueryFilters(): SearchFilters {
  const searchParams = useSearchParams();
  const filters = Object.fromEntries(searchParams);

  const { data: parsedFilters, error } = searchFiltersSchema.safeParse(filters);

  if (error) {
    return {
      parcel: 'ALL',
      status: 'ALL',
      year: 'ALL',
    };
  }

  return parsedFilters;
}
export default useQueryFilters;
