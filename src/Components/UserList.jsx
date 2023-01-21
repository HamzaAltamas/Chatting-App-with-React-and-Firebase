import { Box } from "@mui/system";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import { useSelector } from "react-redux";

const UserList = ({ title, button, buttonName, date }) => {
  let data = useSelector((state) => state);

  let [userList, setUserList] = useState([]);
  let db = getDatabase();
  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid !== item.key) {
          arr.push(item.val());
        }
      });
      setUserList(arr);
    });
  }, []);
  return (
    <>
      <Box
        sx={{
          width: { md: "49%", lg: "32%" },
          height: { xs: "300px", sm: "350px", md: "48%" },
          background: "white",
          borderRadius: "15px",
          marginTop: { xs: "20px", sm: "20px", md: "0" },
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        <ListHeader title={title} />
        <Box
          sx={{
            height: "80%",
            width: "100%",
            padding: "0 20px",
            overflowY: "scroll",
          }}
        >
          <ul>
            {userList.map((item, index) => (
              <ListItems
                key={index}
                name={item.username}
                button={button}
                profession={item.profession}
                buttonName={buttonName}
                date={date}
              />
            ))}
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default UserList;
