import { Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CommonButton from "../Components/CommonButton";
import Heading from "../Components/Heading";
import Image from "../Components/Image";
import InputBox from "../Components/InputBox";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AuthenticationLink from "../Components/AuthenticationLink";
import { Link } from "react-router-dom";

const LoginButtonStyle = styled(Button)({
  width: "100%",
  textTransform: "capitalize",
  padding: "19px 12px",

  borderRadius: "10px",
  marginTop: "25px",

  color: "white",
  backgroundColor: "#5F35F5",

  fontFamily: '"Nunito", sans-serif',
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0062cc",
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "#005cbf",
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
});

const Login = () => {
  const ImageStyle = {
    width: "100%",
    height: "100vh",
    objectFit: "cover",
    display: "block",
  };
  const LoginFormContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  };
  const LoginInputContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "360px",
  };
  const AuthenticationLinkStyle = {
    textAlign: "center",
    marginTop: "20px",
    fontFamily: '"Nunito", sans-serif',
    width: "100%",
  };

  const googleLoginBtn = {
    width: "221px",
    height: "64px",
    marginTop: "25px",
  };
  return (
    <>
      <Box>
        <Grid container spacing={0}>
          <Grid
            item
            sm={6}
            display="flex"
            alignItems="center"
            justifyContent="end"
          >
            <Box style={LoginFormContainer} marginRight="50px">
              <Box>
                <Heading
                  variant="h4"
                  component="h1"
                  title="Login to your account!"
                  sx={{ color: "#11175D", fontWeight: "bold" }}
                />
                <Link>
                  <Image
                    imageStyle={googleLoginBtn}
                    src="../src/assets/images/googlebtn.png"
                  />
                </Link>
                <Box style={LoginInputContainer}>
                  <InputBox
                    label="Email Address"
                    variant="standard"
                    sx={{ width: "100%", color: "red", marginTop: "30px" }}
                    className="hello"
                  />
                  <InputBox
                    label="Password"
                    variant="standard"
                    sx={{ width: "100%", color: "red", marginTop: "30px" }}
                  />

                  <CommonButton
                    title="Login to Continue"
                    buttonName={LoginButtonStyle}
                  />
                  <AuthenticationLink
                    title="Don't have any account?"
                    hrefTitle="Sign Up"
                    href="/"
                    style={AuthenticationLinkStyle}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item sx={{ display: { xs: "none", sm: "block" } }} sm={6}>
            <Box>
              <Image
                width="100%"
                imageStyle={ImageStyle}
                src="../src/assets/images/login.png"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Login;
