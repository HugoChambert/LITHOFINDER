export interface Supplier {
  id: string;
  user_id: string;
  business_name: string;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  subscription_cancel_at_period_end: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Slab {
  id: string;
  supplier_id: string;
  slab_name: string;
  material: string;
  color: string | null;
  finish: string | null;
  thickness: string | null;
  image_url: string | null;
  quantity_available: number;
  description: string | null;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
}

export type Material = 'Quartzite' | 'Granite' | 'Marble' | 'Quartz';
export type Finish = 'Honed' | 'Polished' | 'Leathered';
export type Thickness = '2cm' | '3cm';
