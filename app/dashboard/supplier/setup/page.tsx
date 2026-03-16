import { Suspense } from 'react';
import SetupContent from './setup-content';

export default function SupplierSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}
