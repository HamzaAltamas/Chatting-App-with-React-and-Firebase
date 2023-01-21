import { Alert, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import CommonButton from "../Components/CommonButton";
import Heading from "../Components/Heading";
import Image from "../Components/Image";
import InputBox from "../Components/InputBox";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AuthenticationLink from "../Components/AuthenticationLink";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import PasswordInput from "../Components/PasswordInput";
import { ProgressBar } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlices";

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
  let disp = useDispatch();
  const auth = getAuth();
  let nevigate = useNavigate();
  let data = useSelector((state) => state);

  useEffect(() => {
    if (data.userData.userInfo) {
      nevigate("/chattingup/home");
    }
  }, []);
  const gmailprovider = new GoogleAuthProvider();
  let gmailClick = () => {
    signInWithPopup(auth, gmailprovider).then((result) => {
      disp(activeUser(result.user.uid));
      localStorage.setItem("userInfo", result.user.uid);
      setLoader(true);
      console.log("ggle dn");
      toast.success("Successfully sign in with google", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        nevigate("/chattingup/home");
      }, 3000);
    });
  };

  // facebook login

  let fbLoginClick = () => {
    const fbprovider = new FacebookAuthProvider();
    signInWithPopup(auth, fbprovider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        console.log(errorCode);

        // ...
      });
  };
  // facebook login

  // error states start
  let [errorData, setErrorDAta] = useState({
    email: "",
    password: "",
  });
  // error states end
  // loader start
  let [loader, setLoader] = useState(false);
  // loader end
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
    setErrorDAta({
      ...errorData,
      [name]: "",
    });
  };
  let submitClick = () => {
    setLoader(true);
    let pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (loginFormData.email == "") {
      setLoader(false);
      setErrorDAta({
        ...errorData,
        email: "Please enter your email",
      });
    } else if (!pattern.test(loginFormData.email)) {
      setLoader(false);
      setErrorDAta({
        ...errorData,
        email: "Please enter a valid email",
      });
    } else if (loginFormData.password == "") {
      setLoader(false);
      setErrorDAta({
        ...errorData,
        password: "Please enter your passsword",
      });
    } else {
      setLoader(true);
      signInWithEmailAndPassword(
        auth,
        loginFormData.email,
        loginFormData.password
      )
        .then((userCredential) => {
          setloginFormData({
            email: "",
            password: "",
          });
          // redirect home

          if (userCredential.user.emailVerified === false) {
            setLoader(false);
            toast.success(
              "Email is not varified please check your email and try later",
              {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              }
            );
          } else {
            console.log(userCredential.user);
            disp(activeUser(userCredential.user));
            localStorage.setItem(
              "userInfo",
              JSON.stringify(userCredential.user)
            );
            setLoader(true);
            toast.success("Login Successfull!", {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setTimeout(() => {
              nevigate("/chattingup/home");
            }, 3000);
          }
          // Signed in
        })
        .catch((error) => {
          setLoader(false);
          const errorCode = error.code;
          console.log(errorCode);

          if (errorCode.includes("auth/user-not-found")) {
            setLoader(true);
            toast.success("User not found please sign up!", {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setTimeout(() => {
              nevigate("/registration");
            }, 3000);
          }
          if (errorCode.includes("auth/wrong-password")) {
            setErrorDAta({
              ...errorData,
              password: "Wrong password",
            });
          }
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

  const googleLoginBtn = {
    width: "221px",
    height: "64px",
    marginTop: "30px",
  };
  const fbLoginBtn = {
    width: "221px",
    height: "64px",
  };
  const logoStyle = {
    width: "200px",
    height: "auto",
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
                >
                  <Link>
                    <Image
                      onClick={gmailClick}
                      imageStyle={googleLoginBtn}
                      src="../src/assets/images/googlebtn.png"
                    />
                  </Link>
                  <Link>
                    <Image
                      onClick={fbLoginClick}
                      imageStyle={fbLoginBtn}
                      src="../src/assets/images/fblogin.png"
                    />
                  </Link>
                </Box>
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
                    value={loginFormData.email}
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
                  <PasswordInput
                    sx={{
                      width: "100%",
                      color: "red",
                      marginTop: "30px",
                    }}
                    name="password"
                    onChange={handleChange}
                    value={loginFormData.password}
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
                  {loader ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <ProgressBar
                        height="80"
                        width="80"
                        ariaLabel="progress-bar-loading"
                        wrapperStyle={{}}
                        wrapperClass="progress-bar-wrapper"
                        borderColor="#d1d1d1"
                        barColor=" #5f34f5"
                      />
                    </Box>
                  ) : (
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
                  )}

                  <AuthenticationLink
                    title="Don't have any account?"
                    hrefTitle="Sign Up"
                    href="/registration"
                    style={AuthenticationLinkStyle}
                  />
                  <AuthenticationLink
                    title="Forgot password?"
                    hrefTitle="Click here."
                    href="/forgotpass"
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
