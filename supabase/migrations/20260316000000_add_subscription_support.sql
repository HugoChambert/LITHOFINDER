/*
  # Add Subscription Support for Suppliers

  1. Changes to Tables
    - Update `suppliers` table:
      - Add `stripe_customer_id` to track Stripe customer
      - Add `stripe_subscription_id` to track active subscription
      - Add `subscription_status` for subscription state tracking
      - Add `subscription_current_period_end` for billing cycle tracking
      - Add `subscription_cancel_at_period_end` for cancellation handling

  2. Security
    - Maintain existing RLS policies
    - Only suppliers can update their own subscription status through webhooks

  3. Notes
    - Subscription status can be: 'active', 'canceled', 'past_due', 'trialing', 'incomplete'
    - Only suppliers with 'active' or 'trialing' status can upload slabs
    - Regular users (non-suppliers) remain free
*/

-- Add subscription columns to suppliers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'suppliers' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN stripe_customer_id text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'suppliers' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN stripe_subscription_id text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'suppliers' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN subscription_status text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'suppliers' AND column_name = 'subscription_current_period_end'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN subscription_current_period_end timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'suppliers' AND column_name = 'subscription_cancel_at_period_end'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN subscription_cancel_at_period_end boolean DEFAULT false;
  END IF;
END $$;

-- Create index for subscription queries
CREATE INDEX IF NOT EXISTS idx_suppliers_stripe_customer_id ON suppliers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_subscription_status ON suppliers(subscription_status);

-- Update the slabs insert policy to require active subscription
DROP POLICY IF EXISTS "Suppliers can create own slabs" ON slabs;
CREATE POLICY "Suppliers can create own slabs"
  ON slabs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM suppliers
      WHERE suppliers.id = slabs.supplier_id
      AND suppliers.user_id = auth.uid()
      AND (
        suppliers.subscription_status = 'active'
        OR suppliers.subscription_status = 'trialing'
      )
    )
  );
