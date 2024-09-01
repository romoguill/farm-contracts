'use client';

import { Parcel } from '@/db/schema';
import { useCallback, useMemo, useState } from 'react';
import CursorTooltip from './cursor-tooltip';
import ParcelShape from './parcel-shape';

interface ParcelViewerProps {
  parcels: Parcel[];
  viewerWidth: number;
}

function ParcelViewer({ parcels, viewerWidth }: ParcelViewerProps) {
  const [focusedParcel, setFocusedParcel] = useState<Parcel | null>(null);

  // In order to scale correctly the whole viewer, I need to get the max x coordinate.
  // First reduce gets the highest x coordinate from each parcel and the second one gets the highest among all parcels
  const calculateMaxXCoordinate = useCallback((parcels: Parcel[]) => {
    return parcels.reduce((prev1, curr1) => {
      const maxPerParcel = curr1.coordinates.reduce((prev2, curr2) => {
        return prev2 < curr2[0] ? curr2[0] : prev2;
      }, 0);

      return prev1 < maxPerParcel ? maxPerParcel : prev1;
    }, 0);
  }, []);

  const maxXCoordinate = useMemo(
    () => calculateMaxXCoordinate(parcels),
    [calculateMaxXCoordinate, parcels]
  );

  return (
    <div className='relative w-full h-full mx-auto'>
      {parcels.map((parcel) => (
        <ParcelShape
          key={parcel.label}
          parcel={parcel}
          viewerWidth={viewerWidth}
          maxXCoordinate={maxXCoordinate}
          onShapeFocused={(parcel) => setFocusedParcel(parcel)}
          focused={focusedParcel?.id === parcel.id ?? null}
        />
      ))}

      {focusedParcel && (
        <CursorTooltip
          data={{ area: focusedParcel.area, label: focusedParcel.label }}
        />
      )}
    </div>
  );
}

export default ParcelViewer;
