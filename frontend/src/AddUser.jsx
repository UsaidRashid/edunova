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
  dob: z.string(),
});

const AddUser = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
  });

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
    formData.append("dob", data.dob);

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
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Add User</h2>

        <form onSubmit={handleSubmit(handleAddUser)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="w-full  px-2 mb-4">
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

            <div className="w-full px-2 mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                {...register("email")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
                id="email"
                type="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="w-full px-2 mb-4">
              <label
                htmlFor="workEmail"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Work Email
              </label>
              <input
                {...register("workEmail")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
                type="email"
                id="workEmail"
              />
              {errors.workEmail && (
                <p className="text-red-500 text-sm">
                  {errors.workEmail.message}
                </p>
              )}
            </div>

            <div className="w-full px-2 mb-4">
              <label
                htmlFor="contact"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Contact
              </label>
              <input
                {...register("contact")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
                type="number"
                id="contact"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm">{errors.contact.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="w-full px-2 mb-4">
              <label
                htmlFor="nationality"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Nationality
              </label>
              <select
                {...register("nationality")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
                id="nationality"
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

            <div className="w-full px-2 mb-4">
              <label
                htmlFor="gender"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Gender
              </label>
              <select
                {...register("gender")}
                id="gender"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="w-full px-2 mb-4">
              <label
                htmlFor="role"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Role
              </label>
              <select
                {...register("role")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
                id="role"
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

            <div className="w-full px-2 mb-4">
              <label
                htmlFor="teams"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Teams
              </label>
              <div className="relative">
                <div
                  onClick={handleDropdownToggle}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="w-full px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dob")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-b-black"
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className="bg-purple-100 border hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l.636-.636a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Upload A Profile Picture
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Add User
            </button>
            <button
              onClick={() => window.location.reload()}
              className="mx-4 px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-28"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
