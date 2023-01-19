import React, { useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlices";
import CommonButton from "../Components/CommonButton";

import { Box, Button, Stack } from "@mui/material";

import { styled } from "@mui/system";
import { Height } from "@mui/icons-material";
import Grouplist from "../Components/Grouplist";

const LoginButtonStyle = styled(Button)({
  width: "20%",
  textTransform: "initial",
  padding: "19px 12px",
  fontSize: "17px",
  borderRadius: "10px",
  marginTop: "30px",

  color: "white",
  backgroundColor: "#5F35F5",

  fontFamily: '"Nunito", sans-serif',
  "&:hover": {
    backgroundColor: "#5f35f59e",
    borderColor: "#0062cc",
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "none",
    borderColor: "none",
  },
  "&:focus": {
    boxShadow: "none",
  },
});

const Home = () => {
  let navigate = useNavigate();
  let data = useSelector((state) => state);

  useEffect(() => {
    if (!data.userData.userInfo) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100vh",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "95%",
            height: "95%",
            display: { md: "flex " },
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "5px",
          }}
        >
          <Grouplist />
          <Grouplist />
          <Grouplist />
          <Grouplist />
          <Grouplist />
          <Grouplist />
        </Box>
      </Box>
    </>
  );
};

export default Home;
