import { Box, Stack } from "@mui/material";
import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Image from "./Image";
import { FaHome, FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { activeUser } from "../Slices/userSlices";

const Sidebar = () => {
  let disp = useDispatch();
  let navigate = useNavigate();
  const auth = getAuth();
  //  track user login or logout
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     disp(activeUser(user.uid));
  //   } else {
  //     navigate("/login");
  //   }
  // });
  // // track user login or logout

  let logout = () => {
    signOut(auth).then(() => {
      disp(activeUser(null));
      localStorage.clear("userInfo");
      navigate("/");
    });
  };
  return (
    <>
      <Box
        sx={{
          width: "15%",
          height: "100vh",
          display: { xs: "none", sm: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: "0",
          left: "0",
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: "95%",
            width: "90%",
            borderRadius: "15px",
            backgroundColor: "#5F35F5",
            padding: "30px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            //   profile picture image
            sx={{
              width: "80px",
              height: "80px",
              overflow: "hidden",
              borderRadius: "50%",
              background: "red",
            }}
          >
            <Image
              imageStyle={{
                width: "100%",
                height: "100%",
                display: "block",
              }}
              src="../src/assets/images/propic.png"
            />
          </Box>
          <ul className="sidebar-nav-icons">
            <li>
              <NavLink to="home">
                <FaHome />
              </NavLink>
            </li>
            <li>
              <NavLink to="message">
                <AiFillMessage />
              </NavLink>
            </li>
            <li>
              <NavLink to="notification">
                <FaBell />
              </NavLink>
            </li>
            <li>
              <NavLink to="settings">
                <IoSettings />
              </NavLink>
            </li>
            <li onClick={logout}>
              <HiOutlineLogout />
            </li>
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
