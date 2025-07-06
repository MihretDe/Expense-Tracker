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
    <div className=" text-black overflow-x-auto p-4 bg-white rounded-lg shadow space-y-4">
      {enableFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {table.getAllColumns().map((column) =>
            column.getCanFilter() ? (
              <div key={column.id}>
                <label className="text-xs text-gray-500 w-auto">
                  {column.columnDef.header as string}
                </label>
                <input
                  type="text"
                  placeholder={`Filter ${column.columnDef.header}`}
                  value={(column.getFilterValue() ?? "") as string}
                  onChange={(e) => column.setFilterValue(e.target.value)}
                  className="w-full border px-2 py-1 rounded text-sm"
                />
              </div>
            ) : null
          )}
        </div>
      )}
      <table className="w-full min-w-[600px] text-sm text-gray-800 ">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border text-center font-medium"
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
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between p-4 text-sm">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
