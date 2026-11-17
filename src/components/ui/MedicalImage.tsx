import { useState } from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface MedicalImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  containerClassName?: string;
  lazy?: boolean;
}

export function MedicalImage({
  src,
  alt,
  className,
  containerClassName,
  lazy = true,
}: MedicalImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-[#E8F4F1] dark:bg-[#172B31] text-[#123B45]/60 dark:text-[#9AB2B8] p-6 text-center',
          containerClassName
        )}
        role="img"
        aria-label={alt}
      >
        <Package className="w-10 h-10 stroke-[1.5]" aria-hidden="true" />
        <span className="text-xs font-medium line-clamp-2 max-w-[180px]">{alt}</span>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden bg-[#E8F4F1] dark:bg-[#172B31]', containerClassName)}>
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={cn('w-full h-full object-cover', className)}
      />
    </div>
  );
}
