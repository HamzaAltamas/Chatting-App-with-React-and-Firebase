import { Box } from "@mui/system";
import {
  getDatabase,
  onValue,
  ref,
  set,
  push,
  remove,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import { useSelector } from "react-redux";

const UserList = ({ title, button, buttonName, date }) => {
  let data = useSelector((state) => state);
  let [friendreq, setfriendreq] = useState([]);
  let [friendreqid, setFriendreqId] = useState();
  let [friends, setFriends] = useState([]);
  let [friendId, setFriendID] = useState();
  let [blockUser, setBlockuser] = useState([]);

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

      setUserList(arr);
    });
  }, []);

  // frndreq data read for send req and pending button show
  useEffect(() => {
    const userRef = ref(db, "friendRequest");
    onValue(userRef, (snapshot) => {
      let arry = [];
      let cancelReqArr = [];
      snapshot.forEach((items) => {
        arry.push(items.val().recieverID + items.val().senderUid);
        cancelReqArr.push({ ...items.val(), id: items.key });
      });

      setFriendreqId(cancelReqArr);
      setfriendreq(arry);
    });
  }, []);

  // frnds data read for show friend in user4list
  useEffect(() => {
    const userRef = ref(db, "friendsList");
    onValue(userRef, (snapshot) => {
      let arry = [];

      snapshot.forEach((items) => {
        arry.push(items.val().recieverID + items.val().senderUid);
        setFriendID(items.key);
      });

      setFriends(arry);
    });
  }, []);

  // friend req functionality start
  let handleFriendRequest = (info) => {
    set(push(ref(db, "friendRequest")), {
      senderPhoto: data.userData.userInfo.photoURL
        ? data.userData.userInfo.photoURL
        : "",
      senderUid: data.userData.userInfo.uid,
      senderName: data.userData.userInfo.displayName,
      recieverPhoto: info.photoURL ? info.photoURL : "",
      recieverName: info.username,
      recieverID: info.id,
    });
  };
  // friend req functionality end

  // cancel friend red data from database
  let cancelRequest = (useritem) => {
    console.log(useritem);
    friendreqid.map(
      (item) =>
        useritem.id === item.senderUid ||
        (useritem.id === item.recieverID &&
          remove(ref(db, "friendRequest/" + item.id)))
    );
  };
  // cancel friend req data from database

  // usnfriend functionality
  let handleUnfriend = (id) => {
    remove(ref(db, "friendsList/" + id));
  };
  // block user show in user list
  useEffect(() => {
    let db = getDatabase();
    const friendListRef = ref(db, "blockUser");
    onValue(friendListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        arr.push(items.val().blockID + items.val().blockbyID);
      });
      setBlockuser(arr);
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
            {console.log(blockUser)}
            {userList.map((useritem, index) =>
              friends.includes(useritem.id + data.userData.userInfo.uid) ||
              friends.includes(data.userData.userInfo.uid + useritem.id) ? (
                <ListItems
                  imgsrc={useritem.photoURL}
                  key={index}
                  name={useritem.username}
                  button={button}
                  profession={useritem.profession}
                  buttonName="Unfriend"
                  onClick={() => handleUnfriend(friendId)}
                  date={date}
                />
              ) : friendreq.includes(
                  useritem.id + data.userData.userInfo.uid
                ) ||
                friendreq.includes(data.userData.userInfo.uid + useritem.id) ? (
                <ListItems
                  onClick={() => cancelRequest(useritem)}
                  imgsrc={useritem.photoURL}
                  key={index}
                  name={useritem.username}
                  button={button}
                  profession={useritem.profession}
                  buttonName="Cancel Request"
                  date={date}
                />
              ) : blockUser.includes(
                  useritem.id + data.userData.userInfo.uid
                ) ||
                blockUser.includes(data.userData.userInfo.uid + useritem.id) ? (
                <ListItems
                  imgsrc={useritem.photoURL}
                  key={index}
                  name={useritem.username}
                  button={button}
                  profession={useritem.profession}
                  buttonName="Blocked"
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
