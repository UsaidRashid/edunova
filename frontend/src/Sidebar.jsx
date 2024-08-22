import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 p-4">
      <nav className="space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center p-2 text-lg font-medium rounded-md ${
              isActive ? "text-purple-500" : "text-black"
            }
            `
          }
        >
          <FontAwesomeIcon icon={faBorderAll} className="mr-2" />
          Overview
        </NavLink>
        <NavLink
          to="/people-directory"
          className={({ isActive }) =>
            `flex items-center p-2 text-lg font-medium rounded-md ${
              isActive ? "text-purple-500" : "text-black"
            }
            `
          }
        >
          <FontAwesomeIcon icon={faBorderAll} className="mr-2" />
          People Directory
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
