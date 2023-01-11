import { Alert, Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import CommonButton from "../Components/CommonButton";
import Heading from "../Components/Heading";
import Image from "../Components/Image";
import InputBox from "../Components/InputBox";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const LoginButtonStyle = styled(Button)({
  width: "100%",
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

const ForgotPassword = () => {
  let navigate = useNavigate();
  let data = useSelector((state) => state);

  let [loginFormData, setloginFormData] = useState({
    email: "",
  });

  const logoStyle = {
    width: "200px",
    height: "auto",
  };

  useEffect(() => {
    if (data.userData.userInfo) {
      navigate("/home");
    }
  }, []);

  // error states start
  let [errorData, setErrorDAta] = useState({
    email: "",
    password: "",
  });
  // error states end
  let handleChange = (e) => {
    let { name, value } = e.target;

    setloginFormData((prevformData) => {
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
    if (loginFormData.email === "") {
      setErrorDAta({
        ...errorData,
        email: "Please enter your email",
      });
    } else {
      //   forgot passwor firebase start
      const auth = getAuth();
      sendPasswordResetEmail(auth, loginFormData.email)
        .then(() => {
          toast.success("Check your email and reset your password", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setloginFormData({
            email: "",
            password: "",
          });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode.includes("auth/invalid-email")) {
            setErrorDAta({
              ...errorData,
              email: "Please enter a valid email",
            });
          }
          if (errorCode.includes("auth/user-not-found")) {
            setErrorDAta({
              ...errorData,
              email: "User not found please sign in first",
            });

            toast.success("User not found please sign in first", {
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
              navigate("/");
            }, 3000);
          }
          // ..
        });
      //   forgot password firebase end
    }
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
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          paddingTop: "15px",
        }}
      >
        <Box>
          <Box
            sx={{
              width: { xs: "300px", sm: "300px", md: "400px" },
              display: "flex",
              justifyContent: "center",
              padding: "30px 30px",
              borderRadius: "15px",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Image
                  width="100%"
                  imageStyle={logoStyle}
                  src="../src/assets/images/logo.png"
                />
              </Box>
              <Heading
                variant="h5"
                component="h1"
                title="Forgot password?"
                sx={{
                  color: "#5F35F5",
                  fontWeight: "bold",
                  textAlign: { xs: "center", sm: "center", md: "center" },
                  fontSize: { xs: "15px", sm: "20", md: "25" },
                  marginTop: { xs: "5px", sm: "7px", md: "10px" },
                }}
              />
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <CommonButton
                  title="get password"
                  buttonName={LoginButtonStyle}
                  onClick={submitClick}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPassword;
