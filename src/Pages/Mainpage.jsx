import { Button, Grid, styled } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationLink from "../Components/AuthenticationLink";
import CommonButton from "../Components/CommonButton";
import Heading from "../Components/Heading";
import Image from "../Components/Image";

const SubmitButtonStyle = styled(Button)({
  width: "80%",
  fontSize: "17px",
  padding: "19px 12px",
  textTransform: "capitalize",
  borderRadius: "86px",
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

const Mainpage = () => {
  let navigate = useNavigate();
  let data = useSelector((state) => state);

  useEffect(() => {
    if (data.userData.userInfo) {
      navigate("/chattingup");
    }
  }, []);

  let signupClick = () => {
    navigate("/registration");
  };

  let signinClick = () => {
    navigate("/login");
  };

  const logoStyle = {
    height: "auto",
    width: "100%",
  };
  const ImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  return (
    <>
      <Box>
        <Grid container spacing={0}>
          <Grid
            item
            sm={12}
            xs={12}
            md={6}
            display="flex"
            alignItems="center"
            sx={{
              padding: { xs: "20px 15px", sm: "30px 15px" },
              justifyContent: { xs: "center", sm: "center", md: "flex-end" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginRight: { xs: "0", sm: "0px", md: "50px" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {" "}
                <Heading
                  variant="h4"
                  component="h1"
                  title="Let's connect the world with"
                  sx={{
                    color: "#5F35F5",
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "center", md: "left" },
                    fontSize: { xs: "25px", sm: "30px", md: "35px" },
                    marginBottom: { xs: "20px", sm: "20px", md: "20px" },
                  }}
                />
                <Box
                  sx={{
                    width: { xs: "200px", sm: "220px", md: "350px" },
                  }}
                >
                  <Image
                    imageStyle={logoStyle}
                    src="../src/assets/images/logo.png"
                  />
                </Box>
                {/* <Heading
                  variant="h6"
                  component="h2"
                  title="Let's connect the world!"
                  sx={{
                    color: "#444",
                    textAlign: { xs: "center", sm: "center", md: "left" },
                    fontSize: { xs: "16px", sm: "20px", md: "25px" },
                  }}
                /> */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: { xs: "100%", sm: "100%", md: "80%" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      gap: "15px",
                    }}
                  >
                    <CommonButton
                      title="Sign Up"
                      buttonName={SubmitButtonStyle}
                      onClick={signupClick}
                    />
                    <CommonButton
                      title="Sign In"
                      buttonName={SubmitButtonStyle}
                      onClick={signinClick}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            sx={{ display: { xs: "none", sm: "none", md: "block" } }}
            sm={6}
          >
            <Box sx={{ width: "100%", height: "100vh" }}>
              <Image
                imageStyle={ImageStyle}
                src="../src/assets/images/registrationimage.png"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Mainpage;
