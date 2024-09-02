function ParcelStats() {
  return (
    <article className='mt-[15px] border border-slate-300 shadow-md rounded-2xl p-3 w-[350px]'>
      <h3 className='text-lg'>Parcel AA Summary</h3>
      <ul>
        <li className='flex justify-between'>
          Area: <span>2334 has.</span>
        </li>
        <li className='flex justify-between'>
          Last measured area: <span>2260</span>
        </li>
        <li className='flex justify-between'>
          Last contract:{' '}
          <span className='text-end'>2022/06/01 - 2023/01/21</span>
        </li>
      </ul>
    </article>
  );
}

export default ParcelStats;
