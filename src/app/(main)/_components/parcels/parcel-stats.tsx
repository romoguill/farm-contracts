import { Parcel } from '@/db/schema';

interface ParcelStatsProps {
  parcel: Parcel;
}

function ParcelStats({ parcel }: ParcelStatsProps) {
  return (
    <article className='border mt-5 border-slate-300 shadow-md rounded-2xl p-3 w-[350px] col-start-2 justify-self-end'>
      <h3 className='text-lg'>{`Parcel ${parcel.label} Summary`}</h3>
      <ul>
        <li className='flex justify-between'>
          Area: <span>{parcel.area}</span>
        </li>
        <li className='flex justify-between'>
          {/* TODO */}
          Last measured area: <span>XXXX</span>
        </li>
        <li className='flex justify-between'>
          {/* TODO */}
          Last contract:{' '}
          <span className='text-end'>XXXX/XX/XX - XXXX/XX/XX</span>
        </li>
      </ul>
    </article>
  );
}

export default ParcelStats;
