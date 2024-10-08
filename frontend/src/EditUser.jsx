import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import profile from "./profile.png";

const api = import.meta.env.VITE_BACKEND_API;

const roleOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Product Designer",
  "Product Manager",
];

const teamOptions = ["Technology", "Product", "Marketing", "Design"];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["Active", "Inactive", "Do Not Disturb"]),
});

const EditUser = ({ user, onSave, onCancel }) => {
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const [selectedTeams, setSelectedTeams] = useState(user.teams || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      status: user.status || "Active",
      teams: user.teams || [],
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setSelectedTeams(user.teams || []);
  }, [user.teams]);

  const handleSelectChange = (event) => {
    const team = event.target.value;
    if (team && !selectedTeams.includes(team)) {
      setSelectedTeams([...selectedTeams, team]);
      setSearchTerm("");
    }
    setDropdownOpen(false);
  };

  const handleRemoveTeam = (team) => {
    setSelectedTeams(selectedTeams.filter((t) => t !== team));
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const filteredOptions = teamOptions.filter(
    (team) =>
      !selectedTeams.includes(team) &&
      team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleEditUser = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role", data.role);
    formData.append("status", data.status);
    formData.append("_id", user._id);
    formData.append("teams", selectedTeams);

    formData.append("profilePic", profilePic);

    try {
      const response = await axios.post(api + "edit-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <div className="flex justify-center mb-4">
        <img
          src={profilePic || profile}
          alt="Profile Picture"
          className="rounded-full w-32 h-32"
          onError={(e) => (e.target.src = profile)}
        />
      </div>

      <div className="flex justify-center mb-4 space-x-2">
        <label
          htmlFor="file-upload"
          className="bg-purple-50 border hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer"
        >
          <i class="fa-solid fa-arrow-rotate-left me-2"></i>
          CHANGE PHOTO
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <button
          type="button"
          className="bg-purple-50 border hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={() => setProfilePic(null)}
        >
          <svg
            className="w-5 h-5 mr-2"
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
          REMOVE PHOTO
        </button>
      </div>

      <form onSubmit={handleSubmit(handleEditUser)}>
        <div className="mb-4">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div className="w-full md:w-1/2 px-2 mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label
                htmlFor="role"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Role
              </label>
              <select
                id="role"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
                {...register("role")}
              >
                <option value="">Select a role</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs">{errors.role.message}</p>
              )}
            </div>

            <div className="w-full md:w-1/2 px-2 mb-4">
              <label
                htmlFor="status"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Status
              </label>
              <select
                id="status"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
                {...register("status")}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Do Not Disturb">Do Not Disturb</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="teams"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Teams
          </label>
          <div className="relative">
            <div
              onClick={handleDropdownToggle}
              className="block w-full px-3 py-2 border rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <div className="flex flex-wrap gap-2">
                {selectedTeams.map((team) => (
                  <div
                    key={team}
                    className="flex items-center space-x-2 bg-purple-100 rounded-md px-2 py-1"
                  >
                    <span className="text-sm text-purple-700">{team}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeam(team)}
                      className="text-gray-500 hover:text-red-700"
                    >
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
              </div>
              {!selectedTeams.length && (
                <span className="text-gray-500">Select teams</span>
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="block w-full px-3 py-2 border-b rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {filteredOptions.length ? (
                  filteredOptions.map((team) => (
                    <div
                      key={team}
                      onClick={() =>
                        handleSelectChange({ target: { value: team } })
                      }
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                    >
                      {team}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No options available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
