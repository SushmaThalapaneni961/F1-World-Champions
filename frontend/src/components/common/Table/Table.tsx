import * as React from 'react';
import type { SortConfig } from '../../../hooks/useSort';
import './Table.scss';

export interface Column<T> {
  header: string;
  accessor: string;
  render: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  rowClassName?: (item: T) => string | undefined;
}

export function Table<T>({ 
  columns, 
  data, 
  onRowClick, 
  sortConfig, 
  onSort,
  rowClassName 
}: TableProps<T>) {
  const renderCell = (item: T, column: Column<T>) => {
    return column.render(item);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                onClick={() => onSort?.(column.accessor)}
                className={onSort ? 'sortable' : ''}
              >
                {column.header}
                {onSort && (
                  <span className="sort-icon">
                    {getSortIcon(column.accessor)}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={`${onRowClick ? 'clickable' : ''} ${rowClassName?.(item) || ''}`}
            >
              {columns.map((column) => (
                <td key={column.accessor}>{renderCell(item, column)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 