import { createBuildClient } from '@/lib/supabase/build-client';
import SupplierContent from './supplier-content';

// Pre-renders a page for every supplier ID at build time.
// New suppliers added after a deploy will still load via client-side fetch
// but won't have a pre-rendered HTML shell until the next build.
export async function generateStaticParams() {
  try {
    const supabase = createBuildClient();
    const { data: suppliers } = await supabase
      .from('suppliers')
      .select('id');

    return (suppliers || []).map((s) => ({ id: s.id }));
  } catch {
    // If Supabase is unreachable at build time, return empty array
    // (pages will still work client-side)
    return [];
  }
}

export default function SupplierProfilePage({ params }: { params: { id: string } }) {
  return <SupplierContent id={params.id} />;
}
