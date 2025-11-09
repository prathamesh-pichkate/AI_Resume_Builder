import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div>
      <div className="min-h-screen flex flex-col ">
        <Navbar />
        <div className="flex-grow pt-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
