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
  profilePic: z.instanceof(FileList).optional(),
  workEmail: z.string().email("Invalid work email address"),
  gender: z.enum(genderOptions, "Gender is required"),
  nationality: z.enum(nationalityOptions, "Nationality is required"),
  contact: z.coerce.number().min(1000000000, "Invalid contact number"),
  role: z.enum(roleOptions, "Role is required"),
  teams: z
    .array(z.enum(teamOptions))
    .min(1, "At least one team must be selected"),
});

const AddUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const handleAddUser = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("workEmail", data.workEmail);
    formData.append("gender", data.gender);
    formData.append("nationality", data.nationality);
    formData.append("contact", data.contact);
    formData.append("role", data.role);
    formData.append("teams", data.teams);
    if (data.profilePic.length > 0) {
      formData.append("profilePic", data.profilePic[0]);
    }
    console.log(formData);
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
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <form onSubmit={handleSubmit(handleAddUser)}>
              <h2 className="text-xl font-bold mb-4">Add User</h2>

              {/* Name */}
              <div className="mb-4">
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
              <div className="mb-4">
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Work Email
                </label>
                <input
                  {...register("workEmail")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  type="email"
                />
                {errors.workEmail && (
                  <p className="text-red-500 text-sm">
                    {errors.workEmail.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="mb-4">
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
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Nationality */}
              <div className="mb-4">
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  {...register("contact")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  type="number"
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm">
                    {errors.contact.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="mb-4">
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Teams
                </label>
                {teamOptions.map((team) => (
                  <div key={team}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        {...register("teams")}
                        value={team}
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

              {/* Profile Picture */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <input
                  {...register("profilePic")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  type="file"
                  accept="image/*"
                  name="profilePic"
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
      )}
    </>
  );
};

export default AddUser;
