'use client';

import { useEffect, useState } from 'react';
import { SearchFilters, type SearchParams } from '@/components/search-filters';
import { SlabCard } from '@/components/slab-card';
import { createClient } from '@/lib/supabase/client';
import type { Slab } from '@/lib/types';

export default function HomePage() {
  const [slabs, setSlabs] = useState<Slab[]>([]);
  const [filteredSlabs, setFilteredSlabs] = useState<Slab[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchSlabs();
  }, []);

  const fetchSlabs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('slabs')
      .select(`
        *,
        supplier:suppliers(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching slabs:', error);
    } else {
      setSlabs(data || []);
      setFilteredSlabs(data || []);
    }
    setLoading(false);
  };

  const handleSearch = (filters: SearchParams) => {
    let filtered = [...slabs];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter((slab) =>
        slab.slab_name.toLowerCase().includes(query)
      );
    }

    if (filters.material !== 'All') {
      filtered = filtered.filter((slab) => slab.material === filters.material);
    }

    if (filters.color !== 'All') {
      filtered = filtered.filter((slab) =>
        slab.color?.toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    if (filters.finish !== 'All') {
      filtered = filtered.filter((slab) => slab.finish === filters.finish);
    }

    if (filters.thickness !== 'All') {
      filtered = filtered.filter((slab) => slab.thickness === filters.thickness);
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(
        (slab) =>
          slab.supplier?.city?.toLowerCase().includes(location) ||
          slab.supplier?.state?.toLowerCase().includes(location)
      );
    }

    setFilteredSlabs(filtered);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Find Your Perfect Stone Slab
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Search through thousands of natural stone slabs from suppliers nationwide
        </p>
      </div>

      <SearchFilters onSearch={handleSearch} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredSlabs.length} {filteredSlabs.length === 1 ? 'slab' : 'slabs'}
            </p>
          </div>

          {filteredSlabs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No slabs found matching your criteria
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSlabs.map((slab) => (
                <SlabCard key={slab.id} slab={slab} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
