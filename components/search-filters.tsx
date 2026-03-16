'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchFiltersProps {
  onSearch: (filters: SearchParams) => void;
}

export interface SearchParams {
  query: string;
  material: string;
  color: string;
  finish: string;
  thickness: string;
  location: string;
}

const materials = ['All', 'Quartzite', 'Granite', 'Marble', 'Quartz'];
const finishes = ['All', 'Honed', 'Polished', 'Leathered'];
const thicknesses = ['All', '2cm', '3cm'];
const colors = ['All', 'White', 'Black', 'Gray', 'Brown', 'Blue', 'Green', 'Red', 'Beige'];

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchParams>({
    query: '',
    material: 'All',
    color: 'All',
    finish: 'All',
    thickness: 'All',
    location: '',
  });

  const handleFilterChange = (key: keyof SearchParams, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="card-elevated p-8 mb-12" style={{ background: 'var(--card-background)' }}>
      <form onSubmit={handleSearchSubmit} className="space-y-6">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search stone name (e.g., Taj Mahal, Fantasy Brown)"
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="input-field w-full pl-14 pr-6 py-4 text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Material Type
            </label>
            <select
              value={filters.material}
              onChange={(e) => handleFilterChange('material', e.target.value)}
              className="input-field w-full"
            >
              {materials.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Color
            </label>
            <select
              value={filters.color}
              onChange={(e) => handleFilterChange('color', e.target.value)}
              className="input-field w-full"
            >
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Finish
            </label>
            <select
              value={filters.finish}
              onChange={(e) => handleFilterChange('finish', e.target.value)}
              className="input-field w-full"
            >
              {finishes.map((finish) => (
                <option key={finish} value={finish}>
                  {finish}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Thickness
            </label>
            <select
              value={filters.thickness}
              onChange={(e) => handleFilterChange('thickness', e.target.value)}
              className="input-field w-full"
            >
              {thicknesses.map((thickness) => (
                <option key={thickness} value={thickness}>
                  {thickness}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Location (City or State)
          </label>
          <input
            type="text"
            placeholder="Enter city or state"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="input-field w-full"
          />
        </div>
      </form>
    </div>
  );
}
