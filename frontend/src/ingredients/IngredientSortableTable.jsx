import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export default function IngredientSortableTable({ title, columns, rows, emptyMessage }) {
  const [sortBy, setSortBy] = useState(columns[0]?.key || '');
  const [direction, setDirection] = useState('asc');

  const sortedRows = useMemo(() => {
    if (!sortBy) return rows;
    const next = [...rows].sort((a, b) => {
      const first = a?.[sortBy];
      const second = b?.[sortBy];

      const parsedFirst = Number(first);
      const parsedSecond = Number(second);

      if (!Number.isNaN(parsedFirst) && !Number.isNaN(parsedSecond)) {
        if (direction === 'asc') {
          return parsedFirst - parsedSecond;
        }
        return parsedSecond - parsedFirst;
      }

      const textA = String(first ?? '').toLowerCase();
      const textB = String(second ?? '').toLowerCase();
      if (textA < textB) {
        if (direction === 'asc') return -1;
        return 1;
      }
      if (textA > textB) {
        if (direction === 'asc') return 1;
        return -1;
      }
      return 0;
    });

    return next;
  }, [rows, sortBy, direction]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setDirection((prev) => {
        if (prev === 'asc') return 'desc';
        return 'asc';
      });
      return;
    }
    setSortBy(key);
    setDirection('asc');
  };

  const getSortIndicator = (columnKey) => {
    if (sortBy !== columnKey) return ' ↕';
    if (direction === 'asc') return ' ↑';
    return ' ↓';
  };

  return (
    <section className="ingredient-table-card page-card">
      <div className="ingredient-table-head">
        <h5>{title}</h5>
      </div>
      <div className="ingredient-table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} onClick={() => handleSort(column.key)}>
                  {column.label}
                  {getSortIndicator(column.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>{emptyMessage}</td>
              </tr>
            ) : null}
            {sortedRows.map((row) => (
              <tr key={row.id || `${row.type}-${row.date}-${row.detail}`}>
                {columns.map((column) => (
                  <td key={column.key}>{row[column.key] ?? '-'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

IngredientSortableTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyMessage: PropTypes.string
};

IngredientSortableTable.defaultProps = {
  emptyMessage: 'No records found.'
};
