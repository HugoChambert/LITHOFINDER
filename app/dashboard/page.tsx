'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import type { Supplier, Slab } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [slabs, setSlabs] = useState<Slab[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth');
      return;
    }

    setUser(user);
    await fetchSupplierData(user.id);
  };

  const fetchSupplierData = async (userId: string) => {
    const { data: supplierData } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (supplierData) {
      setSupplier(supplierData);
      await fetchSlabs(supplierData.id);
    }

    setLoading(false);
  };

  const fetchSlabs = async (supplierId: string) => {
    const { data } = await supabase
      .from('slabs')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    setSlabs(data || []);
  };

  const handleDeleteSlab = async (slabId: string) => {
    if (!confirm('Are you sure you want to delete this slab?')) return;

    const { error } = await supabase
      .from('slabs')
      .delete()
      .eq('id', slabId);

    if (!error && supplier) {
      await fetchSlabs(supplier.id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Supplier Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Before you can add slab listings, you need to set up your supplier profile
          </p>
          <Link
            href="/dashboard/supplier/setup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Supplier Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your stone slab listings
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {supplier.business_name}
          </h2>
          <Link
            href="/dashboard/supplier/edit"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <strong>Email:</strong> {supplier.contact_email}
          </div>
          <div>
            <strong>Phone:</strong> {supplier.contact_phone || 'Not provided'}
          </div>
          <div>
            <strong>Location:</strong> {supplier.city && supplier.state ? `${supplier.city}, ${supplier.state}` : 'Not provided'}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Slabs ({slabs.length})
        </h2>
        <Link
          href="/dashboard/slab/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Slab</span>
        </Link>
      </div>

      {slabs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't added any slabs yet
          </p>
          <Link
            href="/dashboard/slab/add"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            Add Your First Slab
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slabs.map((slab) => (
            <div key={slab.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                {slab.image_url && (
                  <img
                    src={slab.image_url}
                    alt={slab.slab_name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {slab.slab_name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <p><strong>Material:</strong> {slab.material}</p>
                  {slab.finish && <p><strong>Finish:</strong> {slab.finish}</p>}
                  {slab.thickness && <p><strong>Thickness:</strong> {slab.thickness}</p>}
                  <p><strong>Quantity:</strong> {slab.quantity_available}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/slab/edit/${slab.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteSlab(slab.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-200 py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
