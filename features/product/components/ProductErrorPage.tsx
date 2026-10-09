'use client';

import ErrorWithRetry from "@/components/ui/ErrorWithRetry";

export default function ProductErrorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorWithRetry 
        onRetry={() => window.location.reload()} 
      />
    </div>
  );
}
