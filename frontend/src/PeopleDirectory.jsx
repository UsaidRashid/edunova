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
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddUser from "./AddUser";
import UserDetailsSidebar from "./UserDetailsSidebar";
import EditUser from "./EditUser";
import filter from "./filter.svg";
import profile from "./profile.png";

const api = import.meta.env.VITE_BACKEND_API;

const columnHelper = createColumnHelper();

const predefinedOrder = ["Design", "Product", "Marketing", "Technology"];

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
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageIndex, pageSize]);

  useEffect(() => {
    if (search) {
      const query = search;
      window.history.replaceState(
        null,
        "",
        `/people-directory?query=${encodeURIComponent(query)}`
      );
    } else {
      window.history.replaceState(null, "", `/people-directory`);
    }
  }, [search]);

  useEffect(() => {
    if (selectedRoles && selectedRoles.length > 0) {
      const query = selectedRoles;
      window.history.replaceState(
        null,
        "",
        `/people-directory?query=${encodeURIComponent(query)}`
      );
    } else {
      window.history.replaceState(null, "", `/people-directory`);
    }
  }, [selectedRoles]);

  useEffect(() => {
    if (selectedTeams && selectedTeams.length > 0) {
      const query = selectedTeams;
      window.history.replaceState(
        null,
        "",
        `/people-directory?query=${encodeURIComponent(query)}`
      );
    } else {
      window.history.replaceState(null, "", `/people-directory`);
    }
  }, [selectedTeams]);

  useEffect(() => {
    if (selectedUser) {
      const query = selectedUser.name;
      window.history.replaceState(
        null,
        "",
        `/people-directory?query=${encodeURIComponent(query)}`
      );
    } else {
      window.history.replaceState(null, "", `/people-directory`);
    }
  }, [selectedUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const columns = [
    columnHelper.accessor("name", {
      header: () => <span>Name</span>,
      cell: (info) => {
        const name = info.getValue();
        const profilePic = info.row.original.profilePic;

        return (
          <div className="flex items-center space-x-3">
            <img
              src={profilePic || profile}
              alt={`${name}`}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profile;
              }}
            />

            <div>
              <div className="font-semibold text-gray-800">{name}</div>

              <div className="text-gray-500 text-sm">
                @{name.split(" ")[0].toLowerCase()}
              </div>
            </div>
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("status", {
      header: () => <span>Status</span>,
      cell: (info) => {
        const status = info.getValue();
        const statusColor = status === "Active" ? "bg-green-500" : "bg-red-500";
        const textColor =
          status === "Active" ? "text-green-700" : "text-red-700";

        return (
          <div
            className={`flex items-center space-x-1 rounded border text-black`}
          >
            <span className={`mx-2 w-2 h-2 rounded-full ${statusColor}`}></span>
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
      cell: (info) => {
        const email = info.getValue();
        // const isSelected = info.row.id === selectedRowId;
        // const dob = info.row.original.dob;
        // const contact = info.row.original.contact;

        // if (isSelected) {
        //   return (
        //     <div className="space-y-2">
        //       <div>
        //         <strong>DOB:</strong> {formatDate(dob)}
        //       </div>
        //       <div>
        //         <strong>Contact:</strong> {contact}
        //       </div>
        //     </div>
        //   );
        // }

        return <a href={`mailto:${email}`}>{email}</a>;
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("teams", {
      header: () => <span>Teams</span>,
      cell: (info) => {
        // const isSelected = info.row.id === selectedRowId;
        // const gender = info.row.original.gender;
        // const nationality = info.row.original.nationality;

        // if (isSelected) {
        //   return (
        //     <div className="space-y-2">
        //       <div>
        //         <strong>Gender:</strong> {gender}
        //       </div>
        //       <div>
        //         <strong>Nationality:</strong> {nationality}
        //       </div>
        //     </div>
        //   );
        // }

        const teams = info.getValue();
        const sortedTeams = teams.sort(
          (a, b) => predefinedOrder.indexOf(a) - predefinedOrder.indexOf(b)
        );
        const borderColors = [
          "border-purple-300",
          "border-blue-300",
          "border-blue-500",
          "border-gray-300",
        ];
        const textColors = [
          "text-purple-500",
          "text-blue-500",
          "text-indigo-500",
          "text-black-900",
        ];

        return (
          <div className="flex space-x-2">
            {sortedTeams.map((team, index) => (
              <div
                key={team}
                className={`flex items-center justify-center px-3 py-1 rounded-full border font-semibold ${
                  borderColors[index % borderColors.length]
                } ${textColors[index % textColors.length]}`}
                style={{ backgroundColor: "white" }}
              >
                {sortedTeams.length == 4 && team === "Technology" ? "+4" : team}
              </div>
            ))}
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
  ];

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

  const handleRowClick = (rowId) => {
    setSelectedRowId(rowId === selectedRowId ? null : rowId);
  };

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
        ) : loading ? (
          <div className=" text-3xl">Fetching Data Please wait...</div>
        ) : data && data.length > 0 ? (
          <div className="border rounded-md">
            <nav class="flex justify-between items-center p-4">
              <div class="flex items-center">
                <h2 class="text-lg font-semibold">Team members</h2>
                <span
                  class="ml-2 px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "#e9d5ff", color: "#6d47c7" }}
                >
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
                    class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:ring-2 focus:ring-opacity-50 focus:outline-none bg-purple-50 border-b-black"
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600">
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
                  class="ml-4 py-2 rounded-md font-medium focus:outline-none"
                >
                  <img src={filter} alt="" srcset="" />
                </button>
                <button
                  onClick={() => setOpenAddUser(true)}
                  class="ml-4 px-4 py-2 rounded-md text-white font-medium hover:bg-indigo-600 focus:outline-none"
                  style={{ backgroundColor: "#6941c6" }}
                >
                  <span class="flex items-center">
                    <FontAwesomeIcon icon={faPlus} />
                    <span class="ml-2">ADD MEMBER</span>
                  </span>
                </button>
              </div>
              {filterVisible && (
                <div className="absolute bg-white border border-gray-300 mt-2 p-4 rounded-lg shadow-lg top-16 right-52 w-64">
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

            <table className="w-full table-auto">
              <thead className="bg-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={() =>
                          table.getColumn(header.id).toggleSorting()
                        }
                        className="px-4 py-2 text-left text-gray-500 font-semibold cursor-pointer"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <i class="fa-solid fa-arrow-up mx-2"></i>
                          ) : (
                            <i class="fa-solid fa-arrow-down mx-2"></i>
                          )
                        ) : header.column.columnDef.accessorKey === "role" ? (
                          <i className="fa-regular fa-circle-question mx-2"></i>
                        ) : null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-100 border odd:bg-purple-50 even:bg-white"
                    onClick={() => handleRowClick(row.id)}
                  >
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
                    <td className="text-right text-gray-600">
                      <button
                        onClick={() => handleDeleteClick(row.original)}
                        className="p-2 rounded-lg"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="text-left text-gray-600">
                      <button
                        onClick={() => {
                          setEditSelectedUser(row.original);
                          setOpenEditUser(true);
                        }}
                        className="p-2 rounded-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#6b7280"
                        >
                          <path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Zm620.38-570.15-50.23-50.23 50.23 50.23Zm-126.13 75.9-24.79-25.67 50.46 50.46-25.67-24.79Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination mt-4 flex justify-between items-center space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex items-center bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg m-3 font-semibold"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> Previous
              </button>

              <div className="flex">
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => table.setPageIndex(i)}
                    className={`px-4 py-2  ${
                      table.getState().pagination.pageIndex === i
                        ? " text-gray-800 font-semibold"
                        : "text-gray-600 "
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex items-center bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold"
                style={{ marginRight: "15px" }}
              >
                Next <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        ) : (
          !loading && <div>No Data Available</div>
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
