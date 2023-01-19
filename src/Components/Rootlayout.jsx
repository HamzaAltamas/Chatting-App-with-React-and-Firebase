import { Box, Stack } from "@mui/material";
import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Image from "./Image";
import { FaHome } from "react-icons/fa";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const Rootlayout = () => {
  return (
    <>
      <Stack direction="row" width="100%">
        <Sidebar />
        <Outlet />
        <BottomNav />
      </Stack>
    </>
  );
};

export default Rootlayout;
