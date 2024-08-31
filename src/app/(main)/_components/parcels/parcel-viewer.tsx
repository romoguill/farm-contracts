'use client';

import { Parcel } from '@/db/schema';
import ParcelShape from './parcel-shape';
import { useCallback, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ParcelViewerProps {
  parcels: Parcel[];
  viewerWidth: number;
}

function ParcelViewer({ parcels, viewerWidth }: ParcelViewerProps) {
  const [focusedParcel, setFocusedParcel] = useState<string | null>(null);

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

  const maxXCoordinate = calculateMaxXCoordinate(parcels);

  return (
    <div className='relative w-full h-full mx-auto'>
      {parcels.map((parcel) => (
        <ParcelShape
          key={parcel.label}
          parcel={parcel}
          viewerWidth={viewerWidth}
          maxXCoordinate={maxXCoordinate}
          onShapeFocused={(id) => setFocusedParcel(id)}
          focused={focusedParcel === parcel.id}
        />
      ))}
      <TooltipProvider>
        <Tooltip open={true}>
          <TooltipTrigger asChild></TooltipTrigger>
          <TooltipContent className='w-30 h-30 bg-black'>
            <p>
              {parcels.find((parcel) => parcel.id === focusedParcel)?.label}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ParcelViewer;
