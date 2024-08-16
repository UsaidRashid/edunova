import React, { useState, useMemo, useEffect } from "react";
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
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

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

  const filteredData = useMemo(() => {
    let result = data;

    if (search) {
      const lowercasedSearch = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowercasedSearch)
        )
      );
    }

    if (selectedRole) {
      result = result.filter((row) => row.role === selectedRole);
    }

    if (selectedTeam) {
      result = result.filter((row) => row.teams.includes(selectedTeam));
    }

    return result;
  }, [data, search, selectedRole, selectedTeam]);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pageIndex, pageSize]);

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

  const toggleFilter = () => setFilterVisible(!filterVisible);

  const toggleRoleDropdown = () => setShowRoleDropdown(!showRoleDropdown);
  const toggleTeamDropdown = () => setShowTeamDropdown(!showTeamDropdown);

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-2 relative">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mr-2 p-1 border border-gray-300"
          />
          <button
            onClick={toggleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Filter
          </button>
          {filterVisible && (
            <div className="absolute bg-white border border-gray-300 mt-2 p-4 rounded shadow-lg">
              <div className="mb-4">
                <button
                  onClick={toggleRoleDropdown}
                  className="text-blue-500 block w-full text-left"
                >
                  Roles
                </button>
                {showRoleDropdown && (
                  <div className="mt-2 border border-gray-300 rounded bg-white">
                    <button
                      onClick={() => setSelectedRole("Product Designer")}
                      className="block px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Product Designer
                    </button>
                    <button
                      onClick={() => setSelectedRole("Product Manager")}
                      className="block px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Product Manager
                    </button>
                    <button
                      onClick={() => setSelectedRole("Frontend Developer")}
                      className="block px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Frontend Developer
                    </button>
                    <button
                      onClick={() => setSelectedRole("Backend Developer")}
                      className="block px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Backend Developer
                    </button>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={toggleTeamDropdown}
                  className="text-blue-500 block w-full text-left"
                >
                  Teams
                </button>
                {showTeamDropdown && (
                  <div className="mt-2 border border-gray-300 rounded bg-white">
                    <button
                      onClick={() => setSelectedTeam("Design")}
                      className="block px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Design
                    </button>
                    <button
                      onClick={() => setSelectedTeam("Product")}
                      className="block px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Product
                    </button>
                    <button
                      onClick={() => setSelectedTeam("Marketing")}
                      className="block px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Marketing
                    </button>
                    <button
                      onClick={() => setSelectedTeam("Technology")}
                      className="block px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Technology
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <table className="min-w-full">
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
        <div className="pagination mt-4">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="mr-1"
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="mr-1"
          >
            {"<"}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="mr-1"
          >
            {">"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <span className="ml-2">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
