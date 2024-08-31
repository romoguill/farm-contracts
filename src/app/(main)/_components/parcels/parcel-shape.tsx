'use client';

import { Parcel } from '@/db/schema';

interface ParcelShape {
  parcel: Parcel;
  viewerWidth: number;
  maxXCoordinate: number;
}

function ParcelShape({ parcel, viewerWidth, maxXCoordinate }: ParcelShape) {
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
    <div
      className={`absolute bg-red-500`}
      style={{
        backgroundColor: `rgb(${parcel.color[0]},${parcel.color[1]},${parcel.color[2]})`,
        clipPath: calculateParcelPolygon(parcel.coordinates),
        height: `${viewerWidth}px`,
        width: `${viewerWidth}px`,
      }}
    ></div>
  );
}
export default ParcelShape;
