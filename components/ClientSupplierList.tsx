'use client';

import { useState, useMemo } from 'react';
import SupplierCard from '@/components/SupplierCard';
import SupplierFilters, { SortOption } from '@/components/SupplierFilters';
import { Supplier } from '@/context/MockDataContext';

// We need to import the server action result type or just use the interface from MockDataContext
// Since this is a client component now (due to useState), we need to handle data fetching differently 
// or pass data as props from a server component wrapper.
// HOWEVER, to keep it simple and given the previous file was a server component:
// I will keep the main logic in a client component and wrap it or just make page.tsx a client component 
// that takes initial data if I can, OR just make it a client component that fetches data?
// The previous page.tsx was async server component using `readCatalog`.
// To use `useState` for sorting, I must make it a client component.
// So I will convert this page to use initial data passed effectively, 
// BUT `readCatalog` is a server action.
// Better approach: Keep page.tsx as server component, fetch data, and pass to a new ClientSupplierList component.

// I'll create ClientSupplierList inside this file or separately.
// Let's create `components/ClientSupplierList.tsx` to handle the sorting and filtering state.

export default function ClientSupplierList({ initialSuppliers }: { initialSuppliers: Supplier[] }) {
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const sortedSuppliers = useMemo(() => {
    const sorted = [...initialSuppliers];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => {
          const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
          const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
          return dateB - dateA;
        });
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'orders':
        return sorted.sort((a, b) => {
            const ordersA = a.totalOrders ?? a.completedDeals ?? 0;
            const ordersB = b.totalOrders ?? b.completedDeals ?? 0;
            return ordersB - ordersA;
        });
      case 'subscribers':
        return sorted.sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0));
      case 'sku':
        return sorted.sort((a, b) => (b.skuCount || 0) - (a.skuCount || 0));
      default:
        return sorted;
    }
  }, [initialSuppliers, sortBy]);

  return (
    <>
      <SupplierFilters currentSort={sortBy} onSortChange={setSortBy} />
      
      <div className="flex flex-col gap-6">
        {sortedSuppliers.map((supplier) => (
          <SupplierCard 
            key={supplier.id}
            {...supplier}
          />
        ))}
      </div>
    </>
  );
}
