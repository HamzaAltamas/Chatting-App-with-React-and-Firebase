import { Box, height } from "@mui/system";
import React, { useEffect, useState } from "react";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";

const FriendRequestList = ({
  title,
  button,
  buttonName,
  date,
  secontBtnName,
}) => {
  let userData = useSelector((state) => state);
  let [FriendReq, setFriendReq] = useState([]);

  let db = getDatabase();
  useEffect(() => {
    let db = getDatabase();
    const friendReqRef = ref(db, "friendRequest");
    onValue(friendReqRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        if (items.val().recieverID == userData.userData.userInfo.uid) {
          arr.push({ ...items.val(), id: items.key });
        }
      });
      setFriendReq(arr);
    });
  }, []);

  // reject reequest
  let rejectRequest = (id) => {
    remove(ref(db, "friendRequest/" + id));
  };
  // accept request functionality added
  let acceptReq = (acceptInfo) => {
    set(push(ref(db, "friendsList")), {
      ...acceptInfo,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    }).then(() => {
      remove(ref(db, "friendRequest/" + acceptInfo.id));
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
            {FriendReq.length === 0 ? (
              <h4
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#d1d1d1",
                }}
              >
                No Friend Request
              </h4>
            ) : (
              FriendReq.map((item, index) => {
                return (
                  <ListItems
                    key={index}
                    doubleButton={true}
                    button={button}
                    name={item.senderName}
                    imgsrc={item.senderPhoto}
                    buttonName={buttonName}
                    date={date}
                    secontBtnName={secontBtnName}
                    onClick={() => acceptReq(item)}
                    secondButtonOnclick={() => rejectRequest(item.id)}
                  />
                );
              })
            )}
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default FriendRequestList;
