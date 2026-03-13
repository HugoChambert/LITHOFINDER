import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { Slab } from '@/lib/types';

interface SlabCardProps {
  slab: Slab;
}

export function SlabCard({ slab }: SlabCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
        {slab.image_url ? (
          <Image
            src={slab.image_url}
            alt={slab.slab_name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <span className="text-sm">No image available</span>
          </div>
        )}
        {slab.quantity_available > 0 && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {slab.quantity_available} Available
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {slab.slab_name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {slab.material}
            </span>
            {slab.finish && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {slab.finish}
              </span>
            )}
            {slab.thickness && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {slab.thickness}
              </span>
            )}
          </div>

          {slab.color && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Color: {slab.color}
            </p>
          )}
        </div>

        {slab.supplier && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <Link
              href={`/supplier/${slab.supplier.id}`}
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {slab.supplier.business_name}
            </Link>

            <div className="mt-2 space-y-1">
              {slab.supplier.city && slab.supplier.state && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span>{slab.supplier.city}, {slab.supplier.state}</span>
                </div>
              )}
            </div>

            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200">
              Contact Supplier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
