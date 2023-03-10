import { Avatar, Box, IconButton, Input, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { json, Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Image from "./Image";
import { FaHome, FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlices";
import { BiEdit } from "react-icons/bi";
import InputBox from "../Components/InputBox";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ListButton from "./ListButton";
import {
  getStorage,
  ref as storegRef,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase, onValue, ref, remove, update } from "@firebase/database";
import { PhotoCamera } from "@mui/icons-material";
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

const Sidebar = () => {
  let db = getDatabase();
  let userData = useSelector((state) => state);
  let disp = useDispatch();
  let navigate = useNavigate();
  const auth = getAuth();
  let [dpurl, setDpurl] = useState("");
  // react cropper functionality start
  const [image, setImage] = useState();
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
    console.log(files);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      console.log(image);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
    const storage = getStorage();
    const dpRef = storegRef(
      storage,
      `profilepicture/${userData.userData.userInfo.uid}`
    ); //base64 image upload on upload button
    // Data URL string
    const cropedDp = cropper.getCroppedCanvas().toDataURL();
    uploadString(dpRef, cropedDp, "data_url").then((snapshot) => {
      console.log("Uploaded a data_url string!");
      setOpen(false);
      setImage();
      getDownloadURL(dpRef).then((downloadURL) => {
        setDpurl(downloadURL);
        updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        }).then((e) => {
          update(ref(db, "users/" + userData.userData.userInfo.uid), {
            photoURL: downloadURL,
          }).then(() => {
            navigate("/chattingup/home");
            disp(activeUser(auth.currentUser));
            localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));
          });
        });
      });
    });
  };

  // react cropper functionality end

  // delete profile picture
  let deleteDp = () => {
    updateProfile(auth.currentUser, {
      photoURL: "",
    }).then(() => {
      disp(activeUser(auth.currentUser));
      localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));
    });
    setOpen(false);
    navigate("/chattingup/home");
  };

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

  // login logout message reaD
  let [loginArr, setLoginArr] = useState([]);
  useEffect(() => {
    let db = getDatabase();
    const friendListRef = ref(db, "whologin");
    onValue(friendListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        arr.push(items.val().uid);
      });
      setLoginArr(arr);
    });
  }, []);

  let logout = () => {
    signOut(auth).then(() => {
      disp(activeUser(null));
      localStorage.clear("userInfo");
      navigate("/");
    });

    loginArr.map((item) => {
      item === userData.userData.userInfo.uid &&
        remove(ref(db, "whologin/" + item));
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
              width: "100px",
              height: "100px",

              borderRadius: "50%",

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
            {userData.userData.userInfo.photoURL ? (
              <Avatar
                alt="Remy Sharp"
                src={userData.userData.userInfo.photoURL}
                sx={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Avatar alt="Remy Sharp" sx={{ width: "100%", height: "100%" }} />
            )}
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
            {image ? (
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
                className="img-preview"
              ></Box>
            ) : userData.userData.userInfo.photoURL ? (
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <Image
                  imageStyle={{ width: "100%", height: "100%" }}
                  src={userData.userData.userInfo.photoURL}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <Image
                  imageStyle={{ width: "100%", height: "100%" }}
                  src="../src/assets/images/skel.png"
                />
              </Box>
            )}
          </Box>

          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
          >
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={cropperChange}
            />
            <PhotoCamera />
          </IconButton>
          {image && (
            <Cropper
              style={{ height: 400, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={true}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={true}
            />
          )}
          <Box sx={{ display: "flex", columnGap: "10px", marginTop: "10px" }}>
            <ListButton title="Upload" onClick={getCropData} />
            <ListButton title="Delete" onClick={deleteDp} />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Sidebar;
