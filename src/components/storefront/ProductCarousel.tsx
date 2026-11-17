import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductWithDetails } from '@/src/types/database';
import { ProductCard } from '@/src/components/storefront/ProductCard';
import { useLanguage } from '@/src/context/LanguageContext';
import { cn } from '@/src/utils/cn';

interface ProductCarouselProps {
  products: ProductWithDetails[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const { isRTL, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Responsive visible items: 1 on mobile, 2 on tablet, 3 on desktop
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = useMemo(
    () => Math.max(0, products.length - itemsPerPage),
    [products.length, itemsPerPage]
  );

  // Keep currentIndex bounded if itemsPerPage changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (products.length === 0) {
    return null;
  }

  // Calculate slide offset percentage
  const slidePercent = 100 / itemsPerPage;
  const translateAmount = isRTL
    ? currentIndex * slidePercent
    : -currentIndex * slidePercent;

  // Arrow icons mapping (Left is back in LTR, forward in RTL)
  const LeftArrowIcon = ChevronLeft;
  const RightArrowIcon = ChevronRight;
  const ViewAllArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-8 sm:py-12" aria-roledescription="carousel">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Carousel Header with Title & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#267C78] dark:text-[#63C2BC] mb-1.5">
              <span>🏥 {t.brand.shortName}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
              {t.home.carouselTitle}
            </h2>
            <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-1 max-w-xl">
              {t.home.carouselSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* View All Products Link */}
            <Link
              to="/products"
              className="h-10 px-4 rounded-lg bg-[#E8F4F1] dark:bg-[#172B31] hover:bg-[#267C78] hover:text-white dark:hover:bg-[#267C78] text-[#123B45] dark:text-[#ECF3F4] text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t.home.viewAllProducts}</span>
              <ViewAllArrow className="w-4 h-4" aria-hidden="true" />
            </Link>

            {/* Navigation Arrows */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126]">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoPrev}
                aria-label={t.home.prevProductsAria}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#123B45] dark:text-[#ECF3F4] hover:bg-[#E8F4F1] dark:hover:bg-[#172B31] disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <LeftArrowIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                aria-label={t.home.nextProductsAria}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#123B45] dark:text-[#ECF3F4] hover:bg-[#E8F4F1] dark:hover:bg-[#172B31] disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <RightArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div className="relative overflow-hidden -mx-2 sm:-mx-3 px-1 py-1">
          <div
            className="flex transition-transform duration-500 ease-out will-change-transform"
            style={{
              transform: `translateX(${translateAmount}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2 sm:px-3"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots (for mobile & tablet navigation) */}
        {maxIndex > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                aria-current={currentIndex === idx}
                className={cn(
                  'h-2 rounded-full transition-all cursor-pointer',
                  currentIndex === idx
                    ? 'w-6 bg-[#267C78]'
                    : 'w-2 bg-slate-300 dark:bg-[#213B43] hover:bg-slate-400'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
