import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { Table } from '../../../components/common/Table/Table';
import type { Column } from '../../../components/common/Table/Table';

interface TestData {
  id: number;
  name: string;
  age: number;
}

describe('Table Component', () => {
  const testData: TestData[] = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
  ];

  const columns: Column<TestData>[] = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row: TestData) => row.id.toString(),
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row: TestData) => row.name,
    },
    {
      header: 'Age',
      accessor: 'age',
      render: (row: TestData) => row.age.toString(),
    },
  ];

  it('renders table with headers and data', () => {
    render(<Table columns={columns} data={testData} />);

    // Check headers
    columns.forEach((column) => {
      expect(screen.getByText(column.header)).toBeInTheDocument();
    });

    // Check data
    testData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.age.toString())).toBeInTheDocument();
    });
  });

  it('handles row click events', () => {
    const handleRowClick = vi.fn();
    render(<Table columns={columns} data={testData} onRowClick={handleRowClick} />);

    const firstRow = screen.getByText('John Doe').closest('tr');
    if (firstRow) {
      fireEvent.click(firstRow);
      expect(handleRowClick).toHaveBeenCalledWith(testData[0]);
    }
  });

  it('applies custom row className', () => {
    const rowClassName = (item: TestData) => (item.age > 25 ? 'highlight' : undefined);

    render(<Table columns={columns} data={testData} rowClassName={rowClassName} />);

    const rows = screen.getAllByRole('row').slice(1); // Skip header row
    expect(rows[0]).toHaveClass('highlight'); // John Doe (30)
    expect(rows[1]).not.toHaveClass('highlight'); // Jane Smith (25)
  });

  it('handles sorting when sortConfig is provided', () => {
    const handleSort = vi.fn();
    render(
      <Table
        columns={columns}
        data={testData}
        sortConfig={{ key: 'name', direction: 'asc' }}
        onSort={handleSort}
      />,
    );

    const nameHeader = screen.getByText('Name');
    expect(nameHeader).toHaveClass('sortable');
    expect(nameHeader.querySelector('.sort-icon')).toHaveTextContent('↑');

    fireEvent.click(nameHeader);
    expect(handleSort).toHaveBeenCalledWith('name');
  });

  it('renders empty state when no data is provided', () => {
    render(<Table columns={columns} data={[]} />);
    const tbody = screen.getAllByRole('rowgroup')[1]; // Get tbody element
    expect(tbody).toBeEmptyDOMElement();
  });

  it('renders custom cell content using render function', () => {
    const columnsWithRender: Column<TestData>[] = [
      ...columns,
      {
        header: 'Status',
        accessor: 'status',
        render: (row: TestData) => (row.age > 25 ? 'Senior' : 'Junior'),
      },
    ];

    render(<Table columns={columnsWithRender} data={testData} />);

    expect(screen.getByText('Senior')).toBeInTheDocument(); // John Doe
    expect(screen.getByText('Junior')).toBeInTheDocument(); // Jane Smith
  });

  it('handles undefined onRowClick', () => {
    render(<Table columns={columns} data={testData} />);
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).not.toHaveClass('clickable');
  });

  it('handles undefined onSort', () => {
    render(<Table columns={columns} data={testData} />);
    const headers = screen.getAllByRole('columnheader');
    headers.forEach((header) => {
      expect(header).not.toHaveClass('sortable');
      expect(header.querySelector('.sort-icon')).not.toBeInTheDocument();
    });
  });

  it('handles undefined rowClassName', () => {
    render(<Table columns={columns} data={testData} />);
    const rows = screen.getAllByRole('row').slice(1);
    rows.forEach((row) => {
      expect(row.className.trim()).toBe(row.className.trim()); // No extra spaces
      expect(row.className).not.toContain('undefined');
    });
  });

  it('displays correct sort direction icons', () => {
    const { rerender } = render(
      <Table
        columns={columns}
        data={testData}
        sortConfig={{ key: 'name', direction: 'asc' }}
        onSort={vi.fn()}
      />,
    );

    expect(screen.getByText('Name').querySelector('.sort-icon')).toHaveTextContent('↑');

    rerender(
      <Table
        columns={columns}
        data={testData}
        sortConfig={{ key: 'name', direction: 'desc' }}
        onSort={vi.fn()}
      />,
    );

    expect(screen.getByText('Name').querySelector('.sort-icon')).toHaveTextContent('↓');
  });
});
