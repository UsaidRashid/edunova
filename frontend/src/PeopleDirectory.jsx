import React, { useState, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Sidebar from "./Sidebar";
import axios from "axios";

const api = import.meta.env.VITE_BACKEND_API;

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("name", {
    header: () => <span>Name</span>,
    cell: (info) => <span>{info.getValue()}</span>,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor("status", {
    header: () => <span>Status</span>,
    cell: (info) => <span>{info.getValue()}</span>,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor("role", {
    header: () => <span>Role</span>,
    cell: (info) => <span>{info.getValue()}</span>,
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor("email", {
    header: () => <span>Email</span>,
    cell: (info) => <a href={`mailto:${info.getValue()}`}>{info.getValue()}</a>,
    footer: (info) => info.column.id,
    enableSorting: true,
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
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(api + "fetch-users");
        if (response.status === 200) {
          setData(response.data.users);
          const totalItems = response.data.users.length;
          setTotalPages(Math.ceil(totalItems / pageSize));
        } else {
          alert(response.data.message || "Error Fetching Users");
        }
      } catch (error) {
        console.error("Error Fetching Users", error);
        alert("Error fetching users");
      }
    };
    fetchData();
  }, [pageIndex, pageSize]);

  const handleDelete = async (_id) => {
    try {
      const response = await axios.post(api + "delete-user", { _id });
      if (response.status === 200) {
        alert("User Deleted Successfully");
        window.location.reload();
      } else {
        alert(response.data.message || "Error Deleting User");
      }
    } catch (error) {
      console.error("Error Deleting User", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(api + "add-user");
      if (response.status === 200) {
        alert("User Added Successfully");
        window.location.reload();
      } else {
        alert(response.data.message || "Error Adding User");
      }
    } catch (error) {
      console.error("Error Adding User", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(api + "edit-user");
      if (response.status === 200) {
        alert("User Edited Successfully");
        window.location.reload();
      } else {
        alert(response.data.message || "Error Editing User");
      }
    } catch (error) {
      console.error("Error Editing User", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const paginatedData = React.useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, pageIndex, pageSize]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
    },
    onPaginationChange: (updater) => {
      const newState = updater({
        pageIndex,
        pageSize,
      });
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    onSortingChange: setSorting,
    manualPagination: true,
    pageCount: totalPages,
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
                  <th
                    key={header.id}
                    onClick={() => table.getColumn(header.id).toggleSorting()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {/* Add sorting indicators */}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() === "asc"
                        ? " 🔼"
                        : " 🔽"
                      : null}
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
                <td>
                  <button onClick={() => handleDelete(row.original._id)}>
                    Delete
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEditUser(row.original)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <span>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
