import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const UserDetailsSidebar = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed right-0 top-0 w-80 bg-white shadow-lg border-l border-gray-200 h-full z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">User Details</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <strong>Name:</strong> {user.name}
        </div>
        <div className="mb-4">
          <strong>Email:</strong>{" "}
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </div>
        <div className="mb-4">
          <strong>Profile Picture:</strong>{" "}
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full"
            />
          ) : (
            "No profile picture"
          )}
        </div>
        <div className="mb-4">
          <strong>Status:</strong> {user.status}
        </div>
        <div className="mb-4">
          <strong>Work Email:</strong>{" "}
          <a href={`mailto:${user.workEmail}`}>{user.workEmail}</a>
        </div>
        <div className="mb-4">
          <strong>Gender:</strong> {user.gender}
        </div>
        <div className="mb-4">
          <strong>Nationality:</strong> {user.nationality}
        </div>
        <div className="mb-4">
          <strong>Contact:</strong> {user.contact}
        </div>
        <div className="mb-4">
          <strong>Role:</strong> {user.role}
        </div>
        <div className="mb-4">
          <strong>Teams:</strong>
          <ul>
            {user.teams.map((team) => (
              <li key={team}>{team}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSidebar;
