-- LITHOFINDER Database Schema
-- Creates the complete database structure for LITHOFINDER

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  address text,
  city text,
  state text,
  zip_code text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create slabs table
CREATE TABLE IF NOT EXISTS slabs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  slab_name text NOT NULL,
  material text NOT NULL,
  color text,
  finish text,
  thickness text,
  image_url text,
  quantity_available integer DEFAULT 1,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_slabs_supplier_id ON slabs(supplier_id);
CREATE INDEX IF NOT EXISTS idx_slabs_material ON slabs(material);
CREATE INDEX IF NOT EXISTS idx_slabs_finish ON slabs(finish);
CREATE INDEX IF NOT EXISTS idx_slabs_thickness ON slabs(thickness);
CREATE INDEX IF NOT EXISTS idx_slabs_slab_name ON slabs(slab_name);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_city ON suppliers(city);
CREATE INDEX IF NOT EXISTS idx_suppliers_state ON suppliers(state);

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE slabs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for suppliers table
-- Public can read all suppliers
CREATE POLICY "Public can view suppliers"
  ON suppliers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can create their own supplier profile
CREATE POLICY "Users can create own supplier profile"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own supplier profile
CREATE POLICY "Users can update own supplier profile"
  ON suppliers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own supplier profile
CREATE POLICY "Users can delete own supplier profile"
  ON suppliers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for slabs table
-- Public can read all slabs
CREATE POLICY "Public can view slabs"
  ON slabs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can create slabs for their supplier
CREATE POLICY "Suppliers can create own slabs"
  ON slabs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM suppliers
      WHERE suppliers.id = slabs.supplier_id
      AND suppliers.user_id = auth.uid()
    )
  );

-- Suppliers can update their own slabs
CREATE POLICY "Suppliers can update own slabs"
  ON slabs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM suppliers
      WHERE suppliers.id = slabs.supplier_id
      AND suppliers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM suppliers
      WHERE suppliers.id = slabs.supplier_id
      AND suppliers.user_id = auth.uid()
    )
  );

-- Suppliers can delete their own slabs
CREATE POLICY "Suppliers can delete own slabs"
  ON slabs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM suppliers
      WHERE suppliers.id = slabs.supplier_id
      AND suppliers.user_id = auth.uid()
    )
  );
