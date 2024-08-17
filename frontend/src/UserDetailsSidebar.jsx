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

  return (
    <div className="fixed right-0 top-20 rounded-lg bg-white shadow-lg border-l border-gray-200 h-full z-50 w-3/5">
      <div className="bg-blue-700 text-white p-6 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <img
              src={user.profilePic || profile}
              alt="profile"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex items-center">
                <div className="text-sm my-1 flex flex-col items-center">
                  <span className="text-blue-200 mx-2">{username}</span>
                  <span className="text-blue-200 mx-2">User ID</span>
                </div>
                <div className="border-r border-gray-300 mx-2 h-6"></div>

                <div className="text-sm my-1 flex flex-col items-center">
                  <span className="mx-2">{user.role}</span>
                  <span className="mx-2">Role</span>
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

      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Personal Information
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Date of Birth</span>
            <span className="text-gray-700">{user.dob}</span>
          </div>
          <div className="flex justify-between">
            <span>Gender</span>
            <span className="text-gray-700">{user.gender}</span>
          </div>
          <div className="flex justify-between">
            <span>Nationality</span>
            <span className="text-gray-700">{user.nationality}</span>
          </div>
          <div className="flex justify-between">
            <span>Contact no.</span>
            <span className="text-gray-700">{user.contact}</span>
          </div>
          <div className="flex justify-between">
            <span>E-mail Address</span>
            <span className="text-gray-700">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span>Work email Address</span>
            <span className="text-gray-700">{user.workEmail}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Research & Publication
        </h3>
        <div className="border-t border-gray-300 pt-4">
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
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg mt-4">
            SEE PUBLICATION
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSidebar;
