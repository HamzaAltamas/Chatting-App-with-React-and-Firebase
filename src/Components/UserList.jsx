import { Box } from "@mui/system";
import { getDatabase, onValue, ref, set, push } from "firebase/database";
import React, { useEffect, useState } from "react";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import { useSelector } from "react-redux";

const UserList = ({ title, button, buttonName, date }) => {
  let data = useSelector((state) => state);
  let [friendreq, setfriendreq] = useState([]);

  let [userList, setUserList] = useState([]);
  let db = getDatabase();
  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid !== item.key) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      console.log(arr);
      setUserList(arr);
    });
  }, []);

  // frndreq data read for send req and pending button show
  useEffect(() => {
    const userRef = ref(db, "friendRequest");
    onValue(userRef, (snapshot) => {
      let arry = [];
      snapshot.forEach((items) => {
        arry.push(items.val().recieverID + items.val().senderUid);
      });
      console.log(arry);
      setfriendreq(arry);
    });
  }, []);

  // friend req functionality start
  let handleFriendRequest = (info) => {
    console.log(info);
    set(push(ref(db, "friendRequest")), {
      senderUid: data.userData.userInfo.uid,
      senderName: data.userData.userInfo.displayName,
      recieverName: info.username,
      recieverID: info.id,
    });
  };
  // friend req functionality end
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
            {userList.map((useritem, index) =>
              friendreq.includes(useritem.id + data.userData.userInfo.uid) ||
              friendreq.includes(data.userData.userInfo.uid + useritem.id) ? (
                <ListItems
                  imgsrc={useritem.photoURL}
                  key={index}
                  name={useritem.username}
                  button={button}
                  profession={useritem.profession}
                  buttonName="Pending"
                  date={date}
                />
              ) : (
                <ListItems
                  imgsrc={useritem.photoURL}
                  onClick={() => handleFriendRequest(useritem)}
                  key={index}
                  name={useritem.username}
                  button={button}
                  profession={useritem.profession}
                  buttonName="+"
                  date={date}
                />
              )
            )}
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default UserList;
