import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useSort<T>(items: T[] | null | undefined, defaultSort?: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(defaultSort);

  const sortedItems = useMemo(() => {
    if (!items) return [];
    if (!sortConfig) return items;

    return [...items].sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction: SortDirection = 'asc';

    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  return {
    items: sortedItems,
    sortConfig,
    requestSort,
  };
}
