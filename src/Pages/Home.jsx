import React, { useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlices";
import CommonButton from "../Components/CommonButton";

import { Button } from "@mui/material";
import { styled } from "@mui/system";

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
  let disp = useDispatch();
  let navigate = useNavigate();
  let data = useSelector((state) => state);

  useEffect(() => {
    if (!data.userData.userInfo) {
      navigate("/login");
    }
  }, []);

  const auth = getAuth();
  //  track user login or logout
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     disp(activeUser(user.uid));
  //   } else {
  //     navigate("/login");
  //   }
  // });
  // // track user login or logout

  let logout = () => {
    signOut(auth).then(() => {
      disp(activeUser(null));
      localStorage.clear("userInfo");
      navigate("/");
    });
  };

  return (
    <div>
      <h1>This is Home page</h1>
      <CommonButton
        title="Logout"
        buttonName={LoginButtonStyle}
        onClick={logout}
      />
    </div>
  );
};

export default Home;
