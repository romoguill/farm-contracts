'use client';

import { Parcel } from '@/db/schema';
import { useCallback, useMemo, useState } from 'react';
import CursorTooltip from './cursor-tooltip';
import ParcelShape from './parcel-shape';
import ParcelList from './parcel-list';
import ParcelStats from './parcel-stats';
import { cn } from '@/lib/utils';
import { useCurrentBreakpoint } from '@/hooks/useCurrentBreakpoint';

type ViewerWidth = 'sm' | 'md' | 'lg';

interface ParcelViewerProps {
  parcels: Parcel[];
  viewerWidth: ViewerWidth;
}

const VIEWER_WIDTH_PX: Record<ViewerWidth, number> = {
  sm: 300,
  md: 650,
  lg: 800,
};

function ParcelViewer({ parcels, viewerWidth }: ParcelViewerProps) {
  const [focusedParcel, setFocusedParcel] = useState<Parcel | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [graphFocused, setGraphFocused] = useState(false);
  const tw = useCurrentBreakpoint();
  console.log(tw);

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

  // Used for calculating final y position and adjust styles
  const calculateMaxYCoordinate = useCallback((parcels: Parcel[]) => {
    return parcels.reduce((prev1, curr1) => {
      const maxPerParcel = curr1.coordinates.reduce((prev2, curr2) => {
        return prev2 < curr2[1] ? curr2[1] : prev2;
      }, 0);

      return prev1 < maxPerParcel ? maxPerParcel : prev1;
    }, 0);
  }, []);

  const maxYCoordinate = useMemo(
    () => calculateMaxYCoordinate(parcels),
    [calculateMaxYCoordinate, parcels]
  );

  // Get the height in px that will keep and aspect ratio of 1:1. Used for styling flex containers correctly
  const viewerHeight =
    (maxYCoordinate * VIEWER_WIDTH_PX[viewerWidth]) / maxXCoordinate;

  return (
    <div
      className={cn(
        'relative w-full h-full mx-auto flex! flex-col items-center gap-10'
      )}
    >
      <div>
        <ParcelList
          parcels={parcels}
          onFocus={(parcel) => setFocusedParcel(parcel)}
          selectedParcel={selectedParcel}
          onSelect={(parcel) => setSelectedParcel(parcel)}
        />

        <div
          className='flex max-w-[1200px]'
          style={{ height: `${viewerHeight}px` }}
          onMouseOver={() => setGraphFocused(true)}
          onMouseLeave={() => setGraphFocused(false)}
        >
          {parcels.map((parcel) => (
            <ParcelShape
              key={parcel.label}
              parcel={parcel}
              viewerWidth={VIEWER_WIDTH_PX[viewerWidth]}
              maxXCoordinate={maxXCoordinate}
              onShapeFocused={(parcel) => {
                setFocusedParcel(parcel);
              }}
              focused={focusedParcel?.id === parcel.id ?? null}
              onShapeSelected={(parcel) => setSelectedParcel(parcel)}
              selected={selectedParcel?.id === parcel.id ?? null}
            />
          ))}
        </div>
      </div>

      {selectedParcel && <ParcelStats parcel={selectedParcel} />}

      {graphFocused && focusedParcel && (
        <CursorTooltip
          data={{ area: focusedParcel.area, label: focusedParcel.label }}
        />
      )}
    </div>
  );
}

export default ParcelViewer;
