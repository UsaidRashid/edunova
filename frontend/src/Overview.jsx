import React from "react";
import Sidebar from "./Sidebar";

export default function Overview() {
  return (
    <div className="flex">
      <Sidebar />
      <h1 className="text-6xl p-10 font-bold">Welcome,Jane Doe</h1>
    </div>
  );
}
