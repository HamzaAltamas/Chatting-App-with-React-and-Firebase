import { Box, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Image from "./Image";
import { FaHome } from "react-icons/fa";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useSelector } from "react-redux";

const Rootlayout = () => {
  let data = useSelector((state) => state);
  let navigate = useNavigate();
  useEffect(() => {
    if (!data.userData.userInfo) {
      navigate("/login");
    }
  }, []);
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
