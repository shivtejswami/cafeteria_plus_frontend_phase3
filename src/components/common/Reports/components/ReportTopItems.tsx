'use client';

import type { MenuItemMention } from '@/lib/schoolAdminData';
import { barWidthClass } from '@/utils/barWidth';

interface ReportTopItemsProps {
  favourites: MenuItemMention[];
  leastFavourites: MenuItemMention[];
}

export default function ReportTopItems({ favourites, leastFavourites }: ReportTopItemsProps) {
  const maxFav = Math.max(...favourites.map(f => f.mentions), 1);
  const maxLeast = Math.max(...leastFavourites.map(f => f.mentions), 1);

  return (
    <section aria-labelledby="topitems-heading">
      <h2 id="topitems-heading" className="text-[18px] font-semibold mb-4 text-ink">Top items</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-leaf">
              <i className="ri-heart-line text-[17px]"></i>
            </span>
            <h3 className="text-[14px] font-semibold text-ink">Favourite items</h3>
          </div>
          <div className="space-y-3">
            {favourites.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[14px] font-medium text-ink">{item.name}</span>
                  <span className="text-[13px] font-semibold text-leaf">{item.mentions}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-surface-100">
                  <div className={`h-full rounded-full bg-leaf ${barWidthClass((item.mentions / maxFav) * 100)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-brick-600">
              <i className="ri-thumb-down-line text-[17px]"></i>
            </span>
            <h3 className="text-[14px] font-semibold text-ink">Least favourite items</h3>
          </div>
          <div className="space-y-3">
            {leastFavourites.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[14px] font-medium text-ink">{item.name}</span>
                  <span className="text-[13px] font-semibold text-brick-600">{item.mentions}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-surface-100">
                  <div className={`h-full rounded-full bg-brick-600 ${barWidthClass((item.mentions / maxLeast) * 100)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[12px] mt-3 text-subtle">
        Based on open-ended responses. Mentions are extracted and categorised from student comments.
      </p>
    </section>
  );
}