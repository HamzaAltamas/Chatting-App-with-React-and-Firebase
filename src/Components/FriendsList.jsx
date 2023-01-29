import { Box, height } from "@mui/system";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";

const FriendsList = ({ title, button, buttonName, date }) => {
  let userData = useSelector((state) => state);
  let [friends, setFriends] = useState([]);

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

  let handleBlock = (blockInfo) => {
    userData.userData.userInfo.uid == blockInfo.senderUid
      ? set(push(ref(db, "blockUser")), {
          blockName: blockInfo.recieverName,
          blockID: blockInfo.recieverID,
          blockPhoto: blockInfo.recieverPhoto,
          blockbyName: blockInfo.senderName,
          blockbyID: senderUid,
          blockbyPhoto: blockInfo.senderPhoto,
        })
      : set(push(ref(db, "blockUser")), {
          blockName: blockInfo.senderName,
          blockID: senderUid,
          blockPhoto: blockInfo.senderPhoto,
          blockbyName: blockInfo.recieverName,
          blockbyID: blockInfo.recieverID,
          blockbyPhoto: blockInfo.recieverPhoto,
        });
  };

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
                    date={item.date}
                    button={true}
                    buttonName="Block"
                    name={item.recieverName}
                    imgsrc={item.recieverPhoto}
                    onClick={() => handleBlock(item)}
                  />
                ) : (
                  <ListItems
                    key={item.id}
                    date={item.date}
                    button={true}
                    buttonName="Block"
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
