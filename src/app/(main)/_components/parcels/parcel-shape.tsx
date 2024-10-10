'use client';

import { Parcel } from '@/db/schema';
import { cn } from '@/lib/utils';
import { useCallback, useMemo } from 'react';

interface ParcelShape {
  parcel: Parcel;
  viewerWidth: number;
  maxXCoordinate: number;
  onShapeFocused: (parcel: Parcel | null) => void;
  focused: boolean;
  onShapeSelected: (parcel: Parcel[] | null) => void;
  selected: boolean;
}

function ParcelShape({
  parcel,
  viewerWidth,
  maxXCoordinate,
  onShapeFocused,
  focused,
  onShapeSelected,
  selected,
}: ParcelShape) {
  const calculateParcelPolygon = useCallback(
    (coordinates: Parcel['coordinates']) => {
      const flatCoordinates = coordinates.flat();

      let innerPolygonArray: string[] = [];
      let outerPolygonArray: string[] = [];
      for (let i = 0; i < flatCoordinates.length; i += 2) {
        outerPolygonArray.push(
          `${(flatCoordinates[i] / maxXCoordinate) * 100}% ${
            (flatCoordinates[i + 1] / maxXCoordinate) * 100
          }%`
        );
        innerPolygonArray.push(
          `${(flatCoordinates[i] / maxXCoordinate) * 100}% ${
            (flatCoordinates[i + 1] / maxXCoordinate) * 100
          }%`
        );
      }

      return {
        outerPolygon: `polygon(${outerPolygonArray.join(', ')})`,
        innerPolygon: `polygon(${innerPolygonArray.join(', ')})`,
      };
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
          `absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0`,
          {
            'opacity-80': !focused && !selected,
          }
        )}
        style={{
          backgroundColor: `rgb(${parcel.color[0]},${parcel.color[1]},${parcel.color[2]})`,
          clipPath: clipPath.outerPolygon,
          height: `${viewerWidth}px`,
          width: `${viewerWidth}px`,
        }}
        onMouseEnter={() => onShapeFocused(parcel)}
        onMouseLeave={() => onShapeFocused(null)}
        onClick={() =>
          selected ? onShapeSelected(null) : onShapeSelected([parcel])
        }
      >
        {/* <div
          className={cn(`absolute top-[2px] left-[4px]`, {
            'opacity-80': !focused && !selected,
          })}
          style={{
            backgroundColor: `rgb(255,255,255)`,
            clipPath: clipPath.innerPolygon,
            height: `${viewerWidth - 30}px`,
            width: `${viewerWidth - 30}px`,
          }}
        /> */}
      </div>
    </>
  );
}
export default ParcelShape;
