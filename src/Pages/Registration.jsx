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

const SubmitButtonStyle = styled(Button)({
  width: "100%",

  padding: "19px 12px",

  borderRadius: "86px",
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

const Registration = () => {
  const ImageStyle = {
    width: "100%",
    height: "100vh",
    objectFit: "cover",
    display: "block",
  };
  const RegistrationFormContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  };
  const RegistrationInputContainer = {
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
            <Box style={RegistrationFormContainer} marginRight="50px">
              <Box>
                <Heading
                  variant="h4"
                  component="h1"
                  title="Get started with easily register"
                  sx={{ color: "#11175D", fontWeight: "bold" }}
                />
                <Heading
                  variant="h6"
                  component="h2"
                  title="Free register and you can enjoy it"
                />
                <Box style={RegistrationInputContainer}>
                  <InputBox
                    label="Email Address"
                    variant="outlined"
                    sx={{ width: "100%", color: "red", marginTop: "30px" }}
                    className="hello"
                  />
                  <InputBox
                    label="Full Name"
                    variant="outlined"
                    sx={{ width: "100%", color: "red", marginTop: "30px" }}
                  />
                  <InputBox
                    label="Password"
                    variant="outlined"
                    sx={{ width: "100%", color: "red", marginTop: "30px" }}
                  />
                  <CommonButton
                    title="Sign Up"
                    buttonName={SubmitButtonStyle}
                  />
                  <AuthenticationLink
                    title="Already  have an account ?"
                    hrefTitle="Sign In"
                    href="/login"
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
                src="../src/assets/images/registrationimage.png"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Registration;
