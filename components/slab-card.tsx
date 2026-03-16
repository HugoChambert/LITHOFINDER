import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { Slab } from '@/lib/types';

interface SlabCardProps {
  slab: Slab;
}

export function SlabCard({ slab }: SlabCardProps) {
  return (
    <div className="card-elevated overflow-hidden group">
      <div className="relative h-72 overflow-hidden" style={{ background: 'var(--hover-bg)' }}>
        {slab.image_url ? (
          <Image
            src={slab.image_url}
            alt={slab.slab_name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-secondary)' }}>
            <span className="text-sm">No image available</span>
          </div>
        )}
        {slab.quantity_available > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm bg-green-500/90 text-white shadow-lg">
            {slab.quantity_available} Available
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--foreground)' }}>
          {slab.slab_name}
        </h3>

        <div className="space-y-3 mb-5">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{
              background: 'var(--accent)',
              color: 'white'
            }}>
              {slab.material}
            </span>
            {slab.finish && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {slab.finish}
              </span>
            )}
            {slab.thickness && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{
                background: 'var(--hover-bg)',
                color: 'var(--foreground)'
              }}>
                {slab.thickness}
              </span>
            )}
          </div>

          {slab.color && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Color: <span style={{ color: 'var(--foreground)' }}>{slab.color}</span>
            </p>
          )}
        </div>

        {slab.supplier && (
          <div className="pt-5 mt-5" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Link
              href={`/supplier/${slab.supplier.id}`}
              className="text-base font-semibold hover:text-[var(--accent)] transition-colors block mb-3"
              style={{ color: 'var(--foreground)' }}
            >
              {slab.supplier.business_name}
            </Link>

            <div className="space-y-2">
              {slab.supplier.city && slab.supplier.state && (
                <div className="flex items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{slab.supplier.city}, {slab.supplier.state}</span>
                </div>
              )}
            </div>

            <button className="btn-primary w-full mt-4">
              Contact Supplier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
