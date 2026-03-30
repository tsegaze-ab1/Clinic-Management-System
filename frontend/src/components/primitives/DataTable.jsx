import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

export default function DataTable({ columns, rows, total = 0, loading, onQueryChange }) {
  const [query, setQuery] = useState({ page: 1, pageSize: 10, sortBy: '', sortOrder: 'asc', search: '' });

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / query.pageSize)), [total, query.pageSize]);

  const update = (partial) => {
    const next = { ...query, ...partial };
    setQuery(next);
    onQueryChange(next);
  };

  return (
    <div className="page-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
        <input
          aria-label="search table"
          className="form-control"
          placeholder="Search"
          value={query.search}
          onChange={(e) => update({ search: e.target.value, page: 1 })}
        />
        <select className="form-select" style={{ maxWidth: 120 }} value={query.pageSize} onChange={(e) => update({ pageSize: Number(e.target.value) })}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {loading ? <LoadingSkeleton height={200} /> : null}
      {!loading && rows.length === 0 ? <EmptyState title="No results" subtitle="Try a broader filter or search term." /> : null}

      {!loading && rows.length > 0 ? (
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => update({ sortBy: col.key, sortOrder: query.sortOrder === 'asc' ? 'desc' : 'asc' })}
                    >
                      {col.label}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <span>
          Page {query.page} of {totalPages}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline-secondary btn-sm" disabled={query.page <= 1} onClick={() => update({ page: query.page - 1 })}>
            Prev
          </button>
          <button className="btn btn-outline-secondary btn-sm" disabled={query.page >= totalPages} onClick={() => update({ page: query.page + 1 })}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, label: PropTypes.string, render: PropTypes.func })).isRequired,
  rows: PropTypes.array.isRequired,
  total: PropTypes.number,
  loading: PropTypes.bool,
  onQueryChange: PropTypes.func
};
