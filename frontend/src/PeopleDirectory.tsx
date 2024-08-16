import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Sidebar from "./Sidebar";

type Person = {
  Name: string;
  status: string;
  role: string;
  email: string;
  teams: string[];
};

const defaultData: Person[] = [
  {
    Name: "Tanner Linsley",
    status: "In Relationship",
    role: "Developer",
    email: "tanner.linsley@example.com",
    teams: ["Frontend", "Backend"],
  },
  {
    Name: "Tandy Miller",
    status: "Single",
    role: "Designer",
    email: "tandy.miller@example.com",
    teams: ["Design"],
  },
  {
    Name: "Joe Dirte",
    status: "Complicated",
    role: "Manager",
    email: "joe.dirte@example.com",
    teams: ["Management", "Operations"],
  },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("Name", {
    header: () => <span>Name</span>,
    cell: (info) => <span>{info.getValue()}</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: () => <span>Status</span>,
    cell: (info) => <span>{info.getValue()}</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("role", {
    header: () => <span>Role</span>,
    cell: (info) => <span>{info.getValue()}</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("email", {
    header: () => <span>Email</span>,
    cell: (info) => <a href={`mailto:${info.getValue()}`}>{info.getValue()}</a>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("teams", {
    header: () => <span>Teams</span>,
    cell: (info) => (
      <ul>
        {info.getValue().map((team) => (
          <li key={team}>{team}</li>
        ))}
      </ul>
    ),
    footer: (info) => info.column.id,
  }),
];

export default function PeopleDirectory() {
  const [data, _setData] = React.useState(() => [...defaultData]);
  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-2">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        <div className="h-4" />
        <button onClick={() => rerender()} className="border p-2">
          Rerender
        </button>
      </div>
    </div>
  );
}
