'use client';

import { Table } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';

type CurrencyAPIResponse = {
  official: {
    value_avg: number;
    value_sell: number;
    value_buy: number;
  };
  blue: {
    value_avg: number;
    value_sell: number;
    value_buy: number;
  };
};

const CURRENCY_API_URL = 'https://api.bluelytics.com.ar/v2/latest';

const getCurrencyConversions = () =>
  fetch(CURRENCY_API_URL).then<CurrencyAPIResponse>((res) => res.json());

const CurrencyConverter = function CurrencyConverter() {
  const { data } = useQuery({
    queryKey: ['currency-conversions'],
    queryFn: getCurrencyConversions,
  });

  return <div></div>;
};

export default CurrencyConverter;
