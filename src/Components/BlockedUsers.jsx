import { Box, height } from "@mui/system";
import React from "react";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import {
  getDatabase,
  onValue,
  ref,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";

const BlockedUsers = ({ title }) => {
  let [blockUsers, setBlockUsers] = useState([]);
  let userData = useSelector((state) => state);

  let db = getDatabase();
  useEffect(() => {
    let db = getDatabase();
    const friendListRef = ref(db, "blockUser");
    onValue(friendListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        // blockID: "uSQtHxpw4eZwh6ejl2CvBTpeuCQ2";
        // blockName: "Hamza Altamas";
        // blockPhoto: "https://firebasestorage.googleapis.com/v0/b/chattingup-57dec.appspot.com/o/profilepicture%2FuSQtHxpw4eZwh6ejl2CvBTpeuCQ2?alt=media&token=518d542f-bf22-46cf-949c-ec0b91581cf4";
        // blockbyID: "KtzcmrwhUfQcxxFZuj7qzc50QAP2";
        // blockbyName: "Hamza Altamas";
        // blockbyPhoto: "https://lh3.googleusercontent.com/a/AEdFTp4B_0clDzIbpQq-TcImqIk9LYOYORhQjSwQIJ2v=s96-c";

        if (items.val().blockbyID == userData.userData.userInfo.uid) {
          arr.push({
            id: items.key,
            blockID: items.val().blockID,
            blockPhoto: items.val().blockPhoto,
            blockName: items.val().blockName,
            blockbyName: items.val().blockbyName,
          });
        } else if (items.val().blockID == userData.userData.userInfo.uid) {
          arr.push({
            id: items.key,
            blockbyID: items.val().blockbyID,
            blockbyPhoto: items.val().blockbyPhoto,
            blockbyName: items.val().blockbyName,
          });
        }
      });
      setBlockUsers(arr);
    });
  }, []);
  let handleUnblock = (items) => {
    set(push(ref(db, "friendsList")), {
      senderPhoto: userData.userData.userInfo.photoURL,
      senderUid: userData.userData.userInfo.uid,
      senderName: userData.userData.userInfo.displayName,
      recieverPhoto: items.blockPhoto,
      recieverName: items.blockName,
      recieverID: items.blockID,
    }).then(() => {
      remove(ref(db, "blockUser/" + items.id));
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
            {blockUsers.length == 0 ? (
              <h4
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#d1d1d1",
                }}
              >
                No Block Users
              </h4>
            ) : (
              blockUsers.map((items) =>
                items.blockID ? (
                  <ListItems
                    key={items.id}
                    name={items.blockbyName}
                    button="true"
                    buttonName="Unblock"
                    onClick={() => handleUnblock(items)}
                    imgsrc={items.blockbyPhoto}
                  />
                ) : (
                  <ListItems
                    key={items.id}
                    name={items.blockName}
                    button={false}
                    profession={`You blocked by ${items.blockbyName}`}
                    imgsrc={items.blockPhoto}
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

export default BlockedUsers;
