import ParcelShape from './parcel-shape';

function ParcelViewer() {
  return (
    <div className='relative'>
      <ParcelShape label='AA' path='polygon1' color='bg-red-500' />
      <ParcelShape label='AB' path='polygon2' color='bg-purple-500' />
      <ParcelShape label='AC' path='polygon3' color='bg-green-500' />
    </div>
  );
}

export default ParcelViewer;
