import React from 'react';

export const Table = ({ headers, data, keyField = 'id', emptyMessage = 'No records found.' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-dark-border bg-dark-card/25 backdrop-blur-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dark-border bg-dark-card/60">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-text"
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border/40">
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-10 text-center text-sm text-muted-text">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row[keyField] || idx}
                className="hover:bg-white/[0.01] transition-all duration-150"
              >
                {headers.map((h, i) => (
                  <td key={i} className="px-6 py-4.5 text-sm text-white/90">
                    {h.render ? h.render(row) : (row[h.key] !== undefined ? row[h.key] : '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
