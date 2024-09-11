import Image from 'next/image';

function Navbar() {
  return (
    <header className='bg-green-600 h-[62px] md:h-[80px] p-3 sticky flex flex-nowrap items-center justify-between'>
      <Image
        src={'/contract.png'}
        width={40}
        height={40}
        alt='App logo'
        className='mx-4'
      />
      <nav className='flex-1'>
        <ul>
          <li>Explore</li>
        </ul>
      </nav>
    </header>
  );
}
export default Navbar;
