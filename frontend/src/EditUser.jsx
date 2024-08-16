import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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
  status: z.enum(["Active", "Inactive", "Do Not Disturb"])
});

const EditUser = ({ user, onSave, onCancel }) => {
  const [selectedTeams, setSelectedTeams] = useState(user.teams || []);
  const [profilePic, setProfilePic] = useState(null);

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

  const handleTeamChange = (event) => {
    const { value, checked } = event.target;
    setSelectedTeams((prev) =>
      checked ? [...prev, value] : prev.filter((team) => team !== value)
    );
  };

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
    
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

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
    <div className="p-4 bg-white shadow-lg border border-gray-200 rounded">
      <h2 className="text-lg font-semibold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit(handleEditUser)}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="role"
          >
            Role
          </label>
          <select
            id="role"
            {...register("role")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="status"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Do Not Disturb">Do Not Disturb</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-xs">{errors.status.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Teams
          </label>
          {teamOptions.map((team) => (
            <div key={team}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={team}
                  onChange={handleTeamChange}
                  checked={selectedTeams.includes(team)}
                  className="form-checkbox"
                />
                <span className="ml-2">{team}</span>
              </label>
            </div>
          ))}
          {errors.teams && (
            <p className="text-red-500 text-sm">{errors.teams.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="profilePic"
          >
            Profile Picture
          </label>
          <input
            id="profilePic"
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {errors.profilePic && (
            <p className="text-red-500 text-xs">{errors.profilePic.message}</p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
