import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import profile from "./profile.png";

const UserDetailsSidebar = ({ user, onClose }) => {
  const [username, setUsername] = useState(user.name);

  useEffect(() => {
    if (user && user.name) {
      const firstName = user.name.split(" ")[0];
      const formattedUsername = `@${firstName.toLowerCase()}`;
      setUsername(formattedUsername);
    }
  }, [user]);

  if (!user) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="fixed right-0 top-10 rounded-lg bg-white shadow-lg border-l border-gray-200  w-3/5 overflow-auto z-50">
      <div
        className="text-white p-4 rounded-t-lg"
        style={{ backgroundColor: "#2a5b7e" }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <img
              src={user.profilePic || profile}
              alt="profile"
              className="w-28 h-28 object-cover rounded-full mr-4"
              onError={(e) => {
                e.target.src = profile;
              }}
            />

            <div>
              <h2 className="text-xl font-semibold ms-2">{user.name}</h2>
              <div className="flex items-center mt-2">
                <div className="text-sm my-1 flex flex-col">
                  <span className="text-white mx-2">{username}</span>
                  <span className="text-white mx-2 pt-1">User ID</span>
                </div>
                <div className="border-r border-gray-300 mx-2 h-6"></div>

                <div className="text-sm my-1 flex flex-col">
                  <span className="mx-2">{user.role}</span>
                  <span className="mx-2 pt-1">Role</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="text-lg p-2 font-semibold mb-4 text-gray-700 rounded-md"
          style={{ backgroundColor: "#eff5fa" }}
        >
          Personal Information
        </h3>
        <div className="space-y-2">
          <div className="flex w-3/5">
            <span className="flex-grow">Date of Birth</span>
            <span className="text-gray-700 text-left w-1/2">
              {formatDate(user.dob)}
            </span>
          </div>
          <hr />
          <div className="flex w-3/5">
            <span className="flex-grow">Gender</span>
            <span className="text-gray-700 text-left w-1/2">{user.gender}</span>
          </div>
          <hr />
          <div className="flex w-3/5">
            <span className="flex-grow">Nationality</span>
            <span className="text-gray-700 text-left w-1/2">
              {user.nationality}
            </span>
          </div>
          <hr />
          <div className="flex w-3/5">
            <span className="flex-grow">Contact no.</span>
            <span className="text-gray-700 text-left w-1/2">
              {user.contact}
            </span>
          </div>
          <hr />
          <div className="flex w-3/5">
            <span className="flex-grow">E-mail Address</span>
            <span className="text-gray-700 text-left w-1/2">{user.email}</span>
          </div>
          <hr />
          <div className="flex w-3/5">
            <span className="flex-grow">Work email Address</span>
            <span className="text-gray-700 text-left w-1/2">
              {user.workEmail}
            </span>
          </div>
          <hr />
        </div>
      </div>

      <div className="px-4">
        <h3
          className="text-lg p-2 font-semibold text-gray-700 rounded-md"
          style={{ backgroundColor: "#eff5fa" }}
        >
          Research & Publication
        </h3>
        <div className="p-2">
          <h4 className="text-md font-bold mb-2 text-gray-700">
            AI and User Experience: The Future of Design
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            Published in the Journal of Modern Design • 2022
          </p>
          <p className="text-sm text-gray-600">
            AI, IoT-based real-time condition monitoring of Electrical Machines
            using Python language. Abstract: Maintaining induction motors in
            good working order before they fail benefits small{" "}
            <a href="#" className="text-blue-500 hover:underline">
              See More...
            </a>
          </p>
          <button className=" text-orange-600 text-2xl font-semibold py-2 px-4 rounded-lg mt-4">
            <i class="fa-solid fa-arrow-up rotate-45 me-2"></i>
            SEE PUBLICATION
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSidebar;
