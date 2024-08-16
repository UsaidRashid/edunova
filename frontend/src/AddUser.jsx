import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const genderOptions = ["Male", "Female", "Other"];

const nationalityOptions = [
  "American",
  "Australian",
  "British",
  "Canadian",
  "Chinese",
  "French",
  "German",
  "Indian",
  "Japanese",
  "Russian",
  "South African",
  "Spanish",
];

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  workEmail: z.string().email("Invalid work email address"),
  gender: z.enum(genderOptions, "Gender is required"),
  nationality: z.enum(nationalityOptions, "Nationality is required"),
  contact: z.coerce.number().min(1000000000, "Invalid contact number"),
  role: z.enum(roleOptions, "Role is required"),
});

const AddUser = () => {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
  });

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

  const handleAddUser = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("workEmail", data.workEmail);
    formData.append("gender", data.gender);
    formData.append("nationality", data.nationality);
    formData.append("contact", data.contact);
    formData.append("role", data.role);
    formData.append("teams", selectedTeams);
    formData.append("profilePic", profilePic);

    try {
      const response = await axios.post(api + "add-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Add User</h2>
        <form onSubmit={handleSubmit(handleAddUser)}>
          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Work Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Work Email
            </label>
            <input
              {...register("workEmail")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              type="email"
            />
            {errors.workEmail && (
              <p className="text-red-500 text-sm">{errors.workEmail.message}</p>
            )}
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              {...register("gender")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          {/* Nationality */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <select
              {...register("nationality")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select Nationality</option>
              {nationalityOptions.map((nationality) => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>
            {errors.nationality && (
              <p className="text-red-500 text-sm">
                {errors.nationality.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Contact
            </label>
            <input
              {...register("contact")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              type="number"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              {...register("role")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select Role</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          {/* Teams */}
          <div className="mb-6">
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
          </div>

          {/* Profile Picture */}
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
              name="profilePic"
              onChange={handleFileChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
