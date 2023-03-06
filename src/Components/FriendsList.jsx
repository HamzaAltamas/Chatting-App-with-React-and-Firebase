import { Box, height } from "@mui/system";
import {
  getDatabase,
  onValue,
  ref,
  set,
  push,
  remove,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";

const FriendsList = ({ title, button, buttonName, date }) => {
  let userData = useSelector((state) => state);
  let [friends, setFriends] = useState([]);
  let [loginArr, setLoginArr] = useState([]);
  let db = getDatabase();
  useEffect(() => {
    let db = getDatabase();
    const friendListRef = ref(db, "friendsList");
    onValue(friendListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        if (
          userData.userData.userInfo.uid == items.val().senderUid ||
          userData.userData.userInfo.uid == items.val().recieverID
        ) {
          arr.push({ ...items.val(), id: items.key });
        }
      });
      setFriends(arr);
    });
  }, []);

  useEffect(() => {
    let db = getDatabase();
    const friendListRef = ref(db, "whologin");
    onValue(friendListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        arr.push(items.val().uid);
      });
      setLoginArr(arr);
    });
  }, []);

  let handleBlock = (blockInfo) => {
    userData.userData.userInfo.uid == blockInfo.senderUid
      ? set(push(ref(db, "blockUser")), {
          blockName: blockInfo.recieverName,
          blockID: blockInfo.recieverID,
          blockPhoto: blockInfo.recieverPhoto,
          blockbyName: blockInfo.senderName,
          blockbyID: blockInfo.senderUid,
          blockbyPhoto: blockInfo.senderPhoto,
        }).then(() => {
          remove(ref(db, "friendsList/" + blockInfo.id));
          toast.success("User Blocked", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        })
      : set(push(ref(db, "blockUser")), {
          blockName: blockInfo.senderName,
          blockID: blockInfo.senderUid,
          blockPhoto: blockInfo.senderPhoto,
          blockbyName: blockInfo.recieverName,
          blockbyID: blockInfo.recieverID,
          blockbyPhoto: blockInfo.recieverPhoto,
        }).then(() => {
          remove(ref(db, "friendsList/" + blockInfo.id));
          toast.success("User Blocked", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
  };

  return (
    <>
      {console.log(loginArr)}
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
            {friends.length === 0 ? (
              <h4
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#d1d1d1",
                }}
              >
                No Friends
              </h4>
            ) : (
              friends.map((item) =>
                userData.userData.userInfo.uid == item.senderUid ? (
                  <ListItems
                    key={item.id}
                    profession={item.lastTxt}
                    // date={item.date}
                    button={true}
                    online={loginArr.includes(item.recieverID) ? true : false}
                    buttonName="Block"
                    name={item.recieverName}
                    imgsrc={item.recieverPhoto}
                    onClick={() => handleBlock(item)}
                  />
                ) : (
                  <ListItems
                    key={item.id}
                    // date={item.date}
                    profession={item.lastTxt}
                    button={true}
                    buttonName="Block"
                    online={loginArr.includes(item.senderUid) ? true : false}
                    name={item.senderName}
                    imgsrc={item.senderPhoto}
                    onClick={() => handleBlock(item)}
                  />
                )
              )
            )}
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default FriendsList;
