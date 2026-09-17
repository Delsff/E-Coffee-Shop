import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSeacrQuery: (query: string) => void;
  selectedOrigin: string;
  setSelectedOrigin: (origin: string) => void;
  selectedRoast: string;
  setSelectedRoast: (roast: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  origins: string[];
  roasts: string[];
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSeacrQuery,
  selectedOrigin,
  setSelectedOrigin,
  selectedRoast,
  setSelectedRoast,
  sortBy,
  setSortBy,
  origins,
  roasts,
  onReset,
}) => {
  const hasActiveFilters = searchQuery || selectedOrigin || selectedRoast || sortBy !== 'default';
  return (
    <>
      <div className='bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 mb-8 space-y-4'>
        <div className='flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center'>
          <div className='relative flex-1'>
            <Search className='w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSeacrQuery(e.target.value)}
              placeholder='Search coffe by title, origin or flavor...'
              className='w-full bg-stone-950 border border-stone-800 text-stone-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-amber-500 placeholder:text-stone-500 transition-colors'
            />
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className='bg-stone-950 border border-stone-800 text-stone-300 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 cursor-pointer'
            >
              <option value=''>All Origins</option>
              {origins.map((origin) => (
                <option value={origin} key={origin}>
                  {origin}
                </option>
              ))}
            </select>
            <select
              value={selectedRoast}
              onChange={(e) => setSelectedRoast(e.target.value)}
              className='bg-stone-950 border border-stone-800 text-stone-300 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 cursor-pointer'
            >
              <option value=''>All Roast Levels</option>
              {roasts.map((roast) => (
                <option value={roast} key={roast}>
                  {roast}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='col-span-2 sm:col-span-1 bg-stone-950 border border-stone-800 text-stone-300 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 cursor-pointer'
            >
              <option value='default'>Sort by: Default</option>
              <option value='price-asc'>Price: Low to High</option>
              <option value='price-desc'>Price: High to Low</option>
              <option value='score-desc'>Highest Q-Score</option>
            </select>
          </div>
        </div>
        {hasActiveFilters && (
          <div className='flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs'>
            <span className='text-stone-400 flex items-center gap-1.5'>
              <SlidersHorizontal className='w-3.5 h-3.5 text-amber-500' />
              Filters applied
            </span>
            <button
              onClick={onReset}
              className='text-amber-500 hover:text-amber-400 flex items-center gap-1 font-medium transition-colors'
            >
              <RotateCcw className='w-4 h-4' />
              Reset All
            </button>
          </div>
        )}
      </div>
    </>
  );
};
