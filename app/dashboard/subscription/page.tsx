'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SupplierData {
  id: string;
  business_name: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  subscription_cancel_at_period_end: boolean | null;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    loadSupplier();
  }, []);

  const loadSupplier = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading supplier:', error);
    }

    setSupplier(data);
    setLoading(false);
  };

  const handleCancelSubscription = async () => {
    if (!supplier || !confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }

    setCanceling(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/stripe-cancel-subscription`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ supplierId: supplier.id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      await loadSupplier();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Supplier Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to create a supplier profile first to manage subscriptions.
          </p>
          <button
            onClick={() => router.push('/dashboard/supplier/setup')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Create Supplier Profile
          </button>
        </div>
      </div>
    );
  }

  const isActive = supplier.subscription_status === 'active' || supplier.subscription_status === 'trialing';
  const periodEnd = supplier.subscription_current_period_end
    ? new Date(supplier.subscription_current_period_end).toLocaleDateString()
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Subscription Management
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {supplier.business_name}
          </h2>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Subscription Status
          </h3>

          {!supplier.subscription_status ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg">
                No active subscription. You need to subscribe to upload slabs.
              </div>
              <button
                onClick={() => router.push('/dashboard/supplier/setup')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Subscribe Now - $49/month
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`px-4 py-3 rounded-lg ${
                isActive
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${
                      isActive
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      Status: {supplier.subscription_status?.toUpperCase()}
                    </p>
                    {periodEnd && (
                      <p className={`text-sm mt-1 ${
                        isActive
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {supplier.subscription_cancel_at_period_end
                          ? `Access until: ${periodEnd}`
                          : `Next billing date: ${periodEnd}`
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isActive && !supplier.subscription_cancel_at_period_end && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {canceling ? 'Canceling...' : 'Cancel Subscription'}
                </button>
              )}

              {supplier.subscription_cancel_at_period_end && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg">
                  Your subscription will be canceled at the end of the billing period. You can still upload slabs until {periodEnd}.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Subscription Benefits
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Unlimited slab uploads</li>
            <li>Nationwide visibility</li>
            <li>Direct customer inquiries</li>
            <li>Profile management</li>
            <li>Analytics and insights</li>
          </ul>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
