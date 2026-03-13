'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Phone, Mail } from 'lucide-react';
import { SlabCard } from '@/components/slab-card';
import type { Supplier, Slab } from '@/lib/types';

export default function SupplierContent({ id }: { id: string }) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [slabs, setSlabs] = useState<Slab[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const { data: supplierData } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!supplierData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setSupplier(supplierData);

      const { data: slabsData } = await supabase
        .from('slabs')
        .select('*, supplier:suppliers(*)')
        .eq('supplier_id', id)
        .order('created_at', { ascending: false });

      setSlabs(slabsData || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (notFound || !supplier) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supplier not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {supplier.business_name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supplier.address && (
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-900 dark:text-white">{supplier.address}</p>
                {supplier.city && supplier.state && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {supplier.city}, {supplier.state} {supplier.zip_code}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <a href={`mailto:${supplier.contact_email}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {supplier.contact_email}
            </a>
          </div>
          {supplier.contact_phone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a href={`tel:${supplier.contact_phone}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                {supplier.contact_phone}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Available Slabs ({slabs.length})
        </h2>
      </div>

      {slabs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">This supplier currently has no slabs listed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slabs.map((slab) => (
            <SlabCard key={slab.id} slab={slab} />
          ))}
        </div>
      )}
    </div>
  );
}
