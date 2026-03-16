'use client';

import { useEffect, useState } from 'react';
import { SearchFilters, type SearchParams } from '@/components/search-filters';
import { SlabCard } from '@/components/slab-card';
import { createClient } from '@/lib/supabase/client';
import type { Slab } from '@/lib/types';

export const dynamic = 'force-dynamic';

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
    <div className="min-h-screen">
      <div className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-blue-950 -z-10" />
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-6">
            <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Nationwide Stone Database</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ color: 'var(--foreground)' }}>
            Find Your Perfect
            <br />
            <span className="gradient-text">Stone Slab</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Search thousands of natural stone slabs from verified suppliers across the country
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 -mt-8 pb-16">
        <SearchFilters onSearch={handleSearch} />

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>
                {filteredSlabs.length} {filteredSlabs.length === 1 ? 'Result' : 'Results'}
              </p>
            </div>

            {filteredSlabs.length === 0 ? (
              <div className="text-center py-32">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    No slabs found
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Try adjusting your search filters to find what you're looking for
                  </p>
                </div>
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
    </div>
  );
}
