import React from "react";
import Sidebar from "./Sidebar";

export default function Overview() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-2 relative w-full border m-2 rounded">
        <h1 className="text-3xl p-2 font-semibold">Welcome,Jane Doe</h1>
      </div>
    </div>
  );
}
