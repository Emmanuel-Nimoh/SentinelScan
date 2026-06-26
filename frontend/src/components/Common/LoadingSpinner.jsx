import { Loader2 } from 'lucide-react';

const SIZE_MAP = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

export default function LoadingSpinner({ size = 'md', label = 'Loading...', fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className={`${SIZE_MAP[size] || SIZE_MAP.md} animate-spin text-blue-600`} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="flex items-center justify-center min-h-[60vh]">{spinner}</div>;
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
}
