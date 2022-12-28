import { Alert, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import CommonButton from "../Components/CommonButton";
import Heading from "../Components/Heading";
import Image from "../Components/Image";
import InputBox from "../Components/InputBox";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AuthenticationLink from "../Components/AuthenticationLink";
import { Link } from "react-router-dom";

import PasswordInput from "../Components/PasswordInput";

const LoginButtonStyle = styled(Button)({
  width: "80%",
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

const Login = () => {
  // error states start
  let [email, setEmailErr] = useState(false);
  let [password, setpassErr] = useState(false);
  // error states end
  let [loginFormData, setloginFormData] = useState({
    email: "",
    password: "",
  });
  let handleChange = (e) => {
    let { name, value } = e.target;

    setloginFormData((prevformData) => {
      return {
        ...prevformData,
        [name]: value,
      };
    });
    console.log(loginFormData);
    setEmailErr(!name);
    setpassErr(!name);
  };
  let submitClick = () => {
    if (loginFormData.email == "") {
      setEmailErr(true);
    } else if (loginFormData.password == "") {
      setpassErr(true);
    }
  };
  // form data end

  const ImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
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
    marginTop: "30px",
  };
  const logoStyle = {
    width: "200px",
    height: "auto",
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
              <Box>
                <Box
                  sx={{
                    display: { xs: "flex", sm: "flex", md: "none" },
                    justifyContent: "center",
                  }}
                >
                  <Image
                    width="100%"
                    imageStyle={logoStyle}
                    src="../src/assets/images/logo.png"
                  />
                </Box>
                <Heading
                  variant="h4"
                  component="h1"
                  title="Login to your account!"
                  sx={{
                    color: "#5F35F5",
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "center", md: "left" },
                    fontSize: { xs: "25px", sm: "30px", md: "35px" },
                    marginTop: { xs: "20px", sm: "20px", md: "0" },
                  }}
                />
                <Link>
                  <Image
                    imageStyle={googleLoginBtn}
                    src="../src/assets/images/googlebtn.png"
                  />
                </Link>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: { xs: "100%", sm: "100%", md: "80%" },
                  }}
                >
                  <InputBox
                    label="Email Address"
                    variant="standard"
                    sx={{
                      width: "100%",
                      color: "red",
                      marginTop: "30px",
                    }}
                    onChange={handleChange}
                    name="email"
                    type="email"
                  />
                  {email && (
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ width: "100%", margin: "10px 0" }}
                    >
                      Email Required
                    </Alert>
                  )}
                  <PasswordInput
                    sx={{
                      width: "100%",
                      color: "red",
                      marginTop: "30px",
                    }}
                    name="password"
                    onChange={handleChange}
                  />
                  {password && (
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ width: "100%", margin: "10px 0" }}
                    >
                      Password Required
                    </Alert>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <CommonButton
                      title="Login to continue"
                      buttonName={LoginButtonStyle}
                      onClick={submitClick}
                    />
                  </Box>
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
          <Grid
            item
            sx={{ display: { xs: "none", sm: "none", md: "block" } }}
            sm={6}
          >
            <Box sx={{ width: "100%", height: "100vh" }}>
              <Image
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
