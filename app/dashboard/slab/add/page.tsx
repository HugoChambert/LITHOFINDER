'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Supplier } from '@/lib/types';

export const dynamic = 'force-dynamic';

const materials = ['Quartzite', 'Granite', 'Marble', 'Quartz'];
const finishes = ['Honed', 'Polished', 'Leathered'];
const thicknesses = ['2cm', '3cm'];

export default function AddSlabPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    slab_name: '',
    material: 'Quartzite',
    color: '',
    finish: 'Polished',
    thickness: '3cm',
    image_url: '',
    quantity_available: 1,
    description: '',
  });

  useEffect(() => {
    checkSupplier();
  }, []);

  const checkSupplier = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth');
      return;
    }

    const { data: supplierData } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!supplierData) {
      router.push('/dashboard/supplier/setup');
      return;
    }

    const isActive = supplierData.subscription_status === 'active' || supplierData.subscription_status === 'trialing';

    if (!isActive) {
      alert('You need an active subscription to upload slabs');
      router.push('/dashboard/subscription');
      return;
    }

    setSupplier(supplierData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplier) return;

    setLoading(true);

    const { error } = await supabase.from('slabs').insert({
      supplier_id: supplier.id,
      ...formData,
    });

    if (error) {
      alert('Error adding slab: ' + error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  if (!supplier) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Add New Slab
      </h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slab Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Taj Mahal, Fantasy Brown, Sea Pearl"
            value={formData.slab_name}
            onChange={(e) => setFormData({ ...formData, slab_name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Material *
            </label>
            <select
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {materials.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <input
              type="text"
              placeholder="e.g., White, Gray, Beige"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Finish
            </label>
            <select
              value={formData.finish}
              onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {finishes.map((finish) => (
                <option key={finish} value={finish}>
                  {finish}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thickness
            </label>
            <select
              value={formData.thickness}
              onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantity Available
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantity_available}
            onChange={(e) => setFormData({ ...formData, quantity_available: parseInt(e.target.value) })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Additional details about this slab..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Adding Slab...' : 'Add Slab'}
          </button>
        </div>
      </form>
    </div>
  );
}
