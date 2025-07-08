"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableFilters?: boolean;
}

export default function Table<TData>({
  data,
  columns,
  enableFilters,
}: TableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <div className="overflow-x-auto p-4 bg-white dark:bg-black rounded-lg shadow space-y-4 text-black dark:text-gray-100">
      {enableFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {table.getAllColumns().map((column) =>
            column.getCanFilter() ? (
              <div key={column.id}>
                <label className="text-xs text-gray-500 dark:text-gray-300 w-auto">
                  {column.columnDef.header as string}
                </label>
                <input
                  type="text"
                  placeholder={`Filter ${column.columnDef.header}`}
                  value={(column.getFilterValue() ?? "") as string}
                  onChange={(e) => column.setFilterValue(e.target.value)}
                  className="w-full border px-2 py-1 rounded text-sm bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-600 focus:dark:border-green-400"
                />
              </div>
            ) : null
          )}
        </div>
      )}
      <table className="w-full min-w-[600px] text-sm text-gray-800 dark:text-gray-100">
        <thead className="bg-gray-100 dark:bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border text-center font-medium text-black dark:text-gray-100"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`px-4 py-2 border text-center ${
                    cell.column.id === "date" || cell.column.id === "action"
                      ? "text-gray-900 dark:text-gray-100"
                      : "dark:text-gray-100"
                  }`}
                >
                  <span className="text-gray-900 dark:text-gray-100">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between p-4 text-sm">
        <div className="dark:text-gray-100">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
