import { Box, Input, Stack } from "@mui/material";
import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Image from "./Image";
import { FaHome, FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlices";
import { BiEdit } from "react-icons/bi";
import InputBox from "../Components/InputBox";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "20px",
  p: 4,
};

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";
const Sidebar = () => {
  let userData = useSelector((state) => state);
  let disp = useDispatch();
  let navigate = useNavigate();
  const auth = getAuth();
  // react cropper functionality start
  const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  const cropperChange = (e) => {
    e.preventDefault();
    let files;
    console.log(e.target.files);
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };

  // react cropper functionality end

  // modal functionality start
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //  modal functionality end

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

              borderRadius: "50%",
              background: "red",
              position: "relative",
            }}
          >
            <BiEdit
              onClick={handleOpen}
              style={{
                position: "absolute",
                zIndex: "999",
                right: "-6",
                bottom: "0",
                fontSize: "25px",
                color: "#fff",
              }}
            />
            <Image
              imageStyle={{
                width: "100%",
                height: "100%",
                display: "block",
                borderRadius: "50%",
              }}
              src={cropData}
            />
          </Box>
          <h3 style={{ color: "white", textAlign: "center", padding: "5px 0" }}>
            {userData.userData.userInfo.displayName}
          </h3>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="Dp-modal">
          <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
            Update your profile picture
          </h2>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0",
            }}
          >
            <Box
              //   profile picture image
              sx={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                overflow: "hidden",
              }}
              className="img-preview"
            ></Box>
          </Box>
          <InputBox onChange={cropperChange} type="file" />
          <Cropper
            style={{ height: 400, width: "100%" }}
            zoomTo={0.5}
            initialAspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => {
              setCropper(instance);
            }}
            guides={true}
          />
          <button style={{ float: "right" }} onClick={getCropData}>
            Crop Image
          </button>
        </Box>
      </Modal>
    </>
  );
};

export default Sidebar;
