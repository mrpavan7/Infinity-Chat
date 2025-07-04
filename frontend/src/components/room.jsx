import React from "react";
import { Outlet } from "react-router-dom";

const Room = () => {
  return (
    <main className="roboto min-h-[75vh] flex flex-col items-center justify-center">
      <Outlet />
    </main>
  );
};

export default Room;
