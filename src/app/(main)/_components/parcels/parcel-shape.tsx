'use client';

interface PolygonProps {
  path: string;
  label: string;
  color: string;
}

function ParcelShape({ path, label, color }: PolygonProps) {
  return (
    <div className={`w-[500px] h-[500px] absolute ${path} ${color}`}>
      {label}
    </div>
  );
}
export default ParcelShape;
