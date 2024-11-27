'use client';

import { item_per_page } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type PaginationProps = {
  page: number;
  count: number;
};

const Pagination = ({ page, count }: PaginationProps) => {
  const router = useRouter();

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const hasPrev = item_per_page * (page - 1) > 0;
  const hasNext = item_per_page * (page - 1) + item_per_page < count;

  return (
    <div className='flex items-center justify-between to-gray-500 p-4'>
      <button
        disabled={!hasPrev}
        className='rounded-md bg-slate-200 px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
        onClick={() => changePage(page - 1)}
      >
        Prev
      </button>
      <div className='flex items-center gap-2 text-sm'>
        {Array.from({ length: Math.ceil(count / item_per_page) }, (_, i) => {
          const pageIndex = i + 1;
          return (
            <button
              key={i}
              className={`rounded-sm px-2 ${page === pageIndex ? 'bg-babyBlue' : ''}`}
              onClick={() => changePage(pageIndex)}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>
      <button
        disabled={!hasNext}
        className='rounded-md bg-slate-200 px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50'
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
