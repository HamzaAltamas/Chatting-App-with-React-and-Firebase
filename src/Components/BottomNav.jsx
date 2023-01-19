import { Box } from "@mui/system";
import React from "react";
import { FaHome, FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Image from "./Image";
import { getAuth, signOut } from "firebase/auth";
import { activeUser } from "../Slices/userSlices";
import { useDispatch } from "react-redux";

const BottomNav = () => {
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
          position: "fixed",
          bottom: "0",

          width: "100%",
          backgroundColor: "#5F35F5",
          marginLeft: "0",
          padding: "15px 0",
          display: { xs: "flex", sm: "flex", md: "none" },
          justifyContent: "center",
          borderRadius: "30px 30px 0 0",
        }}
      >
        <ul className="bottom-nav-icons">
          <li>
            <NavLink to="/chattingup">
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
    </>
  );
};

export default BottomNav;
