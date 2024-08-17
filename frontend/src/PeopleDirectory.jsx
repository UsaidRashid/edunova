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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faPlus,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import AddUser from "./AddUser";
import UserDetailsSidebar from "./UserDetailsSidebar";
import EditUser from "./EditUser";

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
    cell: (info) => {
      const status = info.getValue();
      const statusColor = status === "Active" ? "bg-green-500" : "bg-red-500";
      const textColor = status === "Active" ? "text-green-700" : "text-red-700";

      return (
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${textColor} border-${statusColor}`}
        >
          <span className={`block w-3 h-3 rounded-full ${statusColor}`}></span>
          <span>{status}</span>
        </div>
      );
    },
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
    cell: (info) => {
      const teams = info.getValue();
      const borderColors = [
        "border-purple-500",
        "border-light-blue-500",
        "border-blue-900",
        "border-black",
      ];
      const textColors = [
        "text-purple-500",
        "text-light-blue-500",
        "text-blue-900",
        "text-black",
      ];

      return (
        <div className="flex space-x-2">
          {teams.map((team, index) => (
            <div
              key={team}
              className={`flex items-center justify-center px-3 py-1 rounded-full border ${
                borderColors[index % borderColors.length]
              } ${textColors[index % textColors.length]}`}
              style={{ backgroundColor: "white" }}
            >
              {team}
            </div>
          ))}
        </div>
      );
    },
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
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEditUser, setEditSelectedUser] = useState(null);
  const [openEditUser, setOpenEditUser] = useState(false);

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

  const DeleteConfirmationPopup = ({ onClose, onDelete }) => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-lg font-semibold mb-4">Delete Member Details</h3>
        <p className="mb-4">
          Are you sure you want to delete this member details? This action
          cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const handleDeleteClick = (user) => {
    console.log(user);
    setUserToDelete(user._id);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await axios.post(api + "delete-user", {
          _id: userToDelete,
        });
        if (response.status === 200) {
          alert("User Deleted Successfully");
          setUserToDelete(null);
          setShowDeletePopup(false);
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
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(role)
        ? prevSelectedRoles.filter((r) => r !== role)
        : [...prevSelectedRoles, role]
    );
  };

  const handleTeamSelection = (team) => {
    setSelectedTeams((prevSelectedTeams) =>
      prevSelectedTeams.includes(team)
        ? prevSelectedTeams.filter((t) => t !== team)
        : [...prevSelectedTeams, team]
    );
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

    if (selectedRoles.length > 0) {
      result = result.filter((row) => selectedRoles.includes(row.role));
    }

    if (selectedTeams.length > 0) {
      result = result.filter((row) =>
        row.teams.some((team) => selectedTeams.includes(team))
      );
    }

    return result;
  }, [data, search, selectedRoles, selectedTeams]);

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
      <div className="p-2 relative w-full">
        {openAddUser ? (
          <AddUser />
        ) : openEditUser ? (
          <EditUser
            user={selectedEditUser}
            onClose={() => setEditSelectedUser(null)}
          />
        ) : (
          <>
            <nav class="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-md">
              <div class="flex items-center">
                <h2 class="text-lg font-bold">Team members</h2>
                <span class="ml-2 px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                  {data.length} users
                </span>
              </div>
              <div class="flex items-center">
                <div class="relative w-64">
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <button
                  onClick={toggleFilter}
                  class="ml-4 px-4 py-2 rounded-md bg-indigo-500 text-white font-medium hover:bg-indigo-600 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faFilter} />
                </button>
                <button
                  onClick={() => setOpenAddUser(true)}
                  class="ml-4 px-4 py-2 rounded-md bg-indigo-500 text-white font-medium hover:bg-indigo-600 focus:outline-none"
                >
                  <span class="flex items-center">
                    <FontAwesomeIcon icon={faPlus} />
                    <span class="ml-2">ADD MEMBER</span>
                  </span>
                </button>
              </div>
              {filterVisible && (
                <div className="absolute bg-white border border-gray-300 mt-2 p-4 rounded-lg shadow-lg top-16 right-52 w-64">
                  {/* Role Filter */}
                  <div className="mb-4">
                    <button
                      onClick={toggleRoleDropdown}
                      className="text-blue-500 block w-full text-left p-2 rounded-lg hover:bg-gray-100 flex justify-between items-center"
                    >
                      Roles
                      <span>{showRoleDropdown ? "▲" : "▼"}</span>
                    </button>
                    {showRoleDropdown && (
                      <div className="mt-2 border border-gray-300 rounded-lg bg-white max-h-40 overflow-y-auto">
                        {[
                          "Product Designer",
                          "Product Manager",
                          "Frontend Developer",
                          "Backend Developer",
                        ].map((role) => (
                          <label
                            key={role}
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            <input
                              type="checkbox"
                              value={role}
                              checked={selectedRoles.includes(role)}
                              onChange={() => handleRoleSelection(role)}
                              className="mr-2"
                            />
                            {role}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={toggleTeamDropdown}
                      className="text-blue-500 block w-full text-left p-2 rounded-lg hover:bg-gray-100 flex justify-between items-center"
                    >
                      Teams
                      <span>{showTeamDropdown ? "▲" : "▼"}</span>
                    </button>
                    {showTeamDropdown && (
                      <div className="mt-2 border border-gray-300 rounded-lg bg-white max-h-40 overflow-y-auto">
                        {["Design", "Product", "Marketing", "Technology"].map(
                          (team) => (
                            <label
                              key={team}
                              className="block px-4 py-2 hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                value={team}
                                checked={selectedTeams.includes(team)}
                                onChange={() => handleTeamSelection(team)}
                                className="mr-2"
                              />
                              {team}
                            </label>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </nav>

            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={() =>
                          table.getColumn(header.id).toggleSorting()
                        }
                        className="px-4 py-2 text-left text-gray-600 cursor-pointer"
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
                  <tr key={row.id} className="hover:bg-gray-100">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 text-left text-gray-600"
                        onClick={() => setSelectedUser(row.original)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-left text-gray-600">
                      <button
                        onClick={() => handleDeleteClick(row.original)}
                        className=" px-4 py-2 rounded-lg"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                    <td className="px-4 py-2 text-left text-gray-600">
                      <button
                        onClick={() => {
                          setEditSelectedUser(row.original);
                          setOpenEditUser(true);
                        }}
                        className=" px-4 py-2 rounded-lg"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination mt-4 flex justify-center">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="mr-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="mr-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4"
              >
                {"<"}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="mr-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4"
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
              >
                {">>"}
              </button>
              <span className="ml-2 text-gray-600">
                Page{" "}
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </span>
            </div>
          </>
        )}

        {showDeletePopup && (
          <DeleteConfirmationPopup
            onClose={() => setShowDeletePopup(false)}
            onDelete={handleConfirmDelete}
          />
        )}
        {selectedUser && (
          <UserDetailsSidebar
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
}
