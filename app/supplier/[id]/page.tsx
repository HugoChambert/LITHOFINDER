import SupplierContent from './supplier-content';

export const dynamic = 'force-dynamic';

export default function SupplierProfilePage({ params }: { params: { id: string } }) {
  return <SupplierContent id={params.id} />;
}
