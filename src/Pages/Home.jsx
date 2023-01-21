import React, { useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlices";
import CommonButton from "../Components/CommonButton";
import { Box, Button, Stack } from "@mui/material";
import { styled } from "@mui/system";
import { Height } from "@mui/icons-material";
import GroupList from "../Components/GroupList";
import FriendsList from "../Components/FriendsList";
import UserList from "../Components/UserList";
import FriendRequestList from "../Components/FriendRequestList";
import MyGroupsList from "../Components/MyGroupsList";
import BlockedUsers from "../Components/BlockedUsers";
import SmallDeviceUserInfo from "../Components/SmallDeviceUserInfo";

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
          width: "15%",
          height: "100vh",
          display: { xs: "none", sm: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
        }}
      ></Box>
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "85%" },
          height: "100vh",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "97%",
            height: "95%",
            display: { md: "flex " },
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: "15px",
          }}
        >
          <SmallDeviceUserInfo />
          <GroupList title="Grpup List" button={true} buttonName="Join" />

          <FriendsList title="Friends" button={false} />

          <UserList title="User List" button={true} buttonName="+" />

          <FriendRequestList
            title="Friend Request"
            button={true}
            buttonName="Accept"
          />

          <MyGroupsList title="My Groups" button={false} />

          <BlockedUsers
            title="Blocked Users"
            button={true}
            buttonName="Unblock"
          />
        </Box>
      </Box>
    </>
  );
};

export default Home;
