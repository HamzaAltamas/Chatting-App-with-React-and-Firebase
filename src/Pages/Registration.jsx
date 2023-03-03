import { Alert, Grid, LinearProgress, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import CommonButton from "../Components/CommonButton";
import Heading from "../Components/Heading";
import Image from "../Components/Image";
import InputBox from "../Components/InputBox";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AuthenticationLink from "../Components/AuthenticationLink";
import { OutlinePassword } from "../Components/PasswordInput";
import { FaCheck } from "react-icons/fa";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, set, ref, push } from "firebase/database";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { ProgressBar } from "react-loader-spinner";
import { useSelector } from "react-redux";

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
  let nevigate = useNavigate();
  let data = useSelector((state) => state);
  let [inputname, setInputname] = useState();
  let [passwordVal, setPasswordVal] = useState("");

  useEffect(() => {
    if (data.userData.userInfo) {
      nevigate("/chattingup/home");
    }
  }, []);
  // firebase functionality start
  const auth = getAuth();
  const db = getDatabase();
  // firebase functionality end
  let [passIcon, setPassIcon] = useState(false);
  let [loader, setLoader] = useState(false);

  // form data start
  // error states start
  let [errorData, setErrorDAta] = useState({
    email: "",
    fname: "",
    password: "",
  });
  // error states end
  // registration success text state start
  let [regSuccessTxt, setRegSuccessTxt] = useState(false);
  let [progress, setProgress] = useState(0);
  // registration success text state end

  let [regFormData, setRegFormData] = useState({
    email: "",
    fname: "",
    profession: "",
    password: "",
  });

  let handleChange = (e) => {
    let { name, value } = e.target;
    setInputname(name);
    setRegFormData((prevformData) => {
      return {
        ...prevformData,
        [name]: value,
      };
    });

    let namePattern = /[A-Z]{1}[a-z]*/;

    if (name === "fname") {
      if (!namePattern.test(value)) {
        setErrorDAta({
          ...errorData,
          fname: "Name's first letter should be Capital letter",
        });
        return;
      } else {
        setErrorDAta({
          ...errorData,
          fname: "",
        });
      }
    }

    let capital = /[A-Z]/;
    let lower = /[a-z]/;
    let num = /[0-9]/;
    let specialChar = /[(!|@|#|$|%|^|&|*|(|)|_|+)]/;
    if (name == "password") {
      setPasswordVal(value);
      if (!capital.test(value)) {
        setLoader(false);
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Please provide a capital letter",
        });
        return;
      } else if (!lower.test(value)) {
        setLoader(false);
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Please provide a lowercase letter",
        });
        return;
      } else if (!num.test(value)) {
        setLoader(false);
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Please provide a number letter",
        });
        return;
      } else if (!specialChar.test(value)) {
        setLoader(false);
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Please provide a Special Character",
        });
        return;
      } else if (value.length < 6) {
        setLoader(false);
        console.log("6 char");
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Password should be than 6 chracters",
        });
        return;
      } else {
        setErrorDAta({
          ...errorData,
          password: "",
        });
        setPassIcon(true);
      }
    }

    setErrorDAta({
      ...errorData,
      [name]: "",
    });
  };

  let submitClick = () => {
    let capital = /[A-Z]/;
    let lower = /[a-z]/;
    let num = /[0-9]/;
    let specialChar = /[(!|@|#|$|%|^|&|*|(|)|_|+)]/;
    if (inputname == "password") {
      if (!capital.test(passwordVal)) {
        setLoader(false);
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Please provide a capital letter",
        });
        return;
      } else if (!lower.test(passwordVal)) {
        setLoader(false);
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Please provide a lowercase letter",
        });
        return;
      } else if (!num.test(passwordVal)) {
        setLoader(false);
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Please provide a number letter",
        });
        return;
      } else if (!specialChar.test(passwordVal)) {
        setLoader(false);
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Please provide a Special Character",
        });
        return;
      } else if (passwordVal.length < 6) {
        setLoader(false);
        console.log("6 char");
        setPassIcon(false);
        setErrorDAta({
          ...errorData,
          password: "Password should be more than 6 chracters",
        });
        return;
      } else {
        setErrorDAta({
          ...errorData,
          password: "",
        });
        setPassIcon(true);
      }
    }
    setLoader((prev) => !prev);
    let pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regFormData.email == "") {
      setLoader(false);
      setErrorDAta({
        ...errorData,
        email: "Email required",
      });
    } else if (!pattern.test(regFormData.email)) {
      setLoader(false);
      setErrorDAta({
        ...errorData,
        email: "Valid Email required",
      });
    } else if (regFormData.fname == "") {
      setLoader(false);
      setErrorDAta({
        ...errorData,
        fname: "Name required",
      });
    } else if (regFormData.profession == "") {
      setLoader(false);
      setErrorDAta({
        ...errorData,
        profession: "Profession required",
      });
    } else if (regFormData.password == "") {
      setLoader(false);
      setErrorDAta({
        ...errorData,
        password: "Password required",
      });
    } else {
      setLoader(true);
      createUserWithEmailAndPassword(
        auth,
        regFormData.email,
        regFormData.password
      )
        .then((userCredential) => {
          updateProfile(auth.currentUser, {
            displayName: regFormData.fname,
          }).then(() => {
            set(ref(db, "users/" + userCredential.user.uid), {
              username: userCredential.user.displayName,
              email: userCredential.user.email,
              profession: regFormData.profession,
            });
          });
        })
        .then(() => {
          setLoader(false);
          setRegFormData({
            email: "",
            fname: "",
            profession: "",
            password: "",
          });
          setRegSuccessTxt(
            <Alert sx={{ width: "80%", padding: "10px" }} severity="success">
              Registration Successfull
            </Alert>
          );
          setTimeout(() => {
            setRegSuccessTxt(false);
          }, 2500);
          sendEmailVerification(auth.currentUser).then(() => {
            setRegSuccessTxt(
              <Alert sx={{ width: "80%", padding: "10px" }} severity="success">
                Check your email
              </Alert>
            );
          });
          toast.success("Successfully registered!", {
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
            nevigate("/login");
          }, 3000);
        })
        .catch((error) => {
          setLoader(false);
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
                    justifyContent: { xs: "center", sm: "center" },
                  }}
                >
                  <Image
                    width="100%"
                    imageStyle={logoStyle}
                    src="https://i.postimg.cc/SKdyhWVg/logo.png"
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
                      severity="error"
                      sx={{ width: "100%", margin: "10px 0" }}
                    >
                      {errorData.fname}
                    </Alert>
                  )}
                  <InputBox
                    label="Profession"
                    variant="outlined"
                    onChange={handleChange}
                    type="text"
                    name="profession"
                    sx={{
                      width: "100%",
                      marginTop: "30px",
                    }}
                    value={regFormData.profession}
                  />
                  {errorData.profession && (
                    <Alert
                      severity="error"
                      sx={{ width: "100%", margin: "10px 0" }}
                    >
                      {errorData.profession}
                    </Alert>
                  )}
                  <Box
                    sx={{
                      width: "100%",
                      position: "relative",
                      marginTop: "30px",
                    }}
                  >
                    <OutlinePassword
                      sx={{ width: "100%", color: "red" }}
                      name="password"
                      onChange={handleChange}
                      value={regFormData.password}
                    />
                    <LinearProgress variant="determinate" value={progress} />

                    {passIcon && (
                      <FaCheck
                        style={{
                          color: "green",
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          right: "10%",
                        }}
                      />
                    )}
                  </Box>
                  {errorData.password && (
                    <Alert
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
                        title="Sign Up"
                        buttonName={SubmitButtonStyle}
                        onClick={submitClick}
                      />
                    </Box>
                  )}
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
                src="https://i.postimg.cc/T1GFYSwm/registrationimage.png"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Registration;
