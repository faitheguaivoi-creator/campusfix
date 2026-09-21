export default function Table({ columns, rows, loading, empty }) {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-4 border-lincoln-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return <div className="p-8 text-center text-gray-500 text-sm">{empty || 'No records found.'}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase tracking-wide ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-gray-50 transition">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}