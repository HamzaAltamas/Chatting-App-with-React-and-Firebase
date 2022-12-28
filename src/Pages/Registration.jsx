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
import { OutlinePassword } from "../Components/PasswordInput";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

const Registration = () => {
  // firebase functionality start
  const auth = getAuth();
  // firebase functionality end

  // form data start
  // error states start
  let [errorData, setErrorDAta] = useState({
    email: "",
    fname: "",
    password: "",
  });
  // error states end
  // registration success text state start
  let [regSuccessTxt, setRegSuccessTxt] = useState("");
  // registration success text state end

  let [regFormData, setRegFormData] = useState({
    email: "",
    fname: "",
    password: "",
  });
  let handleChange = (e) => {
    let { name, value } = e.target;

    setRegFormData((prevformData) => {
      return {
        ...prevformData,
        [name]: value,
      };
    });
    setErrorDAta({
      ...errorData,
      [name]: "",
    });
  };
  let submitClick = () => {
    if (regFormData.email == "") {
      setErrorDAta({
        ...errorData,
        email: "Email required",
      });
    } else if (regFormData.fname == "") {
      setErrorDAta({
        ...errorData,
        fname: "Name required",
      });
    } else if (regFormData.password == "") {
      setErrorDAta({
        ...errorData,
        password: "Password required",
      });
    } else {
      createUserWithEmailAndPassword(
        auth,
        regFormData.email,
        regFormData.password
      )
        .then((user) => {
          setRegFormData({
            email: "",
            fname: "",
            password: "",
          });
          setRegSuccessTxt("Registration Successfull");
          setTimeout(() => {
            setRegSuccessTxt("");
          }, 2500);
        })
        .catch((error) => {
          const errCode = error.code;
          errCode.includes("auth/email-already-in-use") &&
            setErrorDAta({ ...errorData, email: "Email already exists" });

          errCode.includes("auth/weak-password") &&
            setErrorDAta({
              ...errorData,
              password: "Password should be at least 6 characters",
            });

          // ..
        });
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
                    justifyContent: { xs: "center", sm: "center" },
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
                  title="Get started with easily register"
                  sx={{
                    color: "#5F35F5",
                    fontWeight: "bold",
                    textAlign: { xs: "center", sm: "center", md: "left" },
                    fontSize: { xs: "25px", sm: "30px", md: "35px" },
                    marginTop: { xs: "20px", sm: "20px", md: "0" },
                  }}
                />
                <Heading
                  variant="h6"
                  component="h2"
                  title="Free register and you can enjoy it"
                  sx={{
                    color: "#444",
                    textAlign: { xs: "center", sm: "center", md: "left" },
                    fontSize: { xs: "16px", sm: "20px", md: "25px" },
                  }}
                />
                <Heading
                  variant="h6"
                  component="h2"
                  title={regSuccessTxt}
                  sx={{
                    color: "green",
                    textAlign: { xs: "center", sm: "center", md: "left" },
                    fontSize: { xs: "12px", sm: "16px", md: "20px" },
                  }}
                />

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
                    variant="outlined"
                    sx={{ width: "100%", marginTop: "30px" }}
                    onChange={handleChange}
                    name="email"
                    type="email"
                    value={regFormData.email}
                  />
                  {errorData.email && (
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ width: "100%", margin: "10px 0" }}
                    >
                      {errorData.email}
                    </Alert>
                  )}

                  <InputBox
                    label="Full Name"
                    variant="outlined"
                    onChange={handleChange}
                    type="text"
                    name="fname"
                    sx={{
                      width: "100%",
                      marginTop: "30px",
                    }}
                    value={regFormData.fname}
                  />
                  {errorData.fname && (
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ width: "100%", margin: "10px 0" }}
                    >
                      {errorData.fname}
                    </Alert>
                  )}

                  <OutlinePassword
                    sx={{ width: "100%", color: "red", marginTop: "30px" }}
                    name="password"
                    onChange={handleChange}
                    value={regFormData.password}
                  />
                  {errorData.password && (
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ width: "100%", margin: "10px 0" }}
                    >
                      {errorData.password}
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
                      title="Sign Up"
                      buttonName={SubmitButtonStyle}
                      onClick={submitClick}
                    />
                  </Box>
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

export default Registration;
