import { Parcel } from '@/db/schema';
import ParcelShape from './parcel-shape';

interface ParcelViewerProps {
  parcels: Parcel[];
  viewerWidth: number;
}

function ParcelViewer({ parcels, viewerWidth }: ParcelViewerProps) {
  // In order to scale correctly the whole viewer, I need to get the max x coordinate.
  // First reduce gets the highest x coordinate from each parcel and the second one gets the highest among all parcels
  const calculateMaxXCoordinate = (parcels: Parcel[]) => {
    return parcels.reduce((prev1, curr1) => {
      const maxPerParcel = curr1.coordinates.reduce((prev2, curr2) => {
        return prev2 < curr2[0] ? curr2[0] : prev2;
      }, 0);

      return prev1 < maxPerParcel ? maxPerParcel : prev1;
    }, 0);
  };

  const maxXCoordinate = calculateMaxXCoordinate(parcels);

  return (
    <div className='relative'>
      {parcels.map((parcel) => (
        <ParcelShape
          parcel={parcel}
          viewerWidth={viewerWidth}
          maxXCoordinate={maxXCoordinate}
        />
      ))}
    </div>
  );
}

export default ParcelViewer;
