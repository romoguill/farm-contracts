'use client';

import { Parcel } from '@/db/schema';
import { cn } from '@/lib/utils';
import { useCallback, useMemo } from 'react';

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
  const calculateParcelPolygon = useCallback(
    (coordinates: Parcel['coordinates']) => {
      console.log('calcultion 2');
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
    },
    [maxXCoordinate]
  );

  const clipPath = useMemo(
    () => calculateParcelPolygon(parcel.coordinates),
    [calculateParcelPolygon, parcel.coordinates]
  );

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
          clipPath: clipPath,
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
