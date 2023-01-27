import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Image from "./Image";
import { useSelector } from "react-redux";
import { getDatabase, onValue, ref } from "firebase/database";

const SmallDeviceUserInfo = () => {
  let userData = useSelector((state) => state);
  let [profession, setProfession] = useState([]);
  let db = getDatabase();
  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      snapshot.forEach((item) => {
        if (userData.userData.userInfo.uid == item.key) {
          setProfession(item.val().profession);
        }
      });
    });
  }, []);
  let ImageStyle = {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
  };
  return (
    <>
      <Box
        sx={{
          padding: "15px 0",

          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          display: { xs: "flex", sm: "flex", md: "none", lg: "none" },
        }}
      >
        <Box
          sx={{
            width: { xs: "20%", sm: "10%", md: "1%" },

            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            imageStyle={ImageStyle}
            src={userData.userData.userInfo.photoURL}
          />
        </Box>
        <Box
          sx={{
            width: "42%",
          }}
        >
          <h5>{userData.userData.userInfo.displayName}</h5>
          <p style={{ color: "#8c8c8c", fontSize: "12px" }}>{profession}</p>
        </Box>
        <Box
          sx={{
            width: "30%",

            display: "flex",
            justifyContent: "end",
          }}
        ></Box>
      </Box>
    </>
  );
};

export default SmallDeviceUserInfo;
