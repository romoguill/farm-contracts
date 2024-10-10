'use client';

import { Parcel } from '@/db/schema';
import { useCallback, useMemo, useState } from 'react';
import CursorTooltip from './cursor-tooltip';
import ParcelShape from './parcel-shape';
import ParcelList from './parcel-list';
import ParcelStats from './parcel-stats';
import { cn } from '@/lib/utils';
import { TwScreen, useCurrentBreakpoint } from '@/hooks/useCurrentBreakpoint';

interface ParcelViewerProps {
  parcels: Parcel[];
  forDashboard?: boolean;
  defaultSelected?: Parcel[];
}

const VIEWER_WIDTH_PX: Record<TwScreen, number> = {
  sm: 300,
  md: 600,
  lg: 600,
  xl: 820,
  '2xl': 820,
};

function ParcelViewer({
  parcels,
  forDashboard = false,
  defaultSelected = [],
}: ParcelViewerProps) {
  const [focusedParcel, setFocusedParcel] = useState<Parcel | null>(null);
  const [selectedParcels, setSelectedParcel] = useState<Parcel[] | null>(null);
  const [graphFocused, setGraphFocused] = useState(false);
  const { currentScreenWidth, tw } = useCurrentBreakpoint();

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
    (maxYCoordinate * VIEWER_WIDTH_PX[tw?.twScreen ?? 'sm']) / maxXCoordinate;

  return (
    <div
      className={cn(
        'relative w-full h-full mx-auto flex flex-col items-center gap-10 lg:grid lg:grid-cols-[600px,_1fr] xl:grid-cols-[800px,_1fr] lg:items-start'
      )}
    >
      <div>
        <ParcelList
          parcels={parcels}
          onFocus={(parcel) => setFocusedParcel(parcel)}
          selectedParcels={selectedParcels}
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
              viewerWidth={VIEWER_WIDTH_PX[tw?.twScreen ?? 'sm']}
              maxXCoordinate={maxXCoordinate}
              onShapeFocused={(parcel) => {
                setFocusedParcel(parcel);
              }}
              focused={focusedParcel?.id === parcel.id}
              onShapeSelected={(parcel) => setSelectedParcel(parcel)}
              selected={
                selectedParcels?.some((p) => p.id === parcel.id) || false
              }
            />
          ))}
        </div>
      </div>

      {!forDashboard &&
        selectedParcels &&
        selectedParcels.map((parcel) => (
          <ParcelStats key={parcel.id} parcel={parcel} />
        ))}

      {graphFocused && focusedParcel && (
        <CursorTooltip
          data={{ area: focusedParcel.area, label: focusedParcel.label }}
        />
      )}
    </div>
  );
}

export default ParcelViewer;
