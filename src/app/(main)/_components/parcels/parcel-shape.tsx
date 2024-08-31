'use client';

import { Parcel } from '@/db/schema';
import { cn } from '@/lib/utils';

interface ParcelShape {
  parcel: Parcel;
  viewerWidth: number;
  maxXCoordinate: number;
  onShapeFocused: (id: string | null) => void;
  focused: boolean;
}

function ParcelShape({
  parcel,
  viewerWidth,
  maxXCoordinate,
  onShapeFocused,
  focused,
}: ParcelShape) {
  const calculateParcelPolygon = (coordinates: Parcel['coordinates']) => {
    const flatCoordinates = coordinates.flat();

    let polygonArray = [];
    for (let i = 0; i < flatCoordinates.length; i += 2) {
      polygonArray.push(
        `${(flatCoordinates[i] / maxXCoordinate) * 100}% ${
          (flatCoordinates[i + 1] / maxXCoordinate) * 100
        }%`
      );
    }

    return `polygon(${polygonArray.join(', ')})`;
  };

  return (
    <>
      <div
        className={cn(
          `absolute left-1/2 -translate-x-1/2 bg-red-500 border-black`,
          {
            'opacity-80': !focused,
          }
        )}
        style={{
          backgroundColor: `rgb(${parcel.color[0]},${parcel.color[1]},${parcel.color[2]})`,
          clipPath: calculateParcelPolygon(parcel.coordinates),
          height: `${viewerWidth}px`,
          width: `${viewerWidth}px`,
        }}
        onMouseEnter={() => onShapeFocused(parcel.id)}
        onMouseLeave={() => onShapeFocused(null)}
      ></div>
    </>
  );
}
export default ParcelShape;
